import React from 'react';

interface CircleDiagramProps {
  type: 'unsur' | 'sudut' | 'segiempat' | 'busur' | 'juring' | 'singgung' | 'busur_juring';
}

export const CircleDiagram: React.FC<CircleDiagramProps> = ({ type }) => {
  return (
    <div className="w-full flex items-center justify-center bg-[#120e17] border-2 border-[#4a3f55] p-3">
      <svg viewBox="0 0 220 180" className="w-full max-w-[230px] h-auto">
        {/* Base Circle */}
        {type !== 'singgung' && (
          <circle
            cx="110"
            cy="90"
            r="64"
            fill="none"
            stroke="#e89d3c"
            strokeWidth="3"
          />
        )}

        {type === 'unsur' && (
          <>
            {/* Juring shaded */}
            <path
              d="M 110 90 L 174 90 A 64 64 0 0 0 142 34.6 Z"
              fill="rgba(56, 189, 248, 0.22)"
            />
            {/* Tembereng shaded */}
            <path
              d="M 60 50 L 160 50 A 64 64 0 0 0 60 50 Z"
              fill="rgba(232, 157, 60, 0.25)"
            />
            {/* Diameter */}
            <line x1="46" y1="90" x2="174" y2="90" stroke="#f4ebd9" strokeWidth="2.5" />
            {/* Radius */}
            <line x1="110" y1="90" x2="142" y2="34.6" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Chord AB */}
            <line x1="61" y1="49" x2="159" y2="49" stroke="#f87171" strokeWidth="2.5" />
            {/* Apothem OC */}
            <line
              x1="110"
              y1="90"
              x2="110"
              y2="49"
              stroke="#4ade80"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <rect x="110" y="49" width="7" height="7" fill="none" stroke="#4ade80" strokeWidth="1.5" />
            <circle cx="110" cy="90" r="4" fill="#ffd166" />
            <text x="106" y="106" fill="#ffd166" fontSize="13" fontFamily="VT323, monospace">
              O (Pusat)
            </text>
            <text x="132" y="68" fill="#38bdf8" fontSize="13" fontFamily="VT323, monospace">
              r
            </text>
            <text x="95" y="43" fill="#f87171" fontSize="13" fontFamily="VT323, monospace">
              Tali Busur
            </text>
            <text x="115" y="74" fill="#4ade80" fontSize="12" fontFamily="VT323, monospace">
              Apotema
            </text>
          </>
        )}

        {type === 'sudut' && (
          <>
            {/* Points A(65,135), B(155,135), O(110,90), C(110,26) */}
            <line x1="110" y1="90" x2="65" y2="135" stroke="#f97316" strokeWidth="2.5" />
            <line x1="110" y1="90" x2="155" y2="135" stroke="#f97316" strokeWidth="2.5" />
            <line x1="110" y1="26" x2="65" y2="135" stroke="#38bdf8" strokeWidth="2" />
            <line x1="110" y1="26" x2="155" y2="135" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="110" cy="90" r="4" fill="#ffd166" />
            <circle cx="110" cy="26" r="3.5" fill="#38bdf8" />
            <circle cx="65" cy="135" r="3.5" fill="#f97316" />
            <circle cx="155" cy="135" r="3.5" fill="#f97316" />
            <text x="103" y="114" fill="#f97316" fontSize="14" fontFamily="VT323, monospace">
              2α
            </text>
            <text x="106" y="52" fill="#38bdf8" fontSize="14" fontFamily="VT323, monospace">
              α
            </text>
            <text x="106" y="20" fill="#38bdf8" fontSize="13" fontFamily="VT323, monospace">
              C
            </text>
            <text x="52" y="146" fill="#f4ebd9" fontSize="13" fontFamily="VT323, monospace">
              A
            </text>
            <text x="160" y="146" fill="#f4ebd9" fontSize="13" fontFamily="VT323, monospace">
              B
            </text>
          </>
        )}

        {type === 'segiempat' && (
          <>
            {/* Cyclic quadrilateral A(62,48), B(160,50), C(168,118), D(58,128) */}
            <polygon
              points="62,48 160,50 168,118 58,128"
              fill="rgba(168, 85, 247, 0.16)"
              stroke="#c084fc"
              strokeWidth="2.5"
            />
            <line
              x1="62"
              y1="48"
              x2="168"
              y2="118"
              stroke="#6ee7b7"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <line
              x1="160"
              y1="50"
              x2="58"
              y2="128"
              stroke="#6ee7b7"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text x="48" y="45" fill="#ffd166" fontSize="14" fontFamily="VT323, monospace">
              A
            </text>
            <text x="165" y="46" fill="#ffd166" fontSize="14" fontFamily="VT323, monospace">
              B
            </text>
            <text x="173" y="126" fill="#ffd166" fontSize="14" fontFamily="VT323, monospace">
              C
            </text>
            <text x="44" y="136" fill="#ffd166" fontSize="14" fontFamily="VT323, monospace">
              D
            </text>
            <text x="72" y="168" fill="#e2e8f0" fontSize="13" fontFamily="VT323, monospace">
              ∠A + ∠C = 180°
            </text>
          </>
        )}

        {(type === 'busur' || type === 'juring' || type === 'busur_juring') && (
          <>
            <path
              d="M 110 90 L 174 90 A 64 64 0 0 0 110 26 Z"
              fill="rgba(249, 115, 22, 0.28)"
              stroke="#fb923c"
              strokeWidth="2"
            />
            <path
              d="M 174 90 A 64 64 0 0 0 110 26"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4.5"
            />
            <circle cx="110" cy="90" r="4" fill="#ffd166" />
            <text x="118" y="82" fill="#ffd166" fontSize="14" fontFamily="VT323, monospace">
              α
            </text>
            <text x="138" y="105" fill="#f4ebd9" fontSize="13" fontFamily="VT323, monospace">
              r
            </text>
            <text x="152" y="45" fill="#38bdf8" fontSize="14" fontFamily="VT323, monospace">
              Busur AB
            </text>
            <text x="118" y="64" fill="#fdba74" fontSize="13" fontFamily="VT323, monospace">
              Juring
            </text>
          </>
        )}

        {type === 'singgung' && (
          <>
            <circle cx="72" cy="94" r="46" fill="none" stroke="#e89d3c" strokeWidth="3" />
            {/* Radius to tangent point */}
            <line x1="72" y1="94" x2="96" y2="55" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Center to external point P */}
            <line
              x1="72"
              y1="94"
              x2="188"
              y2="94"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Tangent line l */}
            <line x1="96" y1="55" x2="188" y2="94" stroke="#4ade80" strokeWidth="3" />
            <circle cx="72" cy="94" r="4" fill="#ffd166" />
            <circle cx="96" cy="55" r="3.5" fill="#4ade80" />
            <circle cx="188" cy="94" r="4" fill="#f87171" />
            <text x="64" y="112" fill="#ffd166" fontSize="13" fontFamily="VT323, monospace">
              O
            </text>
            <text x="74" y="73" fill="#38bdf8" fontSize="13" fontFamily="VT323, monospace">
              r
            </text>
            <text x="138" y="66" fill="#4ade80" fontSize="14" fontFamily="VT323, monospace">
              l (Singgung)
            </text>
            <text x="126" y="110" fill="#c4b5fd" fontSize="13" fontFamily="VT323, monospace">
              p (Jarak)
            </text>
            <text x="192" y="98" fill="#f87171" fontSize="14" fontFamily="VT323, monospace">
              P
            </text>
            <text x="95" y="47" fill="#4ade80" fontSize="12" fontFamily="VT323, monospace">
              90°
            </text>
          </>
        )}
      </svg>
    </div>
  );
};
