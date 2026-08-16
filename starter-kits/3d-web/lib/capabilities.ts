/**
 * Device capability gates.
 *
 * The 3D scene is an enhancement layered over content that already works
 * without it. Everything here answers one question: is it safe to mount WebGL
 * for this visitor, and at what budget?
 */

export type DeviceTier = 'none' | 'low' | 'mid' | 'high';

/**
 * Feature-detect WebGL by actually acquiring a context — checking for the
 * `WebGLRenderingContext` global is not enough, since browsers expose it even
 * when the GPU is blocklisted and context creation fails.
 */
export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    // Release immediately; this probe must not hold a context slot.
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Classify the device into a render budget.
 *
 * Deliberately coarse. The skill's threejs dataset documents desktop:mobile GPU
 * ratios as high as 10:1, so the goal is to avoid the catastrophic case (a
 * desktop-tuned particle count on a mid-range Android), not to squeeze out the
 * last frame.
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'none';
  if (!detectWebGL()) return 'none';

  const cores = navigator.hardwareConcurrency ?? 2;
  // Non-standard but widely available on Chromium; absent elsewhere.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 768px)').matches;

  if (coarsePointer || narrow) {
    return cores >= 8 && memory >= 6 ? 'mid' : 'low';
  }
  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 4) return 'mid';
  return 'low';
}

/**
 * Per-tier render budget.
 *
 * Particle counts follow the dataset's guidance: 3000 is the safe mobile
 * baseline, and anything approaching 50000 causes sustained frame drops on
 * mid-range mobile. `dpr` is capped because retina devices otherwise render
 * 4x the pixels for no perceived gain in a soft particle field.
 */
export interface RenderBudget {
  particles: number;
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
}

export const RENDER_BUDGETS: Record<Exclude<DeviceTier, 'none'>, RenderBudget> = {
  low: { particles: 1200, dpr: [1, 1.25], antialias: false, shadows: false },
  mid: { particles: 3000, dpr: [1, 1.5], antialias: true, shadows: false },
  high: { particles: 6000, dpr: [1, 2], antialias: true, shadows: true },
};
