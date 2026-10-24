import { GuideChapter } from '../types/game';

export const GUIDEBOOK_CHAPTERS: GuideChapter[] = [
  {
    id: 'unsur-lingkaran',
    number: 'BAB I',
    title: 'Unsur Lingkaran',
    subtitle: 'Anatomi Dasar & Komponen Geometri Lingkaran',
    summary:
      'Lingkaran adalah tempat kedudukan titik-titik pada bidang datar yang berjarak sama terhadap satu titik tetap (Titik Pusat). Memahami setiap unsur lingkaran adalah fondasi utama sebelum menghitung sudut, busur, maupun garis singgung.',
    formulas: [
      {
        label: 'Hubungan Diameter & Jari-Jari',
        formula: 'd = 2 × r   atau   r = ½ × d',
        note: 'Diameter adalah tali busur terpanjang yang melewati titik pusat O.',
      },
      {
        label: 'Keliling & Luas Lingkaran',
        formula: 'K = 2πr = πd   |   L = πr²',
        note: 'Gunakan π = 22/7 jika r kelipatan 7, atau π = 3,14 untuk lainnya.',
      },
      {
        label: 'Rumus Pythagoras Apotema',
        formula: 'a = √(r² - (½ × tali busur)²)',
        note: 'Apotema selalu tegak lurus (90°) terhadap tali busur.',
      },
    ],
    keyPoints: [
      'Titik Pusat (O): Titik tepat di tengah lingkaran.',
      'Jari-jari (r): Ruas garis dari pusat O ke titik pada keliling lingkaran.',
      'Tali Busur: Ruas garis yang menghubungkan dua titik pada keliling lingkaran.',
      'Busur: Garis lengkung bagian dari keliling lingkaran (busur minor < 180°, mayor > 180°).',
      'Juring (Sector): Daerah yang dibatasi oleh dua jari-jari dan satu busur.',
      'Tembereng (Segment): Daerah yang dibatasi oleh tali busur dan busurnya.',
      'Apotema: Jarak terpendek (tegak lurus) dari titik pusat ke tali busur.',
    ],
    example: {
      problem:
        'Sebuah lingkaran berjari-jari r = 10 cm memiliki tali busur AB sepanjang 16 cm. Berapakah panjang apotema OC?',
      solution:
        'Setengah tali busur AC = ½ × 16 = 8 cm. Karena OC ⊥ AB, gunakan Pythagoras: OC = √(10² - 8²) = √(100 - 64) = √36 = 6 cm.',
    },
    diagramType: 'unsur',
  },
  {
    id: 'sudut-pusat-keliling',
    number: 'BAB II',
    title: 'Sudut Pusat & Keliling',
    subtitle: 'Teorema Sudut Menghadap Busur yang Sama',
    summary:
      'Sudut pusat memiliki titik sudut di pusat lingkaran (O), sedangkan sudut keliling memiliki titik sudut pada keliling lingkaran. Jika keduanya menghadap busur yang sama, besar sudut pusat selalu dua kali sudut keliling.',
    formulas: [
      {
        label: 'Teorema Utama Sudut Pusat & Keliling',
        formula: '∠Pusat = 2 × ∠Keliling   |   ∠Keliling = ½ × ∠Pusat',
        note: 'Berlaku jika dan hanya jika menghadap busur yang sama.',
      },
      {
        label: 'Teorema Thales (Menghadap Diameter)',
        formula: '∠Keliling menghadap diameter = 90° (Siku-siku)',
        note: 'Karena sudut pusat diameter adalah garis lurus 180°, maka ½ × 180° = 90°.',
      },
      {
        label: 'Dua Tali Busur Berpotongan di Dalam',
        formula: '∠Perpotongan = ½ × (Busur₁ + Busur₂)',
        note: 'Jika berpotongan di luar lingkaran: ∠Luar = ½ × |Busur Besar - Busur Kecil|.',
      },
    ],
    keyPoints: [
      'Semua sudut keliling yang menghadap busur yang sama memiliki besar sudut yang SAMA BESAR.',
      'Segitiga jari-jari (ΔAOB dengan OA = OB = r) selalu merupakan segitiga sama kaki, sehingga ∠OAB = ∠OBA.',
      'Sudut keliling yang menghadap setengah lingkaran pasti siku-siku (90°).',
    ],
    example: {
      problem:
        'Titik A, B, dan C berada pada lingkaran berpusat di O. Jika ∠AOB = 116°, tentukan besar sudut keliling ∠ACB yang menghadap busur kecil AB!',
      solution:
        'Karena ∠ACB (keliling) dan ∠AOB (pusat) menghadap busur AB yang sama, maka ∠ACB = ½ × 116° = 58°.',
    },
    diagramType: 'sudut',
  },
  {
    id: 'segi-empat-tali-busur',
    number: 'BAB III',
    title: 'Segi Empat Tali Busur',
    subtitle: 'Sifat Segi Empat Siklik (Cyclic Quadrilateral) & Teorema Ptolemeus',
    summary:
      'Segi empat tali busur adalah segi empat yang keempat titik sudutnya terletak tepat pada keliling lingkaran. Sifat paling esensialnya adalah jumlah dua sudut yang saling berhadapan selalu berjumlah 180° (berpelurus).',
    formulas: [
      {
        label: 'Jumlah Sudut Berhadapan',
        formula: '∠A + ∠C = 180°   dan   ∠B + ∠D = 180°',
        note: 'Sudut luar segi empat tali busur sama dengan sudut dalam di hadapan pelurusnya.',
      },
      {
        label: 'Teorema Ptolemeus (Diagonal & Sisi)',
        formula: 'AC × BD = (AB × CD) + (BC × AD)',
        note: 'Hasil kali kedua diagonal sama dengan jumlah hasil kali sisi-sisi berhadapan.',
      },
    ],
    keyPoints: [
      'Jika salah satu sisi diperpanjang membentuk sudut luar, maka ∠Luar = ∠Dalam yang berseberangan dengan pelurusnya.',
      'Jika kedua diagonal berpotongan tegak lurus dan melewati pusat, bangun dapat berupa persegi atau persegi panjang.',
      'Segi empat tali busur selalu memiliki lingkaran luar (circumcircle).',
    ],
    example: {
      problem:
        'Pada segi empat tali busur ABCD, diketahui ∠A = (3x + 15)° dan ∠C = (2x + 40)°. Tentukan nilai x dan besar ∠A!',
      solution:
        '∠A + ∠C = 180° → (3x + 15) + (2x + 40) = 180 → 5x + 55 = 180 → 5x = 125 → x = 25°. Maka ∠A = 3(25) + 15 = 90°.',
    },
    diagramType: 'segiempat',
  },
  {
    id: 'panjang-busur',
    number: 'BAB IV',
    title: 'Panjang Busur',
    subtitle: 'Proporsi Sudut Pusat terhadap Keliling Lingkaran',
    summary:
      'Panjang busur adalah panjang garis lengkung yang merupakan bagian proporsional dari keliling lingkaran penuh (360°). Semakin besar sudut pusat α, semakin panjang busur di hadapannya secara linear.',
    formulas: [
      {
        label: 'Rumus Panjang Busur (Derajat)',
        formula: 'Panjang Busur AB = (α / 360°) × 2πr',
        note: 'α adalah besar sudut pusat dalam satuan derajat.',
      },
      {
        label: 'Rumus Panjang Busur (Radian)',
        formula: 's = r × θ   (dengan θ dalam radian)',
        note: 'Konversi: π radian = 180°.',
      },
      {
        label: 'Perbandingan Dua Busur Sekonsentris',
        formula: 'Busur₁ / Busur₂ = α₁ / α₂',
        note: 'Pada lingkaran yang sama, rasio panjang busur sebanding dengan rasio sudut pusat.',
      },
    ],
    keyPoints: [
      'Keliling juring berbeda dengan panjang busur! Keliling juring = Panjang Busur + 2r.',
      'Pastikan menyederhanakan pecahan α/360° terlebih dahulu agar perhitungan cepat tanpa kalkulator.',
      'Contoh pecahan istimewa: 60°/360° = 1/6, 72°/360° = 1/5, 90°/360° = 1/4, 120°/360° = 1/3.',
    ],
    example: {
      problem:
        'Hitunglah panjang busur lingkaran dengan sudut pusat α = 72° dan jari-jari r = 35 cm! (π = 22/7)',
      solution:
        'Panjang Busur = (72° / 360°) × 2 × (22/7) × 35 = (1/5) × 2 × 22 × 5 = 44 cm.',
    },
    diagramType: 'busur',
  },
  {
    id: 'luas-juring',
    number: 'BAB V',
    title: 'Luas Juring',
    subtitle: 'Proporsi Daerah Sektor & Perhitungan Luas Tembereng',
    summary:
      'Juring lingkaran adalah luas bidang yang dibatasi dua jari-jari dan sebuah busur. Pada tingkat lanjut Kelas XI, luas juring digunakan bersama luas segitiga untuk menentukan luas tembereng.',
    formulas: [
      {
        label: 'Rumus Luas Juring',
        formula: 'Luas Juring = (α / 360°) × πr²',
        note: 'Juga berlaku hubungan cepat: Luas Juring = ½ × Panjang Busur × r.',
      },
      {
        label: 'Rumus Luas Tembereng',
        formula: 'L_Tembereng = L_Juring - L_Segitiga(ΔAOB)',
        note: 'Dengan L_ΔAOB = ½ × r² × sin(α). Untuk α = 90°, L_ΔAOB = ½ × r².',
      },
    ],
    keyPoints: [
      'Jika panjang busur s dan jari-jari r sudah diketahui, gunakan rumus cepat L = ½ × s × r (identik dengan rumus luas segitiga!).',
      'Untuk sudut siku-siku α = 90° dan π = 22/7, luas tembereng cepatnya adalah (2/7) × r².',
      'Rasio Luas Juring₁ / Luas Juring₂ pada satu lingkaran sama dengan rasio α₁ / α₂.',
    ],
    example: {
      problem:
        'Suatu lingkaran berjari-jari 14 cm memiliki sudut pusat 90°. Tentukan Luas Juring dan Luas Temberengnya! (π = 22/7)',
      solution:
        'L_Juring = (90°/360°) × (22/7) × 14 × 14 = ¼ × 616 = 154 cm². L_ΔAOB = ½ × 14 × 14 = 98 cm². Maka L_Tembereng = 154 - 98 = 56 cm².',
    },
    diagramType: 'juring',
  },
  {
    id: 'garis-singgung-lingkaran',
    number: 'BAB VI',
    title: 'Garis Singgung Lingkaran',
    subtitle: 'Garis Singgung Titik Luar, GSPD, GSPL & Persamaan Analitik',
    summary:
      'Garis singgung lingkaran memotong lingkaran tepat di satu titik (titik singgung) dan SELALU tegak lurus (90°) terhadap jari-jari yang ditarik ke titik singgung tersebut. Materi Kelas XI mencakup panjang garis singgung persekutuan serta persamaan garis singgung.',
    formulas: [
      {
        label: 'Garis Singgung dari Titik di Luar Lingkaran',
        formula: 'l = √(p² - r²)',
        note: 'p = jarak titik pusat ke titik luar, r = jari-jari.',
      },
      {
        label: 'Persekutuan Luar (GSPL) & Dalam (GSPD)',
        formula: 'GSPL = √(p² - (R - r)²)   |   GSPD = √(p² - (R + r)²)',
        note: 'p = jarak kedua pusat, R = jari-jari besar, r = jari-jari kecil.',
      },
      {
        label: 'Persamaan Garis Singgung di Titik (x₁, y₁)',
        formula: 'Pusat (0,0): x₁x + y₁y = r²   |   Pusat (a,b): (x₁-a)(x-a) + (y₁-b)(y-b) = r²',
        note: 'Metode bagi adil untuk titik yang terletak tepat pada lingkaran.',
      },
    ],
    keyPoints: [
      'Ingat hafalan cepat: Luar dikurang (R - r), Dalam ditambah (R + r)!',
      'Gunakan tripel Pythagoras favorit ujian SMA: (3,4,5), (5,12,13), (7,24,25), (8,15,17), (9,40,41).',
      'Jika diketahui gradien m pada x² + y² = r², maka persamaan garis singgungnya: y = mx ± r√(1 + m²).',
    ],
    example: {
      problem:
        'Dua lingkaran berjari-jari R = 11 cm dan r = 4 cm memiliki jarak antar pusat p = 25 cm. Berapakah panjang Garis Singgung Persekutuan Luar (GSPL)?',
      solution:
        'Selisih jari-jari = R - r = 11 - 4 = 7 cm. Maka GSPL = √(25² - 7²) = √(625 - 49) = √576 = 24 cm (Tripel 7-24-25).',
    },
    diagramType: 'singgung',
  },
];
