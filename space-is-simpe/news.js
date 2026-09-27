export const NEWS = [
  {
    id: 'fact-1',
    dayOffset: 0,
    svg: `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="#0b1a33"/>
      <circle cx="200" cy="112" r="48" fill="#e0b458"/>
      <circle cx="200" cy="112" r="58" fill="none" stroke="#f3d98b" stroke-width="2" opacity=".4"/>
      <circle cx="200" cy="112" r="70" fill="none" stroke="#e0b458" stroke-width="1" opacity=".25"/>
      <text x="200" y="200" text-anchor="middle" fill="#9fb0cc" font-family="sans-serif" font-size="14">Солнце</text>
    </svg>`,
    title: {
      ru: 'Почему Солнце светит?',
      en: 'Why does the Sun shine?'
    },
    text: {
      ru: 'В ядре Солнца каждую секунду 600 миллионов тонн водорода превращаются в гелий. Эта термоядерная реакция и даёт нам свет и тепло.',
      en: 'Every second, 600 million tonnes of hydrogen turn into helium in the Sun’s core. This nuclear fusion gives us light and heat.'
    }
  },
  {
    id: 'fact-2',
    dayOffset: 1,
    svg: `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="#0b1a33"/>
      <circle cx="160" cy="120" r="36" fill="#3b7dd8"/>
      <circle cx="160" cy="120" r="40" fill="none" stroke="#5b9cff" stroke-width="3" opacity=".3"/>
      <circle cx="250" cy="100" r="10" fill="#c0c0c0"/>
      <ellipse cx="160" cy="120" rx="95" ry="28" fill="none" stroke="#9fb0cc" stroke-width="1.5" opacity=".5"/>
      <text x="200" y="200" text-anchor="middle" fill="#9fb0cc" font-family="sans-serif" font-size="14">Земля и Луна</text>
    </svg>`,
    title: {
      ru: 'Зачем нам Луна?',
      en: 'Why do we need the Moon?'
    },
    text: {
      ru: 'Луна тормозит вращение Земли и стабилизирует наклон оси. Без неё климат был бы гораздо более хаотичным, а сутки — короче.',
      en: 'The Moon slows Earth’s rotation and stabilises its axial tilt. Without it, climate would be far more chaotic and days much shorter.'
    }
  },
  {
    id: 'fact-3',
    dayOffset: 2,
    svg: `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="#0b1a33"/>
      <circle cx="200" cy="110" r="42" fill="#c1440e"/>
      <ellipse cx="200" cy="75" rx="18" ry="7" fill="#f5f5f5" opacity=".85"/>
      <ellipse cx="200" cy="145" rx="16" ry="6" fill="#f5f5f5" opacity=".7"/>
      <text x="200" y="200" text-anchor="middle" fill="#9fb0cc" font-family="sans-serif" font-size="14">Марс</text>
    </svg>`,
    title: {
      ru: 'Почему Марс красный?',
      en: 'Why is Mars red?'
    },
    text: {
      ru: 'Поверхность покрыта пылью из оксида железа — обычной ржавчины. Миллиарды лет назад на Марсе была вода и, возможно, жизнь.',
      en: 'The surface is covered with iron-oxide dust — ordinary rust. Billions of years ago Mars had water and possibly life.'
    }
  },
  {
    id: 'fact-4',
    dayOffset: 3,
    svg: `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="#0b1a33"/>
      <ellipse cx="200" cy="112" rx="70" ry="28" fill="#c9a66b"/>
      <ellipse cx="200" cy="112" rx="55" ry="22" fill="#e8d5a3" opacity=".6"/>
      <ellipse cx="155" cy="125" rx="18" ry="10" fill="#8b5a2b" opacity=".8"/>
      <text x="200" y="200" text-anchor="middle" fill="#9fb0cc" font-family="sans-serif" font-size="14">Юпитер</text>
    </svg>`,
    title: {
      ru: 'Что такое Большое красное пятно?',
      en: 'What is the Great Red Spot?'
    },
    text: {
      ru: 'Это гигантский антициклон на Юпитере, который существует уже несколько веков. Он больше всей Земли.',
      en: 'It is a giant anticyclone on Jupiter that has lasted for centuries. It is larger than the entire Earth.'
    }
  },
  {
    id: 'fact-5',
    dayOffset: 4,
    svg: `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="#0b1a33"/>
      <ellipse cx="200" cy="112" rx="85" ry="12" fill="none" stroke="#c8ad78" stroke-width="6" opacity=".7"/>
      <ellipse cx="200" cy="112" rx="70" ry="9" fill="none" stroke="#ead7a9" stroke-width="4" opacity=".5"/>
      <circle cx="200" cy="112" r="28" fill="#e0c48a"/>
      <text x="200" y="200" text-anchor="middle" fill="#9fb0cc" font-family="sans-serif" font-size="14">Сатурн</text>
    </svg>`,
    title: {
      ru: 'Из чего сделаны кольца Сатурна?',
      en: 'What are Saturn’s rings made of?'
    },
    text: {
      ru: 'В основном из ледяных частиц размером от пылинок до домов. Толщина колец — всего несколько десятков метров.',
      en: 'Mostly ice particles ranging from dust grains to house-sized chunks. The rings are only tens of metres thick.'
    }
  }
];

export function newsDate(dayOffset = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  return date;
}
