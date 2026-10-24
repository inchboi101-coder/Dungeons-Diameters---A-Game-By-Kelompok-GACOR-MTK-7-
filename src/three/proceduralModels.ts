import * as THREE from 'three';
import { Difficulty } from '../types/game';

export interface HeroRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  head: THREE.Group;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
  leftLegPivot: THREE.Group;
  rightLegPivot: THREE.Group;
  swordGroup: THREE.Group;
  cape: THREE.Mesh;
}

export interface BossRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  head: THREE.Group;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
  leftLegPivot: THREE.Group;
  rightLegPivot: THREE.Group;
  weaponGroup: THREE.Group;
  orbitRing: THREE.Group;
  auraParticles: THREE.InstancedMesh;
  particleData: { angle: number; radius: number; yOffset: number; speed: number; scale: number }[];
}

export function createPixelStoneTexture(
  baseHex: string,
  darkHex: string,
  accentHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 128, 128);

  // Pixel cobble bricks (16x16 grid)
  const cell = 8;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const seed = (x * 37 + y * 91) % 19;
      if (seed < 4) {
        ctx.fillStyle = darkHex;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      } else if (seed === 7 || seed === 13) {
        ctx.fillStyle = accentHex;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }

  // Brick mortar lines
  ctx.fillStyle = darkHex;
  ctx.fillRect(0, 0, 128, 4);
  ctx.fillRect(0, 64, 128, 4);
  ctx.fillRect(0, 0, 4, 64);
  ctx.fillRect(64, 64, 4, 64);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestMipmapLinearFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createArenaFloorDecal(
  accentHex: string,
  glowHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);
  const cx = 256;
  const cy = 256;

  // Outer Geometric Circle
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 232, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = glowHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 210, 0, Math.PI * 2);
  ctx.stroke();

  // Diameter & Perpendicular Chord lines (Circle Geometry theme!)
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 232, cy);
  ctx.lineTo(cx + 232, cy);
  ctx.moveTo(cx, cy - 232);
  ctx.lineTo(cx, cy + 232);
  ctx.stroke();

  // Cyclic Quadrilateral inscribed in the arena circle!
  ctx.strokeStyle = glowHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const px = cx + Math.cos(ang) * 210;
    const py = cy + Math.sin(ang) * 210;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Inner Central Angle Ring
  ctx.beginPath();
  ctx.arc(cx, cy, 68, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
  grad.addColorStop(0, 'rgba(0,0,0,0.65)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Blocky Hero Rig (Minecraft Dungeons Gladiator Knight with Black Sword)
 * Grounded at Y=0.
 */
export function buildHeroRig(shadowTex: THREE.Texture): HeroRig {
  const root = new THREE.Group();

  // Contact shadow on ground
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.7),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    }),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.02;
  root.add(shadowPlane);

  const armorDarkMat = new THREE.MeshStandardMaterial({
    color: 0x2b303c,
    roughness: 0.42,
    metalness: 0.65,
  });
  const armorTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd49b38,
    roughness: 0.28,
    metalness: 0.85,
  });
  const tunicMat = new THREE.MeshStandardMaterial({
    color: 0x7c2929,
    roughness: 0.82,
    metalness: 0.1,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe6b891,
    roughness: 0.7,
    metalness: 0.05,
  });
  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x1c1e26,
    roughness: 0.65,
    metalness: 0.35,
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Legs (pivot at hip y = 0.78)
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.2, 0.78, 0);
  const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.78, 0.34), armorDarkMat);
  leftLegMesh.position.y = -0.39;
  leftLegMesh.castShadow = true;
  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.4), bootMat);
  leftBoot.position.set(0, -0.66, 0.03);
  leftLegPivot.add(leftLegMesh, leftBoot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.2, 0.78, 0);
  const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.78, 0.34), armorDarkMat);
  rightLegMesh.position.y = -0.39;
  rightLegMesh.castShadow = true;
  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.4), bootMat);
  rightBoot.position.set(0, -0.66, 0.03);
  rightLegPivot.add(rightLegMesh, rightBoot);

  bodyGroup.add(leftLegPivot, rightLegPivot);

  // Torso (from 0.78 to 1.66)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.88, 0.44), armorDarkMat);
  torso.position.y = 1.22;
  torso.castShadow = true;
  bodyGroup.add(torso);

  // Chestplate & Gold Belt Emblem
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.48, 0.5), armorDarkMat);
  chestPlate.position.set(0, 1.36, 0);
  chestPlate.castShadow = true;
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.14, 0.48), tunicMat);
  belt.position.set(0, 0.86, 0);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.52), armorTrimMat);
  buckle.position.set(0, 0.86, 0);
  bodyGroup.add(chestPlate, belt, buckle);

  // Red Hero Cape
  const cape = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.05, 0.08), tunicMat);
  cape.position.set(0, 1.12, -0.27);
  cape.rotation.x = 0.14;
  cape.castShadow = true;
  bodyGroup.add(cape);

  // Blocky Head + Knight Visor Helmet
  const head = new THREE.Group();
  head.position.set(0, 1.68, 0);
  const faceBox = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.66, 0.66), skinMat);
  faceBox.position.y = 0.33;
  faceBox.castShadow = true;

  const helmTop = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.32, 0.74), armorDarkMat);
  helmTop.position.y = 0.55;
  helmTop.castShadow = true;

  const helmCrest = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.8), armorTrimMat);
  helmCrest.position.set(0, 0.72, 0);

  // Pixel Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.05), eyeMat);
  leftEye.position.set(-0.15, 0.34, 0.33);
  const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.05), eyeMat);
  rightEye.position.set(0.15, 0.34, 0.33);

  head.add(faceBox, helmTop, helmCrest, leftEye, rightEye);
  bodyGroup.add(head);

  // Left Arm + Pauldron
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.56, 1.56, 0);
  const leftPauldron = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.3, 0.44), armorTrimMat);
  leftPauldron.position.set(-0.02, 0.02, 0);
  const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.78, 0.3), armorDarkMat);
  leftArmMesh.position.y = -0.35;
  leftArmMesh.castShadow = true;
  leftArmPivot.add(leftPauldron, leftArmMesh);

  // Right Arm + Pauldron + BLACK SWORD (Pedang Hitam)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.56, 1.56, 0);
  const rightPauldron = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.3, 0.44), armorTrimMat);
  rightPauldron.position.set(0.02, 0.02, 0);
  const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.78, 0.3), armorDarkMat);
  rightArmMesh.position.y = -0.35;
  rightArmMesh.castShadow = true;

  // Black Sword Group (Dark Obsidian / Onyx Blade)
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0, -0.68, 0.22);
  swordGroup.rotation.x = Math.PI / 3; // angled forward ready for battle

  const blackBladeMat = new THREE.MeshStandardMaterial({
    color: 0x0d0e14,
    roughness: 0.16,
    metalness: 0.92,
    emissive: 0x16192b,
    emissiveIntensity: 0.35,
  });
  const blackCoreEdgeMat = new THREE.MeshStandardMaterial({
    color: 0x262b3d,
    roughness: 0.25,
    metalness: 0.85,
  });
  const hiltMat = new THREE.MeshStandardMaterial({
    color: 0x1a1621,
    roughness: 0.5,
    metalness: 0.7,
  });

  // Handle & Pommel
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.42, 0.09), hiltMat);
  const pommel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.16), armorTrimMat);
  pommel.position.y = -0.24;

  // Blocky Crossguard
  const crossGuard = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.12, 0.16), hiltMat);
  crossGuard.position.y = 0.22;
  const guardGem = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 0.18),
    new THREE.MeshBasicMaterial({ color: 0xa855f7 }),
  );
  guardGem.position.y = 0.22;

  // Stepped Blocky Black Blade (Minecraft Dungeons Broadsword silhouette)
  const bladeBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.45, 0.07), blackBladeMat);
  bladeBase.position.y = 1.0;
  bladeBase.castShadow = true;

  const bladeCore = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.35, 0.09), blackCoreEdgeMat);
  bladeCore.position.y = 0.98;

  const bladeTip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.24, 0.07), blackBladeMat);
  bladeTip.position.y = 1.82;

  swordGroup.add(handle, pommel, crossGuard, guardGem, bladeBase, bladeCore, bladeTip);
  rightArmPivot.add(rightPauldron, rightArmMesh, swordGroup);

  bodyGroup.add(leftArmPivot, rightArmPivot);

  return {
    root,
    bodyGroup,
    head,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    swordGroup,
    cape,
  };
}

/**
 * Blocky Elemental Boss Rig (Minecraft Dungeons Boss Scale)
 * Easy = Water (Tidal Guardian)
 * Medium = Wind (Tempest Sovereign)
 * Hard = Magma (Obsidian Magma Colossus)
 */
export function buildBossRig(difficulty: Difficulty, shadowTex: THREE.Texture): BossRig {
  const root = new THREE.Group();

  const palette =
    difficulty === Difficulty.EASY
      ? {
          primary: 0x0f4c81,
          secondary: 0x1ca3ec,
          glow: 0x38bdf8,
          dark: 0x0a2540,
          weapon: 0x22d3ee,
        }
      : difficulty === Difficulty.MEDIUM
        ? {
            primary: 0x334155,
            secondary: 0x94a3b8,
            glow: 0x6ee7b7,
            dark: 0x1e293b,
            weapon: 0xa7f3d0,
          }
        : {
            primary: 0x291717,
            secondary: 0x991b1b,
            glow: 0xf97316,
            dark: 0x140a0a,
            weapon: 0xfb923c,
          };

  // Large Boss Contact Shadow
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 3.8),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.68,
    }),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.02;
  root.add(shadowPlane);

  const primaryMat = new THREE.MeshStandardMaterial({
    color: palette.primary,
    roughness: 0.55,
    metalness: 0.45,
  });
  const secondaryMat = new THREE.MeshStandardMaterial({
    color: palette.secondary,
    roughness: 0.3,
    metalness: 0.7,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: palette.dark,
    roughness: 0.75,
    metalness: 0.3,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: palette.glow,
    emissive: palette.glow,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Heavy Golem Legs
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.52, 1.35, 0);
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.35, 0.78), darkMat);
  leftLeg.position.y = -0.675;
  leftLeg.castShadow = true;
  const leftKneeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.22, 0.82), glowMat);
  leftKneeGlow.position.y = -0.45;
  leftLegPivot.add(leftLeg, leftKneeGlow);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.52, 1.35, 0);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.35, 0.78), darkMat);
  rightLeg.position.y = -0.675;
  rightLeg.castShadow = true;
  const rightKneeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.22, 0.82), glowMat);
  rightKneeGlow.position.y = -0.45;
  rightLegPivot.add(rightLeg, rightKneeGlow);

  bodyGroup.add(leftLegPivot, rightLegPivot);

  // Massive Minecraft Dungeons Redstone/Elemental Monstrosity Torso
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.48, 0.95), darkMat);
  pelvis.position.y = 1.55;
  pelvis.castShadow = true;

  const chest = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.45, 1.25), primaryMat);
  chest.position.y = 2.45;
  chest.castShadow = true;

  // Glowing Elemental Circle Core in Boss Chest (Circle Geometry Motif!)
  const coreFrame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 1.32), secondaryMat);
  coreFrame.position.y = 2.5;
  coreFrame.rotation.z = Math.PI / 4;
  const coreGem = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1.38, 16), glowMat);
  coreGem.rotation.x = Math.PI / 2;
  coreGem.position.y = 2.5;

  bodyGroup.add(pelvis, chest, coreFrame, coreGem);

  // Boss Head with Elemental Crown / Horns
  const head = new THREE.Group();
  head.position.set(0, 3.22, 0.08);
  const skull = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.05, 1.08), primaryMat);
  skull.position.y = 0.52;
  skull.castShadow = true;

  const brow = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.24, 1.16), darkMat);
  brow.position.set(0, 0.72, 0.04);

  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.1), glowMat);
  eyeL.position.set(-0.26, 0.54, 0.53);
  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.1), glowMat);
  eyeR.position.set(0.26, 0.54, 0.53);

  // Elemental Horns / Fins
  const hornL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.72, 0.28), glowMat);
  hornL.position.set(-0.62, 0.95, -0.05);
  hornL.rotation.z = 0.22;
  const hornR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.72, 0.28), glowMat);
  hornR.position.set(0.62, 0.95, -0.05);
  hornR.rotation.z = -0.22;

  head.add(skull, brow, eyeL, eyeR, hornL, hornR);
  bodyGroup.add(head);

  // Boss Left Arm
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-1.38, 3.0, 0);
  const leftShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.76, 0.92), secondaryMat);
  leftShoulder.castShadow = true;
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.64, 1.65, 0.68), primaryMat);
  leftArm.position.y = -0.95;
  leftArm.castShadow = true;
  const leftFist = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.52, 0.76), glowMat);
  leftFist.position.y = -1.75;
  leftArmPivot.add(leftShoulder, leftArm, leftFist);

  // Boss Right Arm + Giant Elemental Cleaver / Trident / Magma Greatsword
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(1.38, 3.0, 0);
  const rightShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.76, 0.92), secondaryMat);
  rightShoulder.castShadow = true;
  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.64, 1.65, 0.68), primaryMat);
  rightArm.position.y = -0.95;
  rightArm.castShadow = true;

  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0, -1.68, 0.35);
  weaponGroup.rotation.x = Math.PI / 2.6;

  const weaponShaft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.2), darkMat);
  weaponShaft.position.y = 0.8;

  if (difficulty === Difficulty.EASY) {
    // Tidal Trident Blades
    const centerProng = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.25, 0.14), glowMat);
    centerProng.position.y = 2.4;
    const prongL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.95, 0.14), glowMat);
    prongL.position.set(-0.42, 2.2, 0);
    const prongR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.95, 0.14), glowMat);
    prongR.position.set(0.42, 2.2, 0);
    const crossBar = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.22, 0.22), secondaryMat);
    crossBar.position.y = 1.82;
    weaponGroup.add(weaponShaft, crossBar, centerProng, prongL, prongR);
  } else if (difficulty === Difficulty.MEDIUM) {
    // Tempest Twin Wind Scythe / Halberd
    const windBladeMain = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.85, 0.12), glowMat);
    windBladeMain.position.set(0.18, 2.15, 0);
    const windWing = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.48, 0.14), secondaryMat);
    windWing.position.set(0, 1.75, 0);
    weaponGroup.add(weaponShaft, windBladeMain, windWing);
  } else {
    // Hard Mode: Colossal Magma Doom Cleaver
    const magmaBlade = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.25, 0.18), darkMat);
    magmaBlade.position.y = 2.15;
    const magmaEdge = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.1, 0.1), glowMat);
    magmaEdge.position.set(0.08, 2.15, 0);
    const magmaGuard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.32), secondaryMat);
    magmaGuard.position.y = 1.1;
    weaponGroup.add(weaponShaft, magmaGuard, magmaBlade, magmaEdge);
  }

  rightArmPivot.add(rightShoulder, rightArm, weaponGroup);
  bodyGroup.add(leftArmPivot, rightArmPivot);

  // Floating Elemental Orbit Ring around the Boss
  const orbitRing = new THREE.Group();
  orbitRing.position.y = 2.2;
  const shardCount = difficulty === Difficulty.HARD ? 8 : 6;
  for (let i = 0; i < shardCount; i++) {
    const ang = (i / shardCount) * Math.PI * 2;
    const shard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.48, 0.28), glowMat);
    shard.position.set(Math.cos(ang) * 2.5, Math.sin(ang * 2) * 0.25, Math.sin(ang) * 2.5);
    shard.rotation.set(0.3, ang, 0.3);
    orbitRing.add(shard);
  }
  root.add(orbitRing);

  // Elemental Aura InstancedMesh (Water droplets / Wind vortex / Magma embers)
  const particleCount = 36;
  const partGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
  const partMat = new THREE.MeshBasicMaterial({
    color: palette.glow,
    transparent: true,
    opacity: 0.85,
  });
  const auraParticles = new THREE.InstancedMesh(partGeo, partMat, particleCount);
  auraParticles.frustumCulled = false;

  const particleData: BossRig['particleData'] = [];
  const dummyMat = new THREE.Matrix4();
  for (let i = 0; i < particleCount; i++) {
    const d = {
      angle: Math.random() * Math.PI * 2,
      radius: 1.6 + Math.random() * 2.4,
      yOffset: Math.random() * 3.8,
      speed:
        difficulty === Difficulty.MEDIUM
          ? 2.8 + Math.random() * 2.0 // fast swirling wind!
          : 0.9 + Math.random() * 1.1,
      scale: 0.6 + Math.random() * 0.9,
    };
    particleData.push(d);
    dummyMat.makeTranslation(Math.cos(d.angle) * d.radius, d.yOffset, Math.sin(d.angle) * d.radius);
    auraParticles.setMatrixAt(i, dummyMat);
  }
  auraParticles.instanceMatrix.needsUpdate = true;
  root.add(auraParticles);

  return {
    root,
    bodyGroup,
    head,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    weaponGroup,
    orbitRing,
    auraParticles,
    particleData,
  };
}

/**
 * Create curved 3D Slash Arc Mesh for Hero Black Sword Slash & Boss Elemental Slash
 */
export function createSlashArcMesh(colorHex: number, radius: number): THREE.Mesh {
  const geo = new THREE.RingGeometry(radius * 0.62, radius, 24, 1, -Math.PI * 0.45, Math.PI * 0.9);
  const mat = new THREE.MeshBasicMaterial({
    color: colorHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.visible = false;
  return mesh;
}
