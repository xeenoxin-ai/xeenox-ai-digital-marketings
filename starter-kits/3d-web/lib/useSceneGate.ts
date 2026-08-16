'use client';

import { useEffect, useState } from 'react';
import { detectDeviceTier, RENDER_BUDGETS, type DeviceTier, type RenderBudget } from './capabilities';

export interface SceneGate {
  /** True once the client-side probe has run. Server render is always false. */
  ready: boolean;
  /** True when the visitor has asked for reduced motion. */
  reducedMotion: boolean;
  tier: DeviceTier;
  /** Null when the scene must not mount at all. */
  budget: RenderBudget | null;
  /** The single flag the UI should branch on. */
  shouldRender3D: boolean;
}

/**
 * Decides whether the 3D scene mounts, and at what budget.
 *
 * Three ways to end up with the static fallback instead:
 *   1. No WebGL context available (old device, blocklisted GPU, hard failure).
 *   2. `prefers-reduced-motion: reduce` — a stated accessibility need, not a hint.
 *   3. Server render / pre-hydration, so the crawler and the first paint both
 *      get real content rather than an empty canvas.
 *
 * The reduced-motion listener stays subscribed: visitors do change this setting
 * mid-session, and the scene should respond without a reload.
 */
export function useSceneGate(): SceneGate {
  const [ready, setReady] = useState(false);
  const [tier, setTier] = useState<DeviceTier>('none');
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(motionQuery.matches);

    sync();
    setTier(detectDeviceTier());
    setReady(true);

    motionQuery.addEventListener('change', sync);
    return () => motionQuery.removeEventListener('change', sync);
  }, []);

  const shouldRender3D = ready && !reducedMotion && tier !== 'none';

  return {
    ready,
    reducedMotion,
    tier,
    budget: tier === 'none' ? null : RENDER_BUDGETS[tier],
    shouldRender3D,
  };
}
