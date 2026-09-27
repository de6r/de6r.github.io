export const BODIES = [
  {
    id: 'sun',
    style: 'sun',
    seed: 42,
    parent: null,
    type: { ru: 'Звезда', en: 'Star' },
    name: { ru: 'Солнце', en: 'Sun' },
    color: '#e0b458',
    palette: ['#ffcc33', '#ff9933', '#ffeeaa'],
    radius: 10,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.08,
    tilt: 7.25,
    emissive: true,
    description: {
      ru: 'Наша звезда — огромный шар раскалённой плазмы. Именно благодаря Солнцу на Земле возможна жизнь.',
      en: 'Our star is a giant ball of hot plasma. Life on Earth exists thanks to the Sun.'
    },
    stats: {
      mass: { ru: '1,989 × 10³⁰ кг', en: '1.989 × 10³⁰ kg' },
      radius: { ru: '696 340 км', en: '696,340 km' },
      temperature: { ru: '5 772 K (поверхность)', en: '5,772 K (surface)' },
      distance: { ru: '0 а.е. (центр системы)', en: '0 AU (system centre)' }
    },
    formula: {
      expr: 'L = 4πR²σT⁴',
      ru: 'Светимость Солнца описывается законом Стефана — Больцмана.',
      en: 'Solar luminosity is described by the Stefan–Boltzmann law.'
    },
    discovered: {
      ru: 'Известно с древности. Научное изучение — с эпохи Галилея.',
      en: 'Known since antiquity. Scientific study began with Galileo.'
    },
    why: {
      ru: 'Источник энергии для всей Солнечной системы и главный объект астрономии.',
      en: 'The energy source for the entire Solar System and the main object of astronomy.'
    }
  },
  {
    id: 'earth',
    style: 'earth',
    seed: 17,
    parent: null,
    type: { ru: 'Планета', en: 'Planet' },
    name: { ru: 'Земля', en: 'Earth' },
    color: '#3b7dd8',
    palette: ['#1a5fb4', '#26a269', '#8ff0a4', '#1c71d8', '#f6f5f4'],
    radius: 1.8,
    orbitRadius: 42,
    orbitSpeed: 0.22,
    rotationSpeed: 0.55,
    tilt: 23.4,
    description: {
      ru: 'Единственная известная планета с жизнью. Покрыта океанами и атмосферой, защищающей от космического излучения.',
      en: 'The only known planet with life. Covered by oceans and an atmosphere that shields us from cosmic radiation.'
    },
    stats: {
      mass: { ru: '5,972 × 10²⁴ кг', en: '5.972 × 10²⁴ kg' },
      radius: { ru: '6 371 км', en: '6,371 km' },
      temperature: { ru: '15 °C (средняя)', en: '15 °C (average)' },
      distance: { ru: '1 а.е. (149,6 млн км)', en: '1 AU (149.6 million km)' }
    },
    formula: {
      expr: 'g = GM / R²',
      ru: 'Ускорение свободного падения на поверхности.',
      en: 'Surface gravity acceleration.'
    },
    discovered: {
      ru: 'Наша родная планета. Космическая эра началась в 1957 году.',
      en: 'Our home planet. The space age began in 1957.'
    },
    why: {
      ru: 'Единственное место во Вселенной, где мы точно знаем о существовании жизни.',
      en: 'The only place in the Universe where we know life exists for certain.'
    }
  },
  {
    id: 'moon',
    style: 'moon',
    seed: 91,
    parent: 'earth',
    type: { ru: 'Спутник', en: 'Moon' },
    name: { ru: 'Луна', en: 'Moon' },
    color: '#c0c0c0',
    palette: ['#a8a8a8', '#d0d0d0', '#707070'],
    radius: 0.48,
    orbitRadius: 5.2,
    orbitSpeed: 1.1,
    rotationSpeed: 0.12,
    tilt: 6.7,
    craters: 60,
    description: {
      ru: 'Естественный спутник Земли. Влияет на приливы и стабилизирует ось вращения планеты.',
      en: 'Earth’s natural satellite. It drives the tides and stabilises the planet’s axial tilt.'
    },
    stats: {
      mass: { ru: '7,342 × 10²² кг', en: '7.342 × 10²² kg' },
      radius: { ru: '1 737 км', en: '1,737 km' },
      temperature: { ru: '−20…+120 °C', en: '−20…+120 °C' },
      distance: { ru: '384 400 км от Земли', en: '384,400 km from Earth' }
    },
    formula: {
      expr: 'T = 2π√(a³/GM)',
      ru: 'Период обращения по третьему закону Кеплера.',
      en: 'Orbital period from Kepler’s third law.'
    },
    discovered: {
      ru: 'Известна с древности. Первая высадка человека — 1969 год (Аполлон-11).',
      en: 'Known since antiquity. First human landing — 1969 (Apollo 11).'
    },
    why: {
      ru: 'Ближайший космический объект и ключ к изучению формирования планет.',
      en: 'The nearest celestial body and a key to understanding planet formation.'
    }
  },
  {
    id: 'mars',
    style: 'mars',
    seed: 33,
    parent: null,
    type: { ru: 'Планета', en: 'Planet' },
    name: { ru: 'Марс', en: 'Mars' },
    color: '#c1440e',
    palette: ['#c1440e', '#e07a3d', '#f5f5f5'],
    radius: 1.1,
    orbitRadius: 64,
    orbitSpeed: 0.15,
    rotationSpeed: 0.52,
    tilt: 25.2,
    description: {
      ru: 'Красная планета. Имеет полярные шапки из льда и следы древних рек. Главный кандидат для будущих колоний.',
      en: 'The Red Planet. It has polar ice caps and traces of ancient rivers. The top candidate for future colonies.'
    },
    stats: {
      mass: { ru: '6,417 × 10²³ кг', en: '6.417 × 10²³ kg' },
      radius: { ru: '3 390 км', en: '3,390 km' },
      temperature: { ru: '−63 °C (средняя)', en: '−63 °C (average)' },
      distance: { ru: '1,52 а.е.', en: '1.52 AU' }
    },
    formula: {
      expr: 'v = √(GM/r)',
      ru: 'Круговая орбитальная скорость.',
      en: 'Circular orbital velocity.'
    },
    discovered: {
      ru: 'Известен с древности. Первые снимки поверхности — 1965 (Маринер-4).',
      en: 'Known since antiquity. First surface images — 1965 (Mariner 4).'
    },
    why: {
      ru: 'Самый изученный и перспективный объект для пилотируемых миссий.',
      en: 'The most studied and promising target for crewed missions.'
    }
  },
  {
    id: 'jupiter',
    style: 'gas',
    seed: 77,
    parent: null,
    type: { ru: 'Газовый гигант', en: 'Gas giant' },
    name: { ru: 'Юпитер', en: 'Jupiter' },
    color: '#c9a66b',
    palette: ['#c9a66b', '#e8d5a3', '#8b5a2b'],
    radius: 4.6,
    orbitRadius: 105,
    orbitSpeed: 0.06,
    rotationSpeed: 1.1,
    tilt: 3.1,
    bands: 10,
    spot: true,
    description: {
      ru: 'Самая большая планета Солнечной системы. Обладает мощным магнитным полем и знаменитым Большим красным пятном.',
      en: 'The largest planet in the Solar System. It has a powerful magnetic field and the famous Great Red Spot.'
    },
    stats: {
      mass: { ru: '1,898 × 10²⁷ кг', en: '1.898 × 10²⁷ kg' },
      radius: { ru: '69 911 км', en: '69,911 km' },
      temperature: { ru: '−110 °C (облака)', en: '−110 °C (cloud tops)' },
      distance: { ru: '5,2 а.е.', en: '5.2 AU' }
    },
    formula: {
      expr: 'P² ∝ a³',
      ru: 'Третий закон Кеплера для орбит спутников.',
      en: 'Kepler’s third law for moon orbits.'
    },
    discovered: {
      ru: 'Известен с древности. Галилей открыл четыре крупных спутника в 1610 году.',
      en: 'Known since antiquity. Galileo discovered its four largest moons in 1610.'
    },
    why: {
      ru: '«Щит» Солнечной системы — притягивает кометы и астероиды.',
      en: 'The Solar System’s “shield” — it attracts comets and asteroids.'
    }
  },
  {
    id: 'saturn',
    style: 'gas',
    seed: 55,
    parent: null,
    type: { ru: 'Газовый гигант', en: 'Gas giant' },
    name: { ru: 'Сатурн', en: 'Saturn' },
    color: '#e0c48a',
    palette: ['#e0c48a', '#f0d9a8', '#b89a6a'],
    radius: 3.9,
    orbitRadius: 140,
    orbitSpeed: 0.035,
    rotationSpeed: 0.95,
    tilt: 26.7,
    bands: 8,
    ring: {
      inner: 1.4,
      outer: 2.6,
      colors: ['#c8ad78', '#ead7a9']
    },
    description: {
      ru: 'Планета с самыми заметными кольцами. Плотность Сатурна меньше плотности воды — он бы плавал в океане.',
      en: 'The planet with the most spectacular rings. Saturn’s density is less than water — it would float in an ocean.'
    },
    stats: {
      mass: { ru: '5,683 × 10²⁶ кг', en: '5.683 × 10²⁶ kg' },
      radius: { ru: '58 232 км', en: '58,232 km' },
      temperature: { ru: '−140 °C (облака)', en: '−140 °C (cloud tops)' },
      distance: { ru: '9,5 а.е.', en: '9.5 AU' }
    },
    formula: {
      expr: 'ρ = M / V',
      ru: 'Средняя плотность — меньше 1 г/см³.',
      en: 'Mean density is less than 1 g/cm³.'
    },
    discovered: {
      ru: 'Известен с древности. Кольца открыл Гюйгенс в 1655 году.',
      en: 'Known since antiquity. Rings discovered by Huygens in 1655.'
    },
    why: {
      ru: 'Самые красивые кольца и лаборатория для изучения динамики дисков.',
      en: 'The most beautiful rings and a laboratory for studying disk dynamics.'
    }
  }
];
