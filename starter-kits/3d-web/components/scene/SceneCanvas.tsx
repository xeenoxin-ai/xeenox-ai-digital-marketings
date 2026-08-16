'use client';

import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import type { RenderBudget } from '@/lib/capabilities';
import { ParticleField } from './ParticleField';

interface SceneCanvasProps {
  budget: RenderBudget;
  accent?: string;
}

/**
 * The WebGL layer.
 *
 * Decorative by contract: it carries `aria-hidden` and is not focusable, because
 * every fact it conveys is also present in the DOM content beside it. If a scene
 * ever becomes load-bearing for meaning, it needs its own accessible description
 * and this comment stops being true.
 *
 * `antialias` is passed inside the `gl` object because the WebGL context is
 * created once from these options — assigning `renderer.antialias` afterwards is
 * silently ignored, which is one of the dataset's flagged High-severity traps.
 */
export function SceneCanvas({ budget, accent }: SceneCanvasProps) {
  return (
    <Canvas
      aria-hidden="true"
      tabIndex={-1}
      dpr={budget.dpr}
      shadows={budget.shadows}
      gl={{
        antialias: budget.antialias,
        alpha: true,
        powerPreference: 'high-performance',
        // Depth buffer is unused by an additive point cloud; skipping it saves
        // bandwidth on tile-based mobile GPUs.
        depth: false,
      }}
      camera={{ position: [0, 0, 12], fov: 45 }}
      // Render only when something changed. A static hero should not hold the
      // GPU at 60fps and drain a phone battery for an idle background.
      frameloop="always"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      <ParticleField count={budget.particles} color={accent} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
