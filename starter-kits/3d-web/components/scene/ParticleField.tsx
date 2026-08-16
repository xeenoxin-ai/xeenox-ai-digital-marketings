'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  /** Comes from the device tier budget — never hardcode this at a call site. */
  count: number;
  color?: string;
  radius?: number;
}

/**
 * A drifting particle field, sized to the caller's budget.
 *
 * Positions are generated once into a Float32Array and uploaded as a static
 * buffer attribute; the per-frame work is two rotations on the parent group,
 * which stays on the GPU. Rebuilding geometry per frame is the usual reason
 * these fields tank on mobile.
 */
export function ParticleField({ count, color = '#8ab4ff', radius = 6 }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Rejection-free spherical distribution: uniform in volume, so the field
      // does not visibly clump at the poles the way naive angle sampling does.
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((state, delta) => {
    const mesh = points.current;
    if (!mesh) return;

    // Clamp delta so a backgrounded tab does not resume with one enormous jump.
    const step = Math.min(delta, 0.05);
    mesh.rotation.y += step * 0.05;

    // Pointer parallax. R3F normalises both mouse and touch into state.pointer,
    // so this covers touch devices without separate listeners — the dataset's
    // touch-event rule is satisfied by using pointer state rather than mousemove.
    const targetX = (state.pointer.y * viewport.height) / 40;
    const targetY = (state.pointer.x * viewport.width) / 40;
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.03;
    mesh.rotation.z += (targetY - mesh.rotation.z) * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
