import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { BODIES } from './data.js';
import { NEWS, newsDate } from './news.js';

const SIZE_SCALE = 1.0;
const DIST_SCALE = 1.0;
const TIME_SCALE = 1.0;
const APPROACH_PLANET = 3.2;
const APPROACH_SUN = 3.4;
const HOME_POS = new THREE.Vector3(0, 32, 78);

const I18N = {
  ru: {
    loading: 'Создаём Вселенную…',
    tab_scene: 'Сцена',
    tab_news: 'Новости',
    search_placeholder: 'Найти планету…',
    support: 'Поддержка',
    orbit: 'Орбита',
    fly: 'Полёт',
    hintOrbit: 'Перетаскивайте мышью • Колесо — приближение',
    hintFly: 'WASD — движение • Мышь — обзор',
    fallback_title: 'WebGL недоступен',
    fallback_text: 'Ваш браузер или устройство не может запустить 3D-сцену.',
    fallbackObjects: 'Доступные объекты',
    noResults: 'Ничего не найдено',
    mass: 'Масса',
    radius: 'Радиус',
    temperature: 'Температура',
    distance: 'Расстояние',
    formula: 'Формула',
    discovered: 'Открытие',
    why: 'Почему важно',
    close: 'Закрыть',
    today: 'Сегодня',
    news_title: 'Космос за пять дней',
    news_sub: 'Один простой ответ на сложный вопрос — каждый день.',
    footer: 'Интерактивный 3D-атлас космоса'
  },
  en: {
    loading: 'Creating the Universe…',
    tab_scene: 'Scene',
    tab_news: 'News',
    search_placeholder: 'Find a planet…',
    support: 'Support',
    orbit: 'Orbit',
    fly: 'Fly',
    hintOrbit: 'Drag to look • Wheel — zoom',
    hintFly: 'WASD — movement • Mouse — look around',
    fallback_title: 'WebGL unavailable',
    fallback_text: 'Your browser or device cannot run the 3D scene.',
    fallbackObjects: 'Available objects',
    noResults: 'Nothing found',
    mass: 'Mass',
    radius: 'Radius',
    temperature: 'Temperature',
    distance: 'Distance',
    formula: 'Formula',
    discovered: 'Discovery',
    why: 'Why it matters',
    close: 'Close',
    today: 'Today',
    news_title: 'Space in five days',
    news_sub: 'One simple answer to a hard question — every day.',
    footer: 'Interactive 3D space atlas'
  }
};

let lang = localStorage.getItem('sis-lang') === 'en' ? 'en' : 'ru';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const t = (key) => I18N[lang]?.[key] ?? key;

const els = {
  loading: $('#loading'),
  loadingBar: $('#loadingBar'),
  canvasHost: $('#canvasHost'),
  fallback: $('#fallback'),
  fallbackList: $('#fallbackList'),
  hud: $('#hud'),
  camBtn: $('#camBtn'),
  camLabel: $('#camLabel'),
  homeBtn: $('#homeBtn'),
  hint: $('#hint'),
  wasd: $('#wasd'),
  panel: $('#panel'),
  panelClose: $('#panelClose'),
  panelHandle: $('#panelHandle'),
  pDot: $('#pDot'),
  pType: $('#pType'),
  pName: $('#pName'),
  pDesc: $('#pDesc'),
  pMass: $('#pMass'),
  pRadius: $('#pRadius'),
  pTemp: $('#pTemp'),
  pDist: $('#pDist'),
  pFormula: $('#pFormula'),
  pFormulaText: $('#pFormulaText'),
  pDiscovered: $('#pDiscovered'),
  pWhy: $('#pWhy'),
  searchInput: $('#searchInput'),
  searchList: $('#searchList'),
  newsGrid: $('#newsGrid'),
  langBtn: $('#langBtn'),
  brand: $('#brand')
};

const state = {
  webgl: false,
  ready: false,
  mode: 'orbit',
  focus: null,
  focusPrev: new THREE.Vector3(),
  cameraAnimation: null,
  keyboardKeys: Object.create(null),
  touchKeys: Object.create(null),
  current: null,
  activeTab: 'scene'
};

const objects = [];
const byId = Object.create(null);
const clickableMeshes = [];
const pointer = new THREE.Vector2();
const pointerDown = new THREE.Vector2();
const tempV1 = new THREE.Vector3();
const tempV2 = new THREE.Vector3();
const tempV3 = new THREE.Vector3();

let renderer = null;
let scene = null;
let camera = null;
let orbit = null;
let fly = null;
let clock = null;
let raycaster = null;
let animationFrame = 0;
let resizeObserver = null;
let pointerMoved = false;

function hex(value) {
  return [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16)
  ];
}

function mix(a, b, amount) {
  const k = Math.max(0, Math.min(1, amount));
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k
  ];
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function seeded(seed) {
  let value = (seed * 9301 + 49297) % 233280;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function hash3(x, y, z, seed) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 53.3) * 43758.5453;
  return n - Math.floor(n);
}

function noise3(x, y, z, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  let u = x - xi;
  let v = y - yi;
  let w = z - zi;
  u = u * u * (3 - 2 * u);
  v = v * v * (3 - 2 * v);
  w = w * w * (3 - 2 * w);
  const lerp = (a, b, k) => a + (b - a) * k;
  const c00 = lerp(hash3(xi, yi, zi, seed), hash3(xi + 1, yi, zi, seed), u);
  const c10 = lerp(hash3(xi, yi + 1, zi, seed), hash3(xi + 1, yi + 1, zi, seed), u);
  const c01 = lerp(hash3(xi, yi, zi + 1, seed), hash3(xi + 1, yi, zi + 1, seed), u);
  const c11 = lerp(hash3(xi, yi + 1, zi + 1, seed), hash3(xi + 1, yi + 1, zi + 1, seed), u);
  return lerp(lerp(c00, c10, v), lerp(c01, c11, v), w);
}

function fbm(u, v, scale, seed, octaves = 4) {
  const angle = u * Math.PI * 2;
  const radius = scale / (Math.PI * 2);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = v * scale * 0.5;
  let sum = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i += 1) {
    sum += amplitude * noise3(
      x * frequency + 13.7,
      y * frequency + 7.1,
      z * frequency + 3.3,
      seed
    );
    amplitude *= 0.5;
    frequency *= 2;
  }
  return sum;
}

function drawCraters(context, width, height, count, seed) {
  const random = seeded(seed);
  for (let i = 0; i < count; i += 1) {
    const radius = 2 + random() * random() * 18;
    const x = radius + random() * (width - 2 * radius);
    const y = height * 0.1 + random() * height * 0.8;
    const gradient = context.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,.3)');
    gradient.addColorStop(0.72, 'rgba(0,0,0,.12)');
    gradient.addColorStop(0.9, 'rgba(255,255,255,.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

function makeTexture(body) {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const image = context.createImageData(width, height);
  const pixels = image.data;
  const palette = body.palette.map(hex);
  const seed = body.seed;
  for (let y = 0; y < height; y += 1) {
    const v = y / height;
    const latitude = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      let color;
      if (body.style === 'sun') {
        const n = fbm(u, v, 10, seed, 4);
        color = mix(palette[0], palette[1], n * 1.4 - 0.2);
        if (n > 0.6) color = mix(color, palette[2], (n - 0.6) * 3);
      } else if (body.style === 'earth') {
        const n = fbm(u, v, 5, seed, 5);
        color = n > 0.55
          ? mix(palette[1], palette[2], (n - 0.55) * 5)
          : mix(palette[3], palette[0], n / 0.55);
        if (latitude + (fbm(u, v, 12, seed + 3, 2) - 0.5) * 0.3 > 0.9) {
          color = palette[4];
        }
      } else if (body.style === 'moon') {
        const n = fbm(u, v, 7, seed, 5);
        color = mix(palette[0], palette[1], n * 1.3 - 0.15);
      } else if (body.style === 'mars') {
        const n = fbm(u, v, 6, seed, 5);
        color = mix(palette[0], palette[1], n * 1.3 - 0.15);
        if (latitude + (fbm(u, v, 10, seed + 5, 2) - 0.5) * 0.2 > 0.95) {
          color = palette[2];
        }
      } else {
        const warped = fbm(u, v, 6, seed, 3);
        const band = Math.sin((v * body.bands + (warped - 0.5) * 0.4) * Math.PI * 2) * 0.5 + 0.5;
        color = mix(palette[0], palette[1], band);
        const detail = fbm(u, v, 16, seed + 9, 3);
        color = mix(color, palette[2], (detail - 0.45) * 0.6);
      }
      const index = (y * width + x) * 4;
      pixels[index] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  if (body.craters) {
    drawCraters(context, width, height, body.craters, seed);
  }
  if (body.spot) {
    context.fillStyle = 'rgba(196,84,52,.9)';
    context.beginPath();
    context.ellipse(width * 0.32, height * 0.63, width * 0.055, height * 0.045, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'rgba(245,225,200,.45)';
    context.lineWidth = 3;
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function makeRadialTexture(size, stops) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  stops.forEach(([position, color]) => gradient.addColorStop(position, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStars() {
  const count = 4500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tints = [
    [1, 1, 1],
    [0.85, 0.9, 1],
    [1, 0.92, 0.75],
    [1, 0.85, 0.6]
  ];
  for (let i = 0; i < count; i += 1) {
    const radius = 700 + Math.random() * 500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const tint = tints[Math.floor(Math.random() * tints.length)];
    const brightness = 0.55 + Math.random() * 0.45;
    colors[i * 3] = tint[0] * brightness;
    colors[i * 3 + 1] = tint[1] * brightness;
    colors[i * 3 + 2] = tint[2] * brightness;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 4.5,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    alphaTest: 0.01,
    map: makeRadialTexture(64, [
      [0, 'rgba(255,255,255,1)'],
      [0.35, 'rgba(255,255,255,.8)'],
      [1, 'rgba(255,255,255,0)']
    ])
  });
  const stars = new THREE.Points(geometry, material);
  stars.name = 'Stars';
  return stars;
}

function makeOrbit(radius, opacity = 0.25) {
  const points = [];
  for (let i = 0; i <= 180; i += 1) {
    const angle = (i / 180) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: 0xe0b458,
      transparent: true,
      opacity,
      depthWrite: false
    })
  );
}

function makeRing(body, bodyRadius) {
  const innerRadius = bodyRadius * body.ring.inner;
  const outerRadius = bodyRadius * body.ring.outer;
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 192, 1);
  const positions = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const vertex = new THREE.Vector3();
  for (let i = 0; i < positions.count; i += 1) {
    vertex.fromBufferAttribute(positions, i);
    uv.setXY(i, (vertex.length() - innerRadius) / (outerRadius - innerRadius), 0.5);
  }
  geometry.rotateX(-Math.PI / 2);
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 8;
  const context = canvas.getContext('2d');
  const colors = body.ring.colors.map(hex);
  for (let x = 0; x < canvas.width; x += 1) {
    const u = x / canvas.width;
    const n = fbm(u * 0.9, 0.5, 30, body.seed + 3, 4);
    let alpha = 0.3 + n * 0.9;
    if (u < 0.06) alpha *= u / 0.06;
    if (u > 0.96) alpha *= (1 - u) / 0.04;
    if (u > 0.62 && u < 0.68) alpha *= 0.12;
    const color = mix(colors[0], colors[1], n);
    context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
    context.fillRect(x, 0, 1, canvas.height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
    roughness: 1,
    metalness: 0,
    depthWrite: false
  });
  return new THREE.Mesh(geometry, material);
}

function makeGlow(radius) {
  const material = new THREE.SpriteMaterial({
    map: makeRadialTexture(256, [
      [0, 'rgba(255,240,175,.9)'],
      [0.25, 'rgba(255,190,70,.55)'],
      [0.65, 'rgba(255,135,25,.13)'],
      [1, 'rgba(255,110,15,0)']
    ]),
    color: 0xffc45f,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.setScalar(radius * 4.2);
  return sprite;
}

function makeAtmosphere(radius) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.025, 64, 32),
    new THREE.MeshPhongMaterial({
      color: 0x5b9cff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
}

function markClickable(root, bodyId) {
  root.traverse((child) => {
    if (child.isMesh || child.isSprite) {
      child.userData.bodyId = bodyId;
    }
  });
}

function createBody(body, index) {
  const parentEntry = body.parent ? byId[body.parent] : null;
  const orbitParent = parentEntry ? parentEntry.carrier : scene;
  const orbitRadius = body.orbitRadius * DIST_SCALE;
  const visualRadius = body.radius * SIZE_SCALE;
  const orbitPivot = new THREE.Group();
  orbitPivot.name = `${body.id}-orbit-pivot`;
  orbitPivot.rotation.y = index * 1.31;
  orbitParent.add(orbitPivot);
  if (orbitRadius > 0) {
    const orbitLine = makeOrbit(orbitRadius, body.parent ? 0.36 : 0.2);
    orbitLine.name = `${body.id}-orbit`;
    orbitParent.add(orbitLine);
  }
  const carrier = new THREE.Group();
  carrier.name = `${body.id}-carrier`;
  carrier.position.x = orbitRadius;
  orbitPivot.add(carrier);
  const axial = new THREE.Group();
  axial.name = `${body.id}-axial-tilt`;
  axial.rotation.z = THREE.MathUtils.degToRad(body.tilt || 0);
  carrier.add(axial);
  const geometry = new THREE.SphereGeometry(visualRadius, 64, 40);
  const texture = makeTexture(body);
  const material = body.emissive
    ? new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff })
    : new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        roughness: body.style === 'earth' ? 0.72 : 0.9,
        metalness: 0
      });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = body.name.en;
  mesh.userData.bodyId = body.id;
  axial.add(mesh);
  clickableMeshes.push(mesh);
  if (body.ring) {
    const ring = makeRing(body, visualRadius);
    ring.name = `${body.id}-rings`;
    ring.userData.bodyId = body.id;
    axial.add(ring);
    clickableMeshes.push(ring);
  }
  if (body.id === 'earth') {
    const atmosphere = makeAtmosphere(visualRadius);
    atmosphere.name = 'earth-atmosphere';
    atmosphere.userData.bodyId = body.id;
    axial.add(atmosphere);
  }
  if (body.id === 'sun') {
    const glow = makeGlow(visualRadius);
    glow.name = 'sun-glow';
    glow.userData.bodyId = body.id;
    carrier.add(glow);
    const light = new THREE.PointLight(0xfff2cf, 1700, 0, 1.85);
    light.name = 'Sun light';
    carrier.add(light);
  }
  markClickable(axial, body.id);
  const entry = { body, orbitPivot, carrier, axial, mesh, visualRadius };
  objects.push(entry);
  byId[body.id] = entry;
  return entry;
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch (error) {
    return false;
  }
}

function buildScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020711);
  scene.fog = new THREE.FogExp2(0x020711, 0.00042);
  camera = new THREE.PerspectiveCamera(50, 1, 0.05, 2400);
  camera.position.copy(HOME_POS);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-label', 'Interactive Solar System');
  els.canvasHost.appendChild(renderer.domElement);
  scene.add(makeStars());
  scene.add(new THREE.HemisphereLight(0x8098c4, 0x040711, 0.16));
  BODIES.forEach((body, index) => createBody(body, index));
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.065;
  orbit.rotateSpeed = 0.55;
  orbit.zoomSpeed = 0.75;
  orbit.panSpeed = 0.75;
  orbit.minDistance = 2;
  orbit.maxDistance = 260;
  orbit.target.set(0, 0, 0);
  orbit.update();
  fly = new FlyControls(camera, renderer.domElement);
  fly.enabled = false;
  fly.movementSpeed = 16;
  fly.rollSpeed = 0.35;
  fly.dragToLook = true;
  fly.autoForward = false;
  raycaster = new THREE.Raycaster();
  clock = new THREE.Clock(false);
  state.webgl = true;
}

function bodyWorldPosition(entry, target = new THREE.Vector3()) {
  return entry.mesh.getWorldPosition(target);
}

function setCameraMode(mode) {
  if (!state.webgl || !camera) return;
  state.mode = mode === 'fly' ? 'fly' : 'orbit';
  state.cameraAnimation = null;
  orbit.enabled = state.mode === 'orbit';
  fly.enabled = state.mode === 'fly';
  if (state.mode === 'fly') {
    state.focus = null;
  } else {
    const direction = camera.getWorldDirection(tempV1);
    orbit.target.copy(camera.position).addScaledVector(direction, 12);
    orbit.update();
  }
  updateControlsText();
}

function toggleCameraMode() {
  setCameraMode(state.mode === 'orbit' ? 'fly' : 'orbit');
}

function resetView(animated = true) {
  if (!state.webgl || !camera) return;
  if (state.mode !== 'orbit') {
    setCameraMode('orbit');
  }
  state.focus = null;
  state.current = null;
  closePanel();
  if (animated) {
    state.cameraAnimation = {
      start: performance.now(),
      duration: 950,
      fromPosition: camera.position.clone(),
      toPosition: HOME_POS.clone(),
      fromTarget: orbit.target.clone(),
      toTarget: new THREE.Vector3(0, 0, 0),
      focusId: null
    };
  } else {
    camera.position.copy(HOME_POS);
    orbit.target.set(0, 0, 0);
    orbit.update();
  }
}

function focusBody(bodyId) {
  const entry = byId[bodyId];
  if (!entry || !state.webgl || !camera) return;
  if (state.mode !== 'orbit') {
    setCameraMode('orbit');
  }
  const target = bodyWorldPosition(entry, new THREE.Vector3());
  let direction = camera.position.clone().sub(target);
  if (direction.lengthSq() < 0.0001) {
    direction.set(1, 0.35, 1);
  }
  direction.normalize();
  const multiplier = bodyId === 'sun' ? APPROACH_SUN : APPROACH_PLANET;
  const ringFactor = entry.body.ring ? entry.body.ring.outer * 1.1 : 1;
  const distance = Math.max(entry.visualRadius * multiplier * ringFactor, bodyId === 'moon' ? 1.25 : 2.2);
  const destination = target.clone().addScaledVector(direction, distance);
  destination.y += entry.visualRadius * 0.35;
  state.cameraAnimation = {
    start: performance.now(),
    duration: bodyId === 'sun' ? 1250 : 1000,
    fromPosition: camera.position.clone(),
    toPosition: destination,
    fromTarget: orbit.target.clone(),
    toTarget: target,
    focusId: bodyId
  };
  selectBody(bodyId, false);
}

function updateCameraAnimation(now) {
  const animation = state.cameraAnimation;
  if (!animation) return;
  const progress = Math.min(1, (now - animation.start) / animation.duration);
  const k = easeOutCubic(progress);
  camera.position.lerpVectors(animation.fromPosition, animation.toPosition, k);
  orbit.target.lerpVectors(animation.fromTarget, animation.toTarget, k);
  orbit.update();
  if (progress >= 1) {
    state.cameraAnimation = null;
    state.focus = animation.focusId;
    if (state.focus && byId[state.focus]) {
      bodyWorldPosition(byId[state.focus], state.focusPrev);
    }
  }
}

function updateFocusedBody() {
  if (!state.focus || state.mode !== 'orbit' || state.cameraAnimation) return;
  const entry = byId[state.focus];
  if (!entry) return;
  const currentPosition = bodyWorldPosition(entry, tempV1);
  tempV2.copy(currentPosition).sub(state.focusPrev);
  camera.position.add(tempV2);
  orbit.target.copy(currentPosition);
  state.focusPrev.copy(currentPosition);
}

function keyIsDown(code) {
  return Boolean(state.keyboardKeys[code] || state.touchKeys[code]);
}

function updateOrbitMovement(delta) {
  if (state.mode !== 'orbit' || state.cameraAnimation) return;
  const forwardAmount = Number(keyIsDown('KeyW')) - Number(keyIsDown('KeyS'));
  const rightAmount = Number(keyIsDown('KeyD')) - Number(keyIsDown('KeyA'));
  if (!forwardAmount && !rightAmount) return;
  const distance = camera.position.distanceTo(orbit.target);
  const speed = Math.max(2, distance * 0.32) * delta;
  camera.getWorldDirection(tempV1);
  tempV1.y = 0;
  if (tempV1.lengthSq() < 0.001) tempV1.set(0, 0, -1);
  tempV1.normalize();
  tempV2.crossVectors(tempV1, camera.up).normalize();
  tempV3.set(0, 0, 0)
    .addScaledVector(tempV1, forwardAmount * speed)
    .addScaledVector(tempV2, rightAmount * speed);
  camera.position.add(tempV3);
  orbit.target.add(tempV3);
  state.focus = null;
}

function updateTouchFlyMovement(delta) {
  if (state.mode !== 'fly') return;
  const forwardAmount = Number(state.touchKeys.KeyW) - Number(state.touchKeys.KeyS);
  const rightAmount = Number(state.touchKeys.KeyD) - Number(state.touchKeys.KeyA);
  if (!forwardAmount && !rightAmount) return;
  const speed = 16 * delta;
  camera.getWorldDirection(tempV1).normalize();
  tempV2.crossVectors(tempV1, camera.up).normalize();
  camera.position
    .addScaledVector(tempV1, forwardAmount * speed)
    .addScaledVector(tempV2, rightAmount * speed);
}

function selectBody(bodyId, moveCamera = true) {
  const body = BODIES.find((item) => item.id === bodyId);
  if (!body) return;
  state.current = bodyId;
  els.pDot.style.background = body.color;
  els.pType.textContent = body.type[lang];
  els.pName.textContent = body.name[lang];
  els.pDesc.textContent = body.description[lang];
  els.pMass.textContent = body.stats.mass[lang];
  els.pRadius.textContent = body.stats.radius[lang];
  els.pTemp.textContent = body.stats.temperature[lang];
  els.pDist.textContent = body.stats.distance[lang];
  els.pFormula.textContent = body.formula.expr;
  els.pFormulaText.textContent = body.formula[lang];
  els.pDiscovered.textContent = body.discovered[lang];
  els.pWhy.textContent = body.why[lang];
  els.panel.classList.add('is-open');
  els.panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('panel-open');
  closeSearch();
  if (moveCamera && state.webgl) {
    focusBody(bodyId);
  }
}

function closePanel() {
  els.panel.classList.remove('is-open');
  els.panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('panel-open');
}

function normalized(value) {
  return value.toLocaleLowerCase(lang).trim();
}

function searchBodies(query) {
  const needle = normalized(query);
  if (!needle) return BODIES;
  return BODIES.filter((body) => {
    const text = `${body.name.ru} ${body.name.en} ${body.type.ru} ${body.type.en}`.toLocaleLowerCase();
    return text.includes(needle);
  });
}

function renderSearchResults(query = '') {
  const results = searchBodies(query);
  els.searchList.innerHTML = '';
  if (!results.length) {
    const item = document.createElement('li');
    item.className = 'is-empty';
    item.textContent = t('noResults');
    els.searchList.appendChild(item);
  } else {
    results.forEach((body, index) => {
      const item = document.createElement('li');
      item.dataset.bodyId = body.id;
      item.setAttribute('role', 'option');
      if (index === 0) item.classList.add('is-active');
      const name = document.createElement('span');
      const dot = document.createElement('i');
      dot.style.background = body.color;
      name.append(dot, document.createTextNode(body.name[lang]));
      const type = document.createElement('small');
      type.textContent = body.type[lang];
      item.append(name, type);
      els.searchList.appendChild(item);
    });
  }
  els.searchList.classList.add('is-open');
}

function closeSearch() {
  els.searchList.classList.remove('is-open');
}

function chooseActiveSearchResult() {
  const active = els.searchList.querySelector('li.is-active[data-body-id]')
    || els.searchList.querySelector('li[data-body-id]');
  if (!active) return;
  activateTab('scene');
  selectBody(active.dataset.bodyId, true);
  els.searchInput.value = '';
  closeSearch();
  els.searchInput.blur();
}

function moveSearchSelection(direction) {
  const items = [...els.searchList.querySelectorAll('li[data-body-id]')];
  if (!items.length) return;
  let index = items.findIndex((item) => item.classList.contains('is-active'));
  items.forEach((item) => item.classList.remove('is-active'));
  index = (index + direction + items.length) % items.length;
  items[index].classList.add('is-active');
  items[index].scrollIntoView({ block: 'nearest' });
}

function formatNewsDate(date, offset) {
  if (offset === 0) return t('today');
  return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long'
  }).format(date);
}

function renderNews() {
  els.newsGrid.innerHTML = '';
  NEWS.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.animationDelay = `${index * 70}ms`;
    const visual = document.createElement('div');
    visual.className = 'card__img';
    visual.setAttribute('aria-hidden', 'true');
    visual.innerHTML = item.svg;
    const body = document.createElement('div');
    body.className = 'card__body';
    const date = document.createElement('div');
    date.className = 'card__date';
    date.textContent = formatNewsDate(newsDate(item.dayOffset), item.dayOffset);
    const title = document.createElement('h3');
    title.textContent = item.title[lang];
    const text = document.createElement('p');
    text.textContent = item.text[lang];
    body.append(date, title, text);
    card.append(visual, body);
    els.newsGrid.appendChild(card);
  });
}

function renderFallbackObjects() {
  els.fallbackList.innerHTML = '';
  els.fallbackList.setAttribute('aria-label', t('fallbackObjects'));
  BODIES.forEach((body) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.bodyId = body.id;
    const dot = document.createElement('i');
    dot.style.background = body.color;
    button.append(dot, document.createTextNode(body.name[lang]));
    els.fallbackList.appendChild(button);
  });
}

function showFallback() {
  state.webgl = false;
  state.ready = false;
  els.canvasHost.classList.add('hidden');
  els.hud.classList.add('hidden');
  els.wasd.classList.add('hidden');
  els.fallback.classList.remove('hidden');
  els.fallback.hidden = false;
  els.fallback.setAttribute('aria-hidden', 'false');
  renderFallbackObjects();
  finishLoading();
}

function updateControlsText() {
  if (!els.camLabel || !els.hint) return;
  els.camLabel.textContent = state.mode === 'orbit' ? t('orbit') : t('fly');
  els.hint.textContent = state.mode === 'orbit' ? t('hintOrbit') : t('hintFly');
  els.camBtn.setAttribute('aria-label', state.mode === 'orbit' ? t('fly') : t('orbit'));
  els.homeBtn.setAttribute('aria-label', t('orbit'));
}

function updateI18n() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  $$('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });
  $$('[data-lang]').forEach((element) => {
    element.classList.toggle('is-active', element.dataset.lang === lang);
  });
  els.panelClose.setAttribute('aria-label', t('close'));
  updateControlsText();
  renderNews();
  renderFallbackObjects();
  if (state.current) {
    selectBody(state.current, false);
  }
  if (els.searchList.classList.contains('is-open')) {
    renderSearchResults(els.searchInput.value);
  }
}

function setLanguage(nextLanguage) {
  if (!I18N[nextLanguage] || nextLanguage === lang) return;
  lang = nextLanguage;
  localStorage.setItem('sis-lang', lang);
  updateI18n();
}

function activateTab(tabName) {
  const next = tabName === 'news' ? 'news' : 'scene';
  state.activeTab = next;
  $$('.tab').forEach((tab) => {
    const active = tab.dataset.tab === next;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  $$('.view').forEach((view) => {
    view.classList.toggle('is-active', view.id === `view-${next}`);
  });
  closeSearch();
  if (next === 'scene' && renderer) {
    requestAnimationFrame(resize);
  }
}

function updatePointerFromEvent(event) {
  if (!renderer) return false;
  const rect = renderer.domElement.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return true;
}

function pickBody(event) {
  if (!state.webgl || !raycaster || !updatePointerFromEvent(event)) return;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickableMeshes, true);
  const hit = hits.find((item) => item.object.userData.bodyId);
  if (hit) {
    selectBody(hit.object.userData.bodyId, true);
  }
}

function bindRendererEvents() {
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (event) => {
    pointerMoved = false;
    pointerDown.set(event.clientX, event.clientY);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (pointerDown.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 6) {
      pointerMoved = true;
    }
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!pointerMoved && event.button === 0) {
      pickBody(event);
    }
  });
}

function bindEvents() {
  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });
  els.langBtn.addEventListener('click', (event) => {
    const target = event.target.closest('[data-lang]');
    setLanguage(target?.dataset.lang || (lang === 'ru' ? 'en' : 'ru'));
  });
  els.searchInput.addEventListener('focus', () => renderSearchResults(els.searchInput.value));
  els.searchInput.addEventListener('input', () => renderSearchResults(els.searchInput.value));
  els.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSearchSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSearchSelection(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      chooseActiveSearchResult();
    } else if (event.key === 'Escape') {
      closeSearch();
      els.searchInput.blur();
    }
  });
  els.searchList.addEventListener('pointerdown', (event) => {
    const item = event.target.closest('[data-body-id]');
    if (!item) return;
    event.preventDefault();
    activateTab('scene');
    selectBody(item.dataset.bodyId, true);
    els.searchInput.value = '';
    closeSearch();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('#search')) closeSearch();
  });
  els.camBtn.addEventListener('click', toggleCameraMode);
  els.homeBtn.addEventListener('click', () => resetView(true));
  els.panelClose.addEventListener('click', closePanel);
  els.brand.addEventListener('click', (event) => {
    event.preventDefault();
    activateTab('scene');
    resetView(true);
  });
  els.fallbackList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-body-id]');
    if (button) selectBody(button.dataset.bodyId, false);
  });
  window.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    state.keyboardKeys[event.code] = true;
    if (event.code === 'Escape') {
      closePanel();
      closeSearch();
    }
  });
  window.addEventListener('keyup', (event) => {
    state.keyboardKeys[event.code] = false;
  });
  window.addEventListener('blur', () => {
    state.keyboardKeys = Object.create(null);
    state.touchKeys = Object.create(null);
    $$('.wasd button').forEach((button) => button.classList.remove('is-down'));
  });
  $$('.wasd button[data-key]').forEach((button) => {
    const code = button.dataset.key;
    const press = (event) => {
      event.preventDefault();
      state.touchKeys[code] = true;
      button.classList.add('is-down');
      button.setPointerCapture?.(event.pointerId);
    };
    const release = (event) => {
      event.preventDefault();
      state.touchKeys[code] = false;
      button.classList.remove('is-down');
    };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });
  window.addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window && els.canvasHost) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(els.canvasHost);
  }
}

function resize() {
  if (!renderer || !camera || !els.canvasHost) return;
  const width = Math.max(1, els.canvasHost.clientWidth);
  const height = Math.max(1, els.canvasHost.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(now = performance.now()) {
  animationFrame = requestAnimationFrame(animate);
  if (!state.ready || !renderer || !scene || !camera) return;
  const delta = Math.min(clock.getDelta(), 0.05);
  objects.forEach((entry) => {
    entry.orbitPivot.rotation.y += entry.body.orbitSpeed * TIME_SCALE * delta;
    entry.mesh.rotation.y += entry.body.rotationSpeed * TIME_SCALE * delta;
  });
  updateCameraAnimation(now);
  updateFocusedBody();
  if (state.mode === 'orbit') {
    updateOrbitMovement(delta);
    orbit.update();
  } else {
    updateTouchFlyMovement(delta);
    fly.update(delta);
  }
  renderer.render(scene, camera);
}

function finishLoading() {
  if (!els.loading) return;
  if (els.loadingBar) {
    els.loadingBar.style.width = '100%';
  }
  window.setTimeout(() => {
    els.loading.classList.add('is-hidden');
    window.setTimeout(() => {
      els.loading.hidden = true;
    }, 650);
  }, 180);
}

function applyInitialTab() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  activateTab(hash === 'news' ? 'news' : 'scene');
}

function start() {
  bindEvents();
  updateI18n();
  applyInitialTab();
  if (!webglAvailable()) {
    showFallback();
    return;
  }
  try {
    if (els.loadingBar) {
      els.loadingBar.style.width = '15%';
    }
    buildScene();
    if (els.loadingBar) {
      els.loadingBar.style.width = '70%';
    }
    bindRendererEvents();
    resize();
    els.fallback.hidden = true;
    els.fallback.classList.add('hidden');
    els.fallback.setAttribute('aria-hidden', 'true');
    if (els.loadingBar) {
      els.loadingBar.style.width = '100%';
    }
    state.ready = true;
    finishLoading();
    clock.start();
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animate();
  } catch (error) {
    console.error('Unable to initialise the 3D scene:', error);
    showFallback();
  }
}

start();
