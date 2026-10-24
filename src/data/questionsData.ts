import { Difficulty, MathQuestion } from '../types/game';

export const MATH_QUESTIONS: MathQuestion[] = [
  // ==================== EASY MODE (12 QUESTIONS - 2 PER TOPIC) ====================
  {
    id: 'easy-1',
    difficulty: Difficulty.EASY,
    topic: 'Unsur Lingkaran',
    question:
      'Tali busur terpanjang pada sebuah lingkaran yang selalu melewati titik pusat lingkaran disebut...',
    options: ['Apotema', 'Diameter', 'Tembereng', 'Juring'],
    correctIndex: 1,
    explanation: 'Diameter (d = 2r) adalah tali busur terpanjang yang melalui titik pusat O.',
    diagramType: 'unsur',
  },
  {
    id: 'easy-2',
    difficulty: Difficulty.EASY,
    topic: 'Unsur Lingkaran',
    question:
      'Sebuah lingkaran memiliki jari-jari r = 10 cm dan panjang tali busur AB = 16 cm. Jarak terpendek (apotema) dari pusat O ke tali busur AB adalah...',
    options: ['6 cm', '8 cm', '12 cm', '14 cm'],
    correctIndex: 0,
    explanation: 'Setengah tali busur = 8 cm. Apotema = √(10² - 8²) = √(100 - 64) = √36 = 6 cm.',
    diagramType: 'unsur',
  },
  {
    id: 'easy-3',
    difficulty: Difficulty.EASY,
    topic: 'Sudut Pusat & Keliling',
    question:
      'Diketahui sudut pusat ∠AOB = 84° menghadap busur AB. Besar sudut keliling ∠ACB yang menghadap busur AB yang sama adalah...',
    options: ['21°', '42°', '84°', '168°'],
    correctIndex: 1,
    explanation: 'Sudut keliling = ½ × Sudut pusat = ½ × 84° = 42°.',
    diagramType: 'sudut',
  },
  {
    id: 'easy-4',
    difficulty: Difficulty.EASY,
    topic: 'Sudut Pusat & Keliling',
    question:
      'Ruas garis PQ adalah diameter lingkaran. Jika titik R terletak pada keliling lingkaran (R ≠ P, Q), maka besar ∠PRQ adalah...',
    options: ['45°', '60°', '90°', '180°'],
    correctIndex: 2,
    explanation: 'Berdasarkan Teorema Thales, sudut keliling yang menghadap diameter besarnya 90°.',
    diagramType: 'sudut',
  },
  {
    id: 'easy-5',
    difficulty: Difficulty.EASY,
    topic: 'Segi Empat Tali Busur',
    question:
      'ABCD adalah segi empat tali busur di dalam lingkaran. Jika besar ∠A = 75°, maka besar sudut ∠C yang berhadapan dengan ∠A adalah...',
    options: ['75°', '95°', '105°', '115°'],
    correctIndex: 2,
    explanation: 'Jumlah sudut berhadapan pada segi empat tali busur adalah 180°. ∠C = 180° - 75° = 105°.',
    diagramType: 'segiempat',
  },
  {
    id: 'easy-6',
    difficulty: Difficulty.EASY,
    topic: 'Segi Empat Tali Busur',
    question:
      'Pada segi empat tali busur PQRS, diketahui ∠Q = 112°. Berapakah besar ∠S?',
    options: ['58°', '68°', '78°', '88°'],
    correctIndex: 1,
    explanation: '∠Q dan ∠S saling berhadapan sehingga ∠S = 180° - 112° = 68°.',
    diagramType: 'segiempat',
  },
  {
    id: 'easy-7',
    difficulty: Difficulty.EASY,
    topic: 'Panjang Busur',
    question:
      'Sebuah lingkaran memiliki jari-jari r = 14 cm (π = 22/7). Panjang busur di hadapan sudut pusat 90° adalah...',
    options: ['11 cm', '22 cm', '44 cm', '88 cm'],
    correctIndex: 1,
    explanation: 'Panjang busur = (90°/360°) × 2 × (22/7) × 14 = ¼ × 88 = 22 cm.',
    diagramType: 'busur_juring',
  },
  {
    id: 'easy-8',
    difficulty: Difficulty.EASY,
    topic: 'Panjang Busur',
    question:
      'Keliling sebuah lingkaran penuh adalah 120 cm. Panjang busur AB yang memiliki sudut pusat 60° pada lingkaran tersebut adalah...',
    options: ['15 cm', '20 cm', '24 cm', '30 cm'],
    correctIndex: 1,
    explanation: 'Panjang busur = (60°/360°) × Keliling = (1/6) × 120 cm = 20 cm.',
    diagramType: 'busur_juring',
  },
  {
    id: 'easy-9',
    difficulty: Difficulty.EASY,
    topic: 'Luas Juring',
    question:
      'Diketahui jari-jari lingkaran r = 7 cm (π = 22/7). Luas juring lingkaran dengan sudut pusat 90° adalah...',
    options: ['38,5 cm²', '77 cm²', '154 cm²', '49 cm²'],
    correctIndex: 0,
    explanation: 'Luas Juring = (90°/360°) × (22/7) × 7 × 7 = ¼ × 154 = 38,5 cm².',
    diagramType: 'busur_juring',
  },
  {
    id: 'easy-10',
    difficulty: Difficulty.EASY,
    topic: 'Luas Juring',
    question:
      'Jika luas lingkaran penuh adalah 180 cm², maka luas juring dengan sudut pusat 120° adalah...',
    options: ['45 cm²', '60 cm²', '75 cm²', '90 cm²'],
    correctIndex: 1,
    explanation: 'Luas Juring = (120°/360°) × 180 cm² = (1/3) × 180 = 60 cm².',
    diagramType: 'busur_juring',
  },
  {
    id: 'easy-11',
    difficulty: Difficulty.EASY,
    topic: 'Garis Singgung Lingkaran',
    question:
      'Garis g menyinggung lingkaran berpusat di O tepat pada titik A. Besar sudut antara jari-jari OA dan garis singgung g adalah...',
    options: ['45°', '60°', '90°', '120°'],
    correctIndex: 2,
    explanation: 'Garis singgung lingkaran selalu tegak lurus (90°) terhadap jari-jari di titik singgungnya.',
    diagramType: 'singgung',
  },
  {
    id: 'easy-12',
    difficulty: Difficulty.EASY,
    topic: 'Garis Singgung Lingkaran',
    question:
      'Sebuah lingkaran berjari-jari r = 5 cm. Titik P berjarak 13 cm dari pusat lingkaran O. Panjang garis singgung dari titik P ke lingkaran adalah...',
    options: ['8 cm', '10 cm', '12 cm', '14 cm'],
    correctIndex: 2,
    explanation: 'l = √(p² - r²) = √(13² - 5²) = √(169 - 25) = √144 = 12 cm.',
    diagramType: 'singgung',
  },

  // ==================== MEDIUM MODE (12 QUESTIONS - 2 PER TOPIC) ====================
  {
    id: 'med-1',
    difficulty: Difficulty.MEDIUM,
    topic: 'Unsur Lingkaran',
    question:
      'Jarak pusat lingkaran O ke tali busur PQ (apotema) adalah 9 cm. Jika diameter lingkaran tersebut 30 cm, maka panjang tali busur PQ adalah...',
    options: ['12 cm', '18 cm', '24 cm', '27 cm'],
    correctIndex: 2,
    explanation:
      'Jari-jari r = 30/2 = 15 cm. Setengah tali busur = √(15² - 9²) = √(225 - 81) = √144 = 12 cm. Maka PQ = 2 × 12 = 24 cm.',
    diagramType: 'unsur',
  },
  {
    id: 'med-2',
    difficulty: Difficulty.MEDIUM,
    topic: 'Unsur Lingkaran',
    question:
      'Panjang tali busur AB pada lingkaran adalah 24 cm dan panjang apotemanya 5 cm. Panjang diameter lingkaran tersebut adalah...',
    options: ['13 cm', '20 cm', '26 cm', '28 cm'],
    correctIndex: 2,
    explanation:
      'Setengah tali busur = 12 cm. Jari-jari r = √(12² + 5²) = √169 = 13 cm. Diameter d = 2 × 13 = 26 cm.',
    diagramType: 'unsur',
  },
  {
    id: 'med-3',
    difficulty: Difficulty.MEDIUM,
    topic: 'Sudut Pusat & Keliling',
    question:
      'Sudut pusat ∠AOB = (5x - 10)° dan sudut keliling ∠ACB = (2x + 5)° menghadap busur AB yang sama. Besar sudut pusat ∠AOB adalah...',
    options: ['75°', '80°', '90°', '100°'],
    correctIndex: 2,
    explanation:
      '∠AOB = 2 × ∠ACB → 5x - 10 = 2(2x + 5) → 5x - 10 = 4x + 10 → x = 20°. Maka ∠AOB = 5(20) - 10 = 90°.',
    diagramType: 'sudut',
  },
  {
    id: 'med-4',
    difficulty: Difficulty.MEDIUM,
    topic: 'Sudut Pusat & Keliling',
    question:
      'Titik A, B, C pada lingkaran berpusat di O. Jika ∠OAB = 35° (dengan OA dan OB jari-jari), maka besar sudut keliling ∠ACB yang menghadap busur kecil AB adalah...',
    options: ['35°', '55°', '70°', '110°'],
    correctIndex: 1,
    explanation:
      'ΔOAB sama kaki (OA = OB), maka ∠OBA = 35°. Sudut pusat ∠AOB = 180° - 70° = 110°. Maka ∠ACB = ½ × 110° = 55°.',
    diagramType: 'sudut',
  },
  {
    id: 'med-5',
    difficulty: Difficulty.MEDIUM,
    topic: 'Segi Empat Tali Busur',
    question:
      'Segi empat tali busur ABCD memiliki ∠A = (3x + 12)° dan ∠C = (2x + 18)°. Besar ∠A adalah...',
    options: ['84°', '96°', '102°', '108°'],
    correctIndex: 2,
    explanation:
      '(3x + 12) + (2x + 18) = 180 → 5x + 30 = 180 → 5x = 150 → x = 30°. Maka ∠A = 3(30) + 12 = 102°.',
    diagramType: 'segiempat',
  },
  {
    id: 'med-6',
    difficulty: Difficulty.MEDIUM,
    topic: 'Segi Empat Tali Busur',
    question:
      'Sisi AB pada segi empat tali busur ABCD diperpanjang hingga titik E di luar lingkaran. Jika ∠ADC = 98°, maka besar sudut luar ∠CBE adalah...',
    options: ['82°', '90°', '98°', '108°'],
    correctIndex: 2,
    explanation:
      '∠ABC = 180° - ∠ADC = 82°. Karena ∠CBE pelurus ∠ABC, maka ∠CBE = 180° - 82° = 98° (Sudut luar = sudut dalam seberang).',
    diagramType: 'segiempat',
  },
  {
    id: 'med-7',
    difficulty: Difficulty.MEDIUM,
    topic: 'Panjang Busur',
    question:
      'Pada satu lingkaran, busur AB dengan sudut pusat 45° memiliki panjang 18 cm. Berapakah panjang busur CD jika sudut pusatnya 100°?',
    options: ['32 cm', '36 cm', '40 cm', '45 cm'],
    correctIndex: 2,
    explanation:
      'Busur CD / Busur AB = 100° / 45° → Busur CD = (20/9) × 18 cm = 40 cm.',
    diagramType: 'busur_juring',
  },
  {
    id: 'med-8',
    difficulty: Difficulty.MEDIUM,
    topic: 'Panjang Busur',
    question:
      'Sebuah juring lingkaran memiliki sudut pusat 72° dan jari-jari r = 35 cm (π = 22/7). KELILING juring tersebut (busur + 2 jari-jari) adalah...',
    options: ['44 cm', '79 cm', '114 cm', '144 cm'],
    correctIndex: 2,
    explanation:
      'Panjang busur = (72/360) × 2 × (22/7) × 35 = (1/5) × 220 = 44 cm. Keliling juring = 44 + 2(35) = 114 cm.',
    diagramType: 'busur_juring',
  },
  {
    id: 'med-9',
    difficulty: Difficulty.MEDIUM,
    topic: 'Luas Juring',
    question:
      'Suatu juring lingkaran dibatasi oleh busur sepanjang 24 cm dan jari-jari lingkaran 15 cm. Luas juring tersebut adalah...',
    options: ['150 cm²', '180 cm²', '240 cm²', '360 cm²'],
    correctIndex: 1,
    explanation:
      'Gunakan rumus cepat Luas Juring = ½ × Panjang Busur × r = ½ × 24 × 15 = 180 cm².',
    diagramType: 'busur_juring',
  },
  {
    id: 'med-10',
    difficulty: Difficulty.MEDIUM,
    topic: 'Luas Juring',
    question:
      'Lingkaran berjari-jari 14 cm memiliki sudut pusat ∠AOB = 90° (π = 22/7). Luas TEMBERENG di bawah busur AB adalah...',
    options: ['42 cm²', '56 cm²', '98 cm²', '154 cm²'],
    correctIndex: 1,
    explanation:
      'L_Juring = ¼ × (22/7) × 14² = 154 cm². L_ΔAOB = ½ × 14 × 14 = 98 cm². L_Tembereng = 154 - 98 = 56 cm².',
    diagramType: 'busur_juring',
  },
  {
    id: 'med-11',
    difficulty: Difficulty.MEDIUM,
    topic: 'Garis Singgung Lingkaran',
    question:
      'Dua lingkaran berjari-jari R = 11 cm dan r = 4 cm berjarak pusat p = 25 cm. Panjang Garis Singgung Persekutuan Luar (GSPL) adalah...',
    options: ['15 cm', '20 cm', '24 cm', '26 cm'],
    correctIndex: 2,
    explanation:
      'GSPL = √(p² - (R - r)²) = √(25² - (11 - 4)²) = √(625 - 49) = √576 = 24 cm.',
    diagramType: 'singgung',
  },
  {
    id: 'med-12',
    difficulty: Difficulty.MEDIUM,
    topic: 'Garis Singgung Lingkaran',
    question:
      'Dua lingkaran berjari-jari R = 9 cm dan r = 6 cm memiliki jarak antar titik pusat 17 cm. Panjang Garis Singgung Persekutuan Dalam (GSPD) adalah...',
    options: ['8 cm', '12 cm', '14 cm', '15 cm'],
    correctIndex: 0,
    explanation:
      'GSPD = √(p² - (R + r)²) = √(17² - (9 + 6)²) = √(289 - 225) = √64 = 8 cm.',
    diagramType: 'singgung',
  },

  // ==================== HARD MODE (12 QUESTIONS - ANALYTICAL & MULTI-STEP) ====================
  {
    id: 'hard-1',
    difficulty: Difficulty.HARD,
    topic: 'Unsur Lingkaran',
    question:
      'Dua tali busur sejajar AB = 16 cm dan CD = 12 cm berada di sisi yang SAMA dari pusat lingkaran berjari-jari 10 cm. Jarak antara kedua tali busur tersebut adalah...',
    options: ['2 cm', '4 cm', '6 cm', '14 cm'],
    correctIndex: 0,
    explanation:
      'Apotema ke AB = √(10² - 8²) = 6 cm. Apotema ke CD = √(10² - 6²) = 8 cm. Karena sepihak dari pusat, jaraknya = 8 - 6 = 2 cm.',
    diagramType: 'unsur',
  },
  {
    id: 'hard-2',
    difficulty: Difficulty.HARD,
    topic: 'Unsur Lingkaran',
    question:
      'Persamaan lingkaran x² + y² - 6x + 8y - 24 = 0 memiliki titik pusat P dan jari-jari r. Panjang diameter lingkaran tersebut adalah...',
    options: ['7 satuan', '10 satuan', '14 satuan', '24 satuan'],
    correctIndex: 2,
    explanation:
      'Pusat P = (3, -4). Jari-jari r = √(3² + (-4)² - (-24)) = √(9 + 16 + 24) = √49 = 7. Maka diameter d = 2 × 7 = 14 satuan.',
    diagramType: 'unsur',
  },
  {
    id: 'hard-3',
    difficulty: Difficulty.HARD,
    topic: 'Sudut Pusat & Keliling',
    question:
      'Tali busur AC dan BD berpotongan di titik E di dalam lingkaran. Jika besar busur AB = 74° dan busur CD = 46°, maka besar ∠AEB adalah...',
    options: ['28°', '56°', '60°', '120°'],
    correctIndex: 2,
    explanation:
      'Sudut dua tali busur berpotongan di dalam lingkaran: ∠AEB = ½ × (Busur AB + Busur CD) = ½ × (74° + 46°) = 60°.',
    diagramType: 'sudut',
  },
  {
    id: 'hard-4',
    difficulty: Difficulty.HARD,
    topic: 'Sudut Pusat & Keliling',
    question:
      'Garis potong (sekan) PAB dan PCD ditarik dari titik P di luar lingkaran. Jika busur besar BD = 110° dan busur kecil AC = 36°, maka besar ∠BPD adalah...',
    options: ['37°', '42°', '73°', '74°'],
    correctIndex: 0,
    explanation:
      'Sudut perpotongan di luar lingkaran: ∠BPD = ½ × (Busur BD - Busur AC) = ½ × (110° - 36°) = ½ × 74° = 37°.',
    diagramType: 'sudut',
  },
  {
    id: 'hard-5',
    difficulty: Difficulty.HARD,
    topic: 'Segi Empat Tali Busur',
    question:
      'Pada segi empat tali busur ABCD, panjang sisi AB = 6 cm, BC = 8 cm, CD = 9 cm, dan AD = 6 cm. Jika panjang diagonal AC = 10 cm, maka menurut Teorema Ptolemeus panjang diagonal BD adalah...',
    options: ['9,6 cm', '10,2 cm', '11,4 cm', '12,0 cm'],
    correctIndex: 1,
    explanation:
      'Ptolemeus: AC × BD = (AB × CD) + (BC × AD) → 10 × BD = (6 × 9) + (8 × 6) = 54 + 48 = 102 → BD = 10,2 cm.',
    diagramType: 'segiempat',
  },
  {
    id: 'hard-6',
    difficulty: Difficulty.HARD,
    topic: 'Segi Empat Tali Busur',
    question:
      'ABCD adalah segi empat tali busur dengan AB sebagai diameter lingkaran. Jika ∠BAC = 32° dan ∠ABD = 40°, berapakah besar ∠CAD?',
    options: ['18°', '22°', '28°', '38°'],
    correctIndex: 0,
    explanation:
      'AB diameter → ∠ADB = 90°, sehingga ∠BAD = 90° - 40° = 50°. Karena ∠BAD = ∠BAC + ∠CAD, maka ∠CAD = 50° - 32° = 18°.',
    diagramType: 'segiempat',
  },
  {
    id: 'hard-7',
    difficulty: Difficulty.HARD,
    topic: 'Panjang Busur',
    question:
      'Tiga pipa silinder identik berjari-jari r = 14 cm diikat kencang dengan seutas tali melingkari bagian luar ketiganya (π = 22/7). Panjang minimal tali pengikat tersebut adalah...',
    options: ['128 cm', '154 cm', '172 cm', '196 cm'],
    correctIndex: 2,
    explanation:
      'Panjang tali minimal = n × d + Keliling 1 lingkaran = 3 × (28) + 2 × (22/7) × 14 = 84 + 88 = 172 cm.',
    diagramType: 'busur_juring',
  },
  {
    id: 'hard-8',
    difficulty: Difficulty.HARD,
    topic: 'Panjang Busur',
    question:
      'Sebuah juring lingkaran berjari-jari 15 cm memiliki sudut pusat 216°. Juring tersebut digulung membentuk selimut kerucut. Jari-jari alas kerucut yang terbentuk adalah...',
    options: ['6 cm', '9 cm', '10 cm', '12 cm'],
    correctIndex: 1,
    explanation:
      'Keliling alas kerucut = Panjang busur juring → 2πr_alas = (216°/360°) × 2π(15) → r_alas = (3/5) × 15 = 9 cm.',
    diagramType: 'busur_juring',
  },
  {
    id: 'hard-9',
    difficulty: Difficulty.HARD,
    topic: 'Luas Juring',
    question:
      'Dua lingkaran konsentris memiliki jari-jari R = 21 cm dan r = 14 cm (π = 22/7). Luas daerah cincin juring (annulus sector) dengan sudut pusat 60° adalah...',
    options: ['77/3 cm²', '115,5 cm²', '128,33 cm²', '385/3 cm²'],
    correctIndex: 3,
    explanation:
      'L = (60°/360°) × π × (R² - r²) = (1/6) × (22/7) × (441 - 196) = (1/6) × (22/7) × 245 = (1/6) × 770 = 385/3 cm².',
    diagramType: 'busur_juring',
  },
  {
    id: 'hard-10',
    difficulty: Difficulty.HARD,
    topic: 'Luas Juring',
    question:
      'Keliling sebuah juring lingkaran adalah 28 cm dan jari-jarinya 8 cm. Berapakah luas juring tersebut?',
    options: ['48 cm²', '56 cm²', '64 cm²', '96 cm²'],
    correctIndex: 0,
    explanation:
      'Keliling juring = Busur + 2r → 28 = Busur + 16 → Busur = 12 cm. Luas Juring = ½ × Busur × r = ½ × 12 × 8 = 48 cm².',
    diagramType: 'busur_juring',
  },
  {
    id: 'hard-11',
    difficulty: Difficulty.HARD,
    topic: 'Garis Singgung Lingkaran',
    question:
      'Persamaan garis singgung pada lingkaran x² + y² = 25 di titik A(3, -4) yang terletak pada lingkaran adalah...',
    options: ['3x - 4y = 25', '3x + 4y = 25', '4x - 3y = 25', '-3x + 4y = 25'],
    correctIndex: 0,
    explanation:
      'Rumus bagi adil pada x² + y² = r² di (x₁, y₁): x₁x + y₁y = r² → 3x + (-4)y = 25 → 3x - 4y = 25.',
    diagramType: 'singgung',
  },
  {
    id: 'hard-12',
    difficulty: Difficulty.HARD,
    topic: 'Garis Singgung Lingkaran',
    question:
      'Panjang Garis Singgung Persekutuan Dalam (GSPD) dua lingkaran adalah 20 cm, sedangkan jarak kedua pusatnya 25 cm. Jika jari-jari lingkaran besar R = 10 cm, maka jari-jari lingkaran kecil r adalah...',
    options: ['3 cm', '5 cm', '7 cm', '8 cm'],
    correctIndex: 1,
    explanation:
      '(R + r)² = p² - GSPD² = 25² - 20² = 625 - 400 = 225 → R + r = 15. Karena R = 10 cm, maka r = 15 - 10 = 5 cm.',
    diagramType: 'singgung',
  },
];
