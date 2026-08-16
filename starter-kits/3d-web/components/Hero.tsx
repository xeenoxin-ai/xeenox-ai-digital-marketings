'use client';

import dynamic from 'next/dynamic';
import { useSceneGate } from '@/lib/useSceneGate';

/**
 * The scene is code-split and client-only. Three.js and its scene graph are the
 * single largest thing on the page; keeping them out of the server bundle means
 * the HTML response — the part search engines and slow connections care about —
 * stays small, and the 3D arrives afterwards or not at all.
 */
const SceneCanvas = dynamic(
  () => import('./scene/SceneCanvas').then((m) => m.SceneCanvas),
  { ssr: false },
);

export interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  accent?: string;
}

/**
 * Hero section: real content first, 3D as a layer behind it.
 *
 * The text below is plain server-rendered markup. Whether or not WebGL ever
 * mounts, this section is complete, readable, indexable, and actionable — which
 * is the difference between a 3D site that converts and a showreel that ranks
 * for nothing.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  accent = '#8ab4ff',
}: HeroProps) {
  const { shouldRender3D, budget } = useSceneGate();

  return (
    <section className="hero">
      <div className="hero__backdrop" aria-hidden="true">
        {shouldRender3D && budget ? (
          <SceneCanvas budget={budget} accent={accent} />
        ) : (
          // Static counterpart: same visual weight, zero GPU cost. Shown to
          // reduced-motion visitors, no-WebGL devices, and every crawler.
          <div className="hero__backdrop-static" />
        )}
      </div>

      <div className="hero__content">
        {eyebrow ? <p className="hero__eyebrow">{eyebrow}</p> : null}
        <h1 className="hero__title">{title}</h1>
        <p className="hero__subtitle">{subtitle}</p>

        <div className="hero__actions">
          <a className="btn btn--primary" href={primaryCta.href}>
            {primaryCta.label}
          </a>
          {secondaryCta ? (
            <a className="btn btn--secondary" href={secondaryCta.href}>
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
