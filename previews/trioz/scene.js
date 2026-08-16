/**
 * Trioz — procedural steel casement.
 *
 * The hero is the product, not an abstraction: mitred frame profiles, a mullion
 * and transom, glazing, and a brass lever, lit so the powder-coated edges catch.
 */
import {
  Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, BoxGeometry,
  CylinderGeometry, MeshStandardMaterial, MeshPhysicalMaterial, DirectionalLight,
  AmbientLight, Color, PMREMGenerator, ACESFilmicToneMapping, SRGBColorSpace,
  Vector2, PlaneGeometry, MathUtils,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const BRASS = 0xa16207;
const STEEL = 0x3a3531;

/** Frame profile depth/width in scene units — a real casement section, scaled. */
const P = 0.14;

function profileMaterial() {
  return new MeshStandardMaterial({
    color: STEEL,
    metalness: 0.88,
    roughness: 0.29,
  });
}

/** One mitred bar of the frame. */
function bar(w, h, d, mat) {
  return new Mesh(new BoxGeometry(w, h, d), mat);
}

function buildCasement() {
  const g = new Group();
  const steel = profileMaterial();

  const W = 3.0;   // overall width
  const H = 3.7;   // overall height

  // Outer frame — four bars, corners overlapped so the mitre reads as solid.
  const top = bar(W, P, P * 1.4, steel);
  top.position.y = H / 2;
  const bottom = top.clone();
  bottom.position.y = -H / 2;
  const left = bar(P, H + P, P * 1.4, steel);
  left.position.x = -W / 2;
  const right = left.clone();
  right.position.x = W / 2;
  g.add(top, bottom, left, right);

  // Transom (horizontal division) low, mullion (vertical) centred — the
  // proportion that makes a casement read as architectural rather than generic.
  const transom = bar(W, P * 0.8, P * 1.2, steel);
  transom.position.y = -H * 0.18;
  const mullion = bar(P * 0.8, H, P * 1.2, steel);
  g.add(transom, mullion);

  // Glazing. Deliberately not `transmission` — that needs a render target pass
  // and is the fastest way to tank a mid-range phone. A low-opacity physical
  // material with clearcoat reads as glass at a fraction of the cost.
  const glass = new MeshPhysicalMaterial({
    color: 0x9fb8c8,
    metalness: 0,
    roughness: 0.08,
    transparent: true,
    opacity: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });
  const pane = new Mesh(new PlaneGeometry(W - P, H - P), glass);
  pane.position.z = -0.01;
  g.add(pane);

  // Brass lever — the one warm object in a cold assembly, and the reason the
  // accent colour exists in the palette at all.
  const brass = new MeshStandardMaterial({
    color: BRASS,
    metalness: 1,
    roughness: 0.28,
  });
  const rose = new Mesh(new CylinderGeometry(0.075, 0.075, 0.06, 24), brass);
  rose.rotation.x = Math.PI / 2;
  rose.position.set(-0.30, -H * 0.02, P * 0.85);
  const lever = new Mesh(new BoxGeometry(0.5, 0.055, 0.055), brass);
  lever.position.set(-0.56, -H * 0.02, P * 0.95);
  g.add(rose, lever);

  return g;
}

export function mountScene(canvas, opts = {}) {
  const reduced = !!opts.reducedMotion;
  const tier = opts.tier || 'mid';

  const renderer = new WebGLRenderer({
    canvas,
    // Set at construction — assigning renderer.antialias afterwards is ignored.
    antialias: tier !== 'low',
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'low' ? 1.25 : 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.background = null;

  // Metal without an environment renders black. A generated room IBL is what
  // makes the powder-coated steel read as a surface rather than a silhouette.
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0.55, 0.15, 9.1);

  const key = new DirectionalLight(0xfff2dd, 2.6);
  key.position.set(4, 5, 6);
  const rim = new DirectionalLight(0x9dc4ff, 2.7);
  rim.position.set(-6, 2, -3);
  scene.add(key, rim, new AmbientLight(0xffffff, 0.25));

  const casement = buildCasement();
  scene.add(casement);

  const pointer = new Vector2(0, 0);
  const target = new Vector2(0, 0);

  // Pointer events, not mousemove — this is what keeps the scene alive on touch
  // devices instead of leaving mobile visitors with a static object.
  function onPointer(e) {
    const r = canvas.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    target.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  if (!reduced) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Pause when scrolled away — an idle hero must not hold the GPU and drain a
  // phone battery for something nobody is looking at.
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0.01 },
  );
  io.observe(canvas);

  let raf = 0;
  let last = performance.now();

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;

    const delta = Math.min((now - last) / 1000, 0.05); // clamp after tab-switch
    last = now;

    if (reduced) {
      casement.rotation.y = -0.42;
      casement.rotation.x = 0.06;
    } else {
      pointer.lerp(target, 0.045);
      casement.rotation.y += delta * 0.12;
      casement.rotation.y = MathUtils.lerp(
        casement.rotation.y,
        casement.rotation.y + pointer.x * 0.35,
        0.06,
      );
      casement.rotation.x = MathUtils.lerp(casement.rotation.x, -pointer.y * 0.18, 0.05);
    }
    renderer.render(scene, camera);
  }

  if (reduced) {
    // One frame, held. No loop at all.
    casement.rotation.y = -0.42;
    casement.rotation.x = 0.06;
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
  }

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onPointer);
    renderer.dispose();
    pmrem.dispose();
  };
}

export function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
