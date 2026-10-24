import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Difficulty, GameScreen } from '../types/game';
import {
  buildBossRig,
  buildHeroRig,
  BossRig,
  HeroRig,
  createArenaFloorDecal,
  createContactShadowTexture,
  createPixelStoneTexture,
  createSlashArcMesh,
} from './proceduralModels';

export interface ArenaSceneHandle {
  triggerHeroAttack: (onImpact: () => void, onFinish: () => void) => void;
  triggerBossSlash: (onImpact: () => void, onFinish: () => void) => void;
  resetPositions: () => void;
}

interface ArenaSceneProps {
  screen: GameScreen;
  difficulty: Difficulty;
  isQuestionOpen: boolean;
  slownessActive: boolean;
  onRangeChange: (inRange: boolean) => void;
  onRequestAttack: () => void;
}

// Reusable module-scope math objects (Zero GC in render loop)
const _moveVec = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.8, -2);
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _bossDir = new THREE.Vector3();

const ARENA_RADIUS = 13.2;
const ATTACK_RANGE = 6.2;
const BOSS_COLLISION_RADIUS = 2.55;

export const ArenaScene = forwardRef<ArenaSceneHandle, ArenaSceneProps>(
  ({ screen, difficulty, isQuestionOpen, slownessActive, onRangeChange, onRequestAttack }, ref) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    // Keep latest props in refs so WebGL canvas never re-initializes unnecessarily
    const screenRef = useRef(screen);
    const questionOpenRef = useRef(isQuestionOpen);
    const slownessRef = useRef(slownessActive);
    const onRangeChangeRef = useRef(onRangeChange);
    const onRequestAttackRef = useRef(onRequestAttack);
    const difficultyRef = useRef(difficulty);

    screenRef.current = screen;
    questionOpenRef.current = isQuestionOpen;
    slownessRef.current = slownessActive;
    onRangeChangeRef.current = onRangeChange;
    onRequestAttackRef.current = onRequestAttack;
    difficultyRef.current = difficulty;

    // Action Animation State Ref
    const animStateRef = useRef<{
      mode: 'idle_battle' | 'hero_attack' | 'boss_attack';
      timer: number;
      impactFired: boolean;
      startHeroPos: THREE.Vector3;
      startBossPos: THREE.Vector3;
      onImpact?: () => void;
      onFinish?: () => void;
      screenShake: number;
    }>({
      mode: 'idle_battle',
      timer: 0,
      impactFired: false,
      startHeroPos: new THREE.Vector3(),
      startBossPos: new THREE.Vector3(),
      screenShake: 0,
    });

    const heroRigRef = useRef<HeroRig | null>(null);
    const bossRigRef = useRef<BossRig | null>(null);
    const rebuildBossFnRef = useRef<((diff: Difficulty) => void) | null>(null);

    useImperativeHandle(ref, () => ({
      triggerHeroAttack(onImpact, onFinish) {
        if (!heroRigRef.current) return;
        animStateRef.current = {
          mode: 'hero_attack',
          timer: 0,
          impactFired: false,
          startHeroPos: heroRigRef.current.root.position.clone(),
          startBossPos: bossRigRef.current
            ? bossRigRef.current.root.position.clone()
            : new THREE.Vector3(0, 0, -4.5),
          onImpact,
          onFinish,
          screenShake: 0,
        };
      },
      triggerBossSlash(onImpact, onFinish) {
        if (!bossRigRef.current) return;
        animStateRef.current = {
          mode: 'boss_attack',
          timer: 0,
          impactFired: false,
          startHeroPos: heroRigRef.current
            ? heroRigRef.current.root.position.clone()
            : new THREE.Vector3(0, 0, 5.5),
          startBossPos: bossRigRef.current.root.position.clone(),
          onImpact,
          onFinish,
          screenShake: 0,
        };
      },
      resetPositions() {
        if (heroRigRef.current) {
          heroRigRef.current.root.position.set(0, 0, 6.2);
          heroRigRef.current.root.rotation.y = Math.PI;
        }
        if (bossRigRef.current) {
          bossRigRef.current.root.position.set(0, 0, -4.2);
          bossRigRef.current.root.rotation.y = 0;
        }
        animStateRef.current.mode = 'idle_battle';
      },
    }));

    // Rebuild Boss & Arena Theme whenever difficulty changes
    useEffect(() => {
      if (rebuildBossFnRef.current) {
        rebuildBossFnRef.current(difficulty);
      }
    }, [difficulty]);

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      // Software WebGL Guard per Three.js skill specification
      const isSoftwareGl = (() => {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      })();

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0c1220);
      scene.fog = new THREE.FogExp2(0x0c1220, 0.024);

      // Studio Environment Reflections
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();

      const camera = new THREE.PerspectiveCamera(
        52,
        container.clientWidth / container.clientHeight,
        0.1,
        140,
      );
      camera.position.set(0, 7.5, 13.5);

      // Balanced 3-Point + Hemisphere Lighting Rig
      const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1e1b2e, 0.75);
      hemiLight.position.set(0, 30, 0);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfff0d4, 2.1);
      keyLight.position.set(12, 22, 14);
      keyLight.castShadow = !isSoftwareGl;
      const d = 18;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
      rimLight.position.set(-14, 12, -16);
      scene.add(rimLight);

      const bossPointLight = new THREE.PointLight(0x38bdf8, 4.5, 22, 1.8);
      bossPointLight.position.set(0, 3.5, -4.2);
      scene.add(bossPointLight);

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const shadowTex = createContactShadowTexture();

      // ==================== CIRCULAR GLADIATOR COLOSSEUM ARENA ====================
      const arenaGroup = new THREE.Group();
      scene.add(arenaGroup);

      const stoneTex = createPixelStoneTexture('#252230', '#17141f', '#353045', maxAniso);
      stoneTex.repeat.set(10, 10);

      // Main Circular Stone Platform (CylinderGeometry -> Circle Geometry!)
      const platformGeo = new THREE.CylinderGeometry(ARENA_RADIUS + 1.2, ARENA_RADIUS + 2.2, 2.4, 48);
      const platformMat = new THREE.MeshStandardMaterial({
        map: stoneTex,
        roughness: 0.85,
        metalness: 0.12,
      });
      const platformMesh = new THREE.Mesh(platformGeo, platformMat);
      platformMesh.position.y = -1.2;
      platformMesh.receiveShadow = true;
      arenaGroup.add(platformMesh);

      // Outer Surrounding Moat (Water / Void Mist / Lava Pool depending on Difficulty)
      const moatGeo = new THREE.RingGeometry(ARENA_RADIUS + 1.6, 56, 48);
      const moatMat = new THREE.MeshStandardMaterial({
        color: 0x0c4a6e,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.6,
      });
      const moatMesh = new THREE.Mesh(moatGeo, moatMat);
      moatMesh.rotation.x = -Math.PI / 2;
      moatMesh.position.y = -1.65;
      arenaGroup.add(moatMesh);

      // Geometric Circle Diagram Decal on Arena Floor (prevent Z-fighting with polygonOffset + Y=0.015)
      const floorDecalMat = new THREE.MeshBasicMaterial({
        map: createArenaFloorDecal('#38bdf8', '#bae6fd', maxAniso),
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      const floorDecalMesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), floorDecalMat);
      floorDecalMesh.rotation.x = -Math.PI / 2;
      floorDecalMesh.position.y = 0.015;
      arenaGroup.add(floorDecalMesh);

      // 12 Blocky Dungeon Pillars + Glowing Braziers arranged around the Circle Perimeter
      const pillarCount = 12;
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x322c40,
        roughness: 0.8,
        metalness: 0.2,
      });
      const brazierFlameMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 1.8,
        roughness: 0.2,
      });

      for (let i = 0; i < pillarCount; i++) {
        const angle = (i / pillarCount) * Math.PI * 2;
        // Leave front camera view slightly open so pillars never block third-person camera
        const px = Math.cos(angle) * (ARENA_RADIUS + 0.55);
        const pz = Math.sin(angle) * (ARENA_RADIUS + 0.55);
        const isFrontArc = pz > 9.5 && Math.abs(px) < 8.5;

        const pillarGroup = new THREE.Group();
        pillarGroup.position.set(px, 0, pz);
        pillarGroup.lookAt(0, 0, 0);

        const height = isFrontArc ? 1.1 : 4.4;
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.6, 1.45), pillarMat);
        base.position.y = 0.3;
        base.castShadow = true;
        base.receiveShadow = true;

        const column = new THREE.Mesh(new THREE.BoxGeometry(1.05, height, 1.05), pillarMat);
        column.position.y = 0.6 + height / 2;
        column.castShadow = true;
        column.receiveShadow = true;

        pillarGroup.add(base, column);

        if (!isFrontArc) {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 1.4), pillarMat);
          cap.position.y = 0.6 + height + 0.22;
          const flame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), brazierFlameMat);
          flame.position.y = 0.6 + height + 0.72;
          flame.rotation.set(0.4, 0.4, 0);
          pillarGroup.add(cap, flame);
        }

        arenaGroup.add(pillarGroup);
      }

      // ==================== BUILD BLOCKY HERO & BOSS ====================
      const hero = buildHeroRig(shadowTex);
      hero.root.position.set(0, 0, 6.2);
      hero.root.rotation.y = Math.PI; // face Boss at -Z
      scene.add(hero.root);
      heroRigRef.current = hero;

      // 3D Slash Effect Meshes
      const heroSlashArc = createSlashArcMesh(0xa855f7, 2.6); // Dark-violet/black-sword energy arc
      scene.add(heroSlashArc);

      const bossSlashArc = createSlashArcMesh(0x38bdf8, 4.4);
      scene.add(bossSlashArc);

      // Shockwave Ring on ground for Boss Attack
      const shockwaveGeo = new THREE.RingGeometry(0.6, 1.35, 32);
      const shockwaveMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
      shockwaveMesh.rotation.x = -Math.PI / 2;
      shockwaveMesh.position.y = 0.08;
      shockwaveMesh.visible = false;
      scene.add(shockwaveMesh);

      const disposeObject3D = (obj: THREE.Object3D) => {
        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.geometry?.dispose();
            if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
            else m.material?.dispose();
          }
        });
      };

      const applyArenaThemeAndBoss = (diff: Difficulty) => {
        if (bossRigRef.current) {
          scene.remove(bossRigRef.current.root);
          disposeObject3D(bossRigRef.current.root);
        }

        const newBoss = buildBossRig(diff, shadowTex);
        newBoss.root.position.set(0, 0, -4.2);
        newBoss.root.rotation.y = 0;
        scene.add(newBoss.root);
        bossRigRef.current = newBoss;

        // Elemental Atmosphere per Difficulty (Water / Wind / Magma)
        if (diff === Difficulty.EASY) {
          // Water Temple Dungeon
          scene.background = new THREE.Color(0x081a2c);
          scene.fog = new THREE.FogExp2(0x081a2c, 0.022);
          hemiLight.color.setHex(0x7dd3fc);
          rimLight.color.setHex(0x38bdf8);
          bossPointLight.color.setHex(0x38bdf8);
          brazierFlameMat.color.setHex(0x38bdf8);
          brazierFlameMat.emissive.setHex(0x0ea5e9);
          moatMat.color.setHex(0x075985);
          moatMat.emissive.setHex(0x0284c7);
          (bossSlashArc.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
          shockwaveMat.color.setHex(0x38bdf8);
          if (floorDecalMat.map) floorDecalMat.map.dispose();
          floorDecalMat.map = createArenaFloorDecal('#0ea5e9', '#7dd3fc', maxAniso);
          floorDecalMat.needsUpdate = true;
        } else if (diff === Difficulty.MEDIUM) {
          // Wind Sky Citadel Dungeon
          scene.background = new THREE.Color(0x111c24);
          scene.fog = new THREE.FogExp2(0x111c24, 0.022);
          hemiLight.color.setHex(0xa7f3d0);
          rimLight.color.setHex(0x6ee7b7);
          bossPointLight.color.setHex(0x6ee7b7);
          brazierFlameMat.color.setHex(0x6ee7b7);
          brazierFlameMat.emissive.setHex(0x34d399);
          moatMat.color.setHex(0x1e293b);
          moatMat.emissive.setHex(0x34d399);
          (bossSlashArc.material as THREE.MeshBasicMaterial).color.setHex(0x6ee7b7);
          shockwaveMat.color.setHex(0xa7f3d0);
          if (floorDecalMat.map) floorDecalMat.map.dispose();
          floorDecalMat.map = createArenaFloorDecal('#34d399', '#d1fae5', maxAniso);
          floorDecalMat.needsUpdate = true;
        } else {
          // Hard Mode: Magma Obsidian Core Dungeon
          scene.background = new THREE.Color(0x1f0c09);
          scene.fog = new THREE.FogExp2(0x1f0c09, 0.024);
          hemiLight.color.setHex(0xfdba74);
          rimLight.color.setHex(0xf97316);
          bossPointLight.color.setHex(0xf97316);
          brazierFlameMat.color.setHex(0xf97316);
          brazierFlameMat.emissive.setHex(0xea580c);
          moatMat.color.setHex(0x7c2d12);
          moatMat.emissive.setHex(0xea580c);
          (bossSlashArc.material as THREE.MeshBasicMaterial).color.setHex(0xf97316);
          shockwaveMat.color.setHex(0xfb923c);
          if (floorDecalMat.map) floorDecalMat.map.dispose();
          floorDecalMat.map = createArenaFloorDecal('#ea580c', '#fed7aa', maxAniso);
          floorDecalMat.needsUpdate = true;
        }
      };

      rebuildBossFnRef.current = applyArenaThemeAndBoss;
      applyArenaThemeAndBoss(difficultyRef.current);

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      // ==================== KEYBOARD CONTROLS ====================
      const keys: Record<string, boolean> = {};
      const handleKeyDown = (e: KeyboardEvent) => {
        const code = e.code;
        keys[code] = true;
        if (
          (code === 'Space' || code === 'KeyE' || code === 'Enter') &&
          screenRef.current === GameScreen.BATTLE &&
          !questionOpenRef.current &&
          animStateRef.current.mode === 'idle_battle'
        ) {
          if (heroRigRef.current && bossRigRef.current) {
            const dist = heroRigRef.current.root.position.distanceTo(
              bossRigRef.current.root.position,
            );
            if (dist <= ATTACK_RANGE) {
              e.preventDefault();
              onRequestAttackRef.current();
            }
          }
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        keys[e.code] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // ==================== GAME LOOP & ANIMATIONS ====================
      const clock = new THREE.Clock();
      let walkPhase = 0;
      let lastInRange = false;
      let frameId = 0;

      function afterDraw(cb: () => void) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (sync && state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      }

      function tick() {
        const rawDelta = clock.getDelta();
        const dt = Math.min(rawDelta, 0.05);
        const elapsed = clock.getElapsedTime();

        const heroObj = heroRigRef.current;
        const bossObj = bossRigRef.current;
        const anim = animStateRef.current;

        if (heroObj && bossObj) {
          // 1. Update Boss Elemental Orbit & Aura Particles
          bossObj.orbitRing.rotation.y +=
            dt * (difficultyRef.current === Difficulty.MEDIUM ? 2.4 : 1.0);
          bossPointLight.position.set(
            bossObj.root.position.x,
            3.4,
            bossObj.root.position.z,
          );

          for (let i = 0; i < bossObj.particleData.length; i++) {
            const p = bossObj.particleData[i];
            p.angle += dt * p.speed;
            if (difficultyRef.current === Difficulty.EASY) {
              // Rising & falling water droplets
              p.yOffset = 0.4 + ((elapsed * 1.1 + i * 0.3) % 3.8);
            } else if (difficultyRef.current === Difficulty.MEDIUM) {
              // Spiraling tornado wind gusts
              p.yOffset = 0.5 + ((elapsed * 2.5 + i * 0.25) % 4.4);
            } else {
              // Rising magma embers
              p.yOffset = 0.3 + ((elapsed * 1.6 + i * 0.35) % 4.6);
            }
            _dummyPos.set(
              Math.cos(p.angle) * p.radius,
              p.yOffset,
              Math.sin(p.angle) * p.radius,
            );
            _dummyQuat.setFromEuler(new THREE.Euler(elapsed * 2, p.angle, elapsed));
            _dummyScale.setScalar(p.scale);
            _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
            bossObj.auraParticles.setMatrixAt(i, _dummyMatrix);
          }
          bossObj.auraParticles.instanceMatrix.needsUpdate = true;

          // 2. Handle Active Screen Mode
          if (screenRef.current !== GameScreen.BATTLE) {
            // Cinematic Orbiting Showcase for Main Menu / Guidebook / Victory
            heroObj.root.position.set(0, 0, 5.2);
            heroObj.root.rotation.y = Math.PI;
            bossObj.root.position.set(0, 0, -4.2);
            bossObj.root.rotation.y = 0;

            // Gentle idle breathing
            heroObj.leftArmPivot.rotation.set(Math.sin(elapsed * 2) * 0.08, 0, 0);
            heroObj.rightArmPivot.rotation.set(-0.2 + Math.cos(elapsed * 2) * 0.08, 0, 0);
            heroObj.leftLegPivot.rotation.set(0, 0, 0);
            heroObj.rightLegPivot.rotation.set(0, 0, 0);

            bossObj.bodyGroup.position.y = Math.sin(elapsed * 1.8) * 0.08;
            bossObj.leftArmPivot.rotation.x = Math.sin(elapsed * 1.5) * 0.14;
            bossObj.rightArmPivot.rotation.x = -0.25 + Math.cos(elapsed * 1.5) * 0.14;

            const camAngle = elapsed * 0.22;
            camera.position.set(
              Math.sin(camAngle) * 14.5,
              6.6 + Math.sin(elapsed * 0.5) * 0.6,
              Math.cos(camAngle) * 14.5,
            );
            camera.lookAt(0, 2.0, 0);
          } else {
            // ==================== ACTIVE 3D GLADIATOR BATTLE ====================
            if (anim.mode === 'idle_battle') {
              heroSlashArc.visible = false;
              bossSlashArc.visible = false;
              shockwaveMesh.visible = false;

              // Player WASD / Arrow movement (when question modal is closed)
              _moveVec.set(0, 0, 0);
              if (!questionOpenRef.current) {
                if (keys['KeyW'] || keys['ArrowUp']) _moveVec.z -= 1;
                if (keys['KeyS'] || keys['ArrowDown']) _moveVec.z += 1;
                if (keys['KeyA'] || keys['ArrowLeft']) _moveVec.x -= 1;
                if (keys['KeyD'] || keys['ArrowRight']) _moveVec.x += 1;
              }

              const isMoving = _moveVec.lengthSq() > 0.001;
              if (isMoving) {
                _moveVec.normalize();
                // Slowness debuff cuts movement speed in half!
                const baseSpeed = slownessRef.current ? 3.1 : 6.8;
                heroObj.root.position.x += _moveVec.x * baseSpeed * dt;
                heroObj.root.position.z += _moveVec.z * baseSpeed * dt;

                // Keep Hero inside circular arena perimeter
                const rDist = Math.hypot(heroObj.root.position.x, heroObj.root.position.z);
                if (rDist > ARENA_RADIUS - 0.8) {
                  const clampScale = (ARENA_RADIUS - 0.8) / rDist;
                  heroObj.root.position.x *= clampScale;
                  heroObj.root.position.z *= clampScale;
                }

                // Prevent walking through Boss body
                _bossDir.subVectors(heroObj.root.position, bossObj.root.position);
                _bossDir.y = 0;
                const distToBoss = _bossDir.length();
                if (distToBoss < BOSS_COLLISION_RADIUS) {
                  _bossDir.normalize().multiplyScalar(BOSS_COLLISION_RADIUS);
                  heroObj.root.position.x = bossObj.root.position.x + _bossDir.x;
                  heroObj.root.position.z = bossObj.root.position.z + _bossDir.z;
                }

                // Smoothly rotate Hero toward movement direction
                const targetYaw = Math.atan2(_moveVec.x, _moveVec.z);
                let diffYaw = targetYaw - heroObj.root.rotation.y;
                while (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
                while (diffYaw < -Math.PI) diffYaw += Math.PI * 2;
                heroObj.root.rotation.y += diffYaw * Math.min(1, dt * 14);

                // Human-like Walking Cycle Animation (opposite arms & legs + subtle body bob + cape sway)
                const walkFreq = slownessRef.current ? 6.0 : 11.5;
                walkPhase += dt * walkFreq;
                const swing = Math.sin(walkPhase) * 0.72;

                heroObj.leftLegPivot.rotation.x = swing;
                heroObj.rightLegPivot.rotation.x = -swing;
                heroObj.leftArmPivot.rotation.x = -swing * 0.85;
                heroObj.rightArmPivot.rotation.x = swing * 0.65 - 0.25;
                heroObj.rightArmPivot.rotation.z = 0;
                heroObj.bodyGroup.position.y = Math.abs(Math.cos(walkPhase)) * 0.09;
                heroObj.cape.rotation.x = 0.34 + Math.abs(Math.sin(walkPhase)) * 0.18;
              } else {
                // Smoothly settle back to ready stance
                heroObj.leftLegPivot.rotation.x = THREE.MathUtils.damp(
                  heroObj.leftLegPivot.rotation.x,
                  0,
                  10,
                  dt,
                );
                heroObj.rightLegPivot.rotation.x = THREE.MathUtils.damp(
                  heroObj.rightLegPivot.rotation.x,
                  0,
                  10,
                  dt,
                );
                heroObj.leftArmPivot.rotation.x = THREE.MathUtils.damp(
                  heroObj.leftArmPivot.rotation.x,
                  Math.sin(elapsed * 2.5) * 0.08,
                  10,
                  dt,
                );
                heroObj.rightArmPivot.rotation.x = THREE.MathUtils.damp(
                  heroObj.rightArmPivot.rotation.x,
                  -0.28 + Math.cos(elapsed * 2.5) * 0.08,
                  10,
                  dt,
                );
                heroObj.rightArmPivot.rotation.z = THREE.MathUtils.damp(
                  heroObj.rightArmPivot.rotation.z,
                  0,
                  10,
                  dt,
                );
                heroObj.bodyGroup.position.y = THREE.MathUtils.damp(
                  heroObj.bodyGroup.position.y,
                  0,
                  10,
                  dt,
                );
                heroObj.cape.rotation.x = THREE.MathUtils.damp(
                  heroObj.cape.rotation.x,
                  0.14 + Math.sin(elapsed * 2) * 0.04,
                  8,
                  dt,
                );
              }

              // Boss faces the Hero menacingly
              const angleToHero = Math.atan2(
                heroObj.root.position.x - bossObj.root.position.x,
                heroObj.root.position.z - bossObj.root.position.z,
              );
              let bDiff = angleToHero - bossObj.root.rotation.y;
              while (bDiff > Math.PI) bDiff -= Math.PI * 2;
              while (bDiff < -Math.PI) bDiff += Math.PI * 2;
              bossObj.root.rotation.y += bDiff * Math.min(1, dt * 5);

              bossObj.bodyGroup.position.y = Math.sin(elapsed * 2.2) * 0.08;
              bossObj.leftArmPivot.rotation.x = Math.sin(elapsed * 1.8) * 0.14;
              bossObj.rightArmPivot.rotation.x = -0.35 + Math.cos(elapsed * 1.8) * 0.14;
              bossObj.rightArmPivot.rotation.z = 0;

              // Check Attack Range to Boss
              const dist = heroObj.root.position.distanceTo(bossObj.root.position);
              const inRangeNow = dist <= ATTACK_RANGE;
              if (inRangeNow !== lastInRange) {
                lastInRange = inRangeNow;
                onRangeChangeRef.current(inRangeNow);
              }
            } else if (anim.mode === 'hero_attack') {
              // ==================== HERO BLACK SWORD ATTACK ANIMATION ====================
              anim.timer += dt;
              const duration = 1.15;
              const t = Math.min(anim.timer / duration, 1);

              // Face Boss directly
              const angleToBoss = Math.atan2(
                bossObj.root.position.x - anim.startHeroPos.x,
                bossObj.root.position.z - anim.startHeroPos.z,
              );
              heroObj.root.rotation.y = angleToBoss;

              // Calculate strike point near Boss
              _bossDir
                .subVectors(bossObj.root.position, anim.startHeroPos)
                .setY(0)
                .normalize();
              const strikePos = bossObj.root.position
                .clone()
                .sub(_bossDir.clone().multiplyScalar(2.65));

              if (t < 0.35) {
                // Dash forward + Wind up Black Sword high overhead
                const p = t / 0.35;
                heroObj.root.position.lerpVectors(anim.startHeroPos, strikePos, p);
                heroObj.bodyGroup.position.y = Math.sin(p * Math.PI) * 0.65;
                heroObj.rightArmPivot.rotation.x = THREE.MathUtils.lerp(-0.3, -2.55, p);
                heroObj.rightArmPivot.rotation.z = THREE.MathUtils.lerp(0, -0.35, p);
                heroObj.leftArmPivot.rotation.x = 0.6 * p;
              } else if (t < 0.68) {
                // Heavy Downward Diagonal Cleave with Black Sword!
                const p = (t - 0.35) / 0.33;
                heroObj.root.position.copy(strikePos);
                heroObj.rightArmPivot.rotation.x = THREE.MathUtils.lerp(-2.55, 0.95, p);
                heroObj.rightArmPivot.rotation.z = THREE.MathUtils.lerp(-0.35, 0.45, p);

                if (!anim.impactFired && p > 0.35) {
                  anim.impactFired = true;
                  anim.screenShake = 0.42;
                  anim.onImpact?.();
                }

                // Show Black-Violet Crescent Slash Arc
                heroSlashArc.visible = true;
                heroSlashArc.position.set(
                  bossObj.root.position.x,
                  1.9,
                  bossObj.root.position.z + 0.9,
                );
                heroSlashArc.rotation.set(0.35, angleToBoss, p * 2.2 - 0.6);
                heroSlashArc.scale.setScalar(0.85 + p * 0.55);
                (heroSlashArc.material as THREE.MeshBasicMaterial).opacity = Math.sin(
                  p * Math.PI,
                );

                // Boss flinches backward on hit
                bossObj.bodyGroup.position.z = -Math.sin(p * Math.PI) * 0.45;
                bossObj.head.rotation.x = -Math.sin(p * Math.PI) * 0.35;
              } else {
                // Leap back to safe stance
                const p = (t - 0.68) / 0.32;
                heroSlashArc.visible = false;
                bossObj.bodyGroup.position.z = 0;
                bossObj.head.rotation.x = 0;
                heroObj.root.position.lerpVectors(strikePos, anim.startHeroPos, p);
                heroObj.rightArmPivot.rotation.x = THREE.MathUtils.lerp(0.95, -0.28, p);
                heroObj.rightArmPivot.rotation.z = THREE.MathUtils.lerp(0.45, 0, p);
              }

              if (t >= 1) {
                heroSlashArc.visible = false;
                anim.mode = 'idle_battle';
                anim.onFinish?.();
              }
            } else if (anim.mode === 'boss_attack') {
              // ==================== BOSS ELEMENTAL SLASHING ANIMATION ====================
              anim.timer += dt;
              const duration = 1.35;
              const t = Math.min(anim.timer / duration, 1);

              const angleToHero = Math.atan2(
                anim.startHeroPos.x - anim.startBossPos.x,
                anim.startHeroPos.z - anim.startBossPos.z,
              );
              bossObj.root.rotation.y = angleToHero;

              _bossDir
                .subVectors(anim.startHeroPos, anim.startBossPos)
                .setY(0)
                .normalize();
              const bossStrikePos = anim.startHeroPos
                .clone()
                .sub(_bossDir.clone().multiplyScalar(2.9));

              if (t < 0.38) {
                // Boss lunges toward Hero & raises giant elemental weapon
                const p = t / 0.38;
                bossObj.root.position.lerpVectors(anim.startBossPos, bossStrikePos, p);
                bossObj.rightArmPivot.rotation.x = THREE.MathUtils.lerp(-0.35, -2.6, p);
                bossObj.rightArmPivot.rotation.z = THREE.MathUtils.lerp(0, 0.48, p);
                bossObj.leftArmPivot.rotation.x = THREE.MathUtils.lerp(0, -1.2, p);
              } else if (t < 0.72) {
                // Massive Elemental Slashing Arc + Shockwave Ring!
                const p = (t - 0.38) / 0.34;
                bossObj.root.position.copy(bossStrikePos);
                bossObj.rightArmPivot.rotation.x = THREE.MathUtils.lerp(-2.6, 1.05, p);
                bossObj.rightArmPivot.rotation.z = THREE.MathUtils.lerp(0.48, -0.65, p);

                if (!anim.impactFired && p > 0.3) {
                  anim.impactFired = true;
                  anim.screenShake = 0.65;
                  anim.onImpact?.();
                }

                // Giant Elemental Slash Crescent
                bossSlashArc.visible = true;
                bossSlashArc.position.set(
                  anim.startHeroPos.x,
                  1.55,
                  anim.startHeroPos.z,
                );
                bossSlashArc.rotation.set(Math.PI / 2.3, 0, elapsed * 8);
                bossSlashArc.scale.setScalar(0.75 + p * 0.75);
                (bossSlashArc.material as THREE.MeshBasicMaterial).opacity =
                  Math.sin(p * Math.PI) * 0.95;

                // Elemental Expanding Ground Shockwave
                shockwaveMesh.visible = true;
                shockwaveMesh.position.set(
                  anim.startHeroPos.x,
                  0.08,
                  anim.startHeroPos.z,
                );
                shockwaveMesh.scale.setScalar(1 + p * 4.5);
                shockwaveMat.opacity = (1 - p) * 0.85;

                // Knock Hero slightly back visually
                heroObj.bodyGroup.position.z = Math.sin(p * Math.PI) * 0.55;
                heroObj.head.rotation.x = -Math.sin(p * Math.PI) * 0.4;
              } else {
                // Boss steps back to center throne position
                const p = (t - 0.72) / 0.28;
                bossSlashArc.visible = false;
                shockwaveMesh.visible = false;
                heroObj.bodyGroup.position.z = 0;
                heroObj.head.rotation.x = 0;
                bossObj.root.position.lerpVectors(bossStrikePos, anim.startBossPos, p);
                bossObj.rightArmPivot.rotation.x = THREE.MathUtils.lerp(1.05, -0.35, p);
                bossObj.rightArmPivot.rotation.z = THREE.MathUtils.lerp(-0.65, 0, p);
                bossObj.leftArmPivot.rotation.x = THREE.MathUtils.lerp(-1.2, 0, p);
              }

              if (t >= 1) {
                bossSlashArc.visible = false;
                shockwaveMesh.visible = false;
                anim.mode = 'idle_battle';
                anim.onFinish?.();
              }
            }

            // Smooth Third-Person Gladiator Camera Tracking (keeps both Hero & Boss framed!)
            _targetCamPos.set(
              heroObj.root.position.x * 0.65,
              6.8,
              heroObj.root.position.z + 8.6,
            );
            if (anim.screenShake > 0.01) {
              anim.screenShake = Math.max(0, anim.screenShake - dt * 1.8);
              _targetCamPos.x += (Math.random() - 0.5) * anim.screenShake;
              _targetCamPos.y += (Math.random() - 0.5) * anim.screenShake;
            }

            camera.position.x = THREE.MathUtils.damp(
              camera.position.x,
              _targetCamPos.x,
              6,
              dt,
            );
            camera.position.y = THREE.MathUtils.damp(
              camera.position.y,
              _targetCamPos.y,
              6,
              dt,
            );
            camera.position.z = THREE.MathUtils.damp(
              camera.position.z,
              _targetCamPos.z,
              6,
              dt,
            );

            _targetLookAt.set(
              (heroObj.root.position.x + bossObj.root.position.x) * 0.4,
              1.9,
              (heroObj.root.position.z + bossObj.root.position.z) * 0.45,
            );
            _currentLookAt.x = THREE.MathUtils.damp(
              _currentLookAt.x,
              _targetLookAt.x,
              8,
              dt,
            );
            _currentLookAt.y = THREE.MathUtils.damp(
              _currentLookAt.y,
              _targetLookAt.y,
              8,
              dt,
            );
            _currentLookAt.z = THREE.MathUtils.damp(
              _currentLookAt.z,
              _targetLookAt.z,
              8,
              dt,
            );
            camera.lookAt(_currentLookAt);
          }
        }

        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }

      tick();

      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('resize', handleResize);
        disposeObject3D(scene);
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 w-full h-full z-0" />;
  },
);
