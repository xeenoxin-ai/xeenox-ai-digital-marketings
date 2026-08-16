import { Hero } from '@/components/Hero';

/**
 * Reference page.
 *
 * Structure follows the ui-ux-pro-max landing pattern "Hero + Features + CTA":
 * hero, value proposition, 3–5 features, closing CTA. Replace the copy per
 * client; keep the shape.
 */
export default function Page() {
  return (
    <>
      <Hero
        eyebrow="Replace per client"
        title="A headline that states the outcome, not the technology"
        subtitle="One or two sentences naming who this is for and what changes for them. The 3D behind this text is decoration — this paragraph is what gets indexed and what converts."
        primaryCta={{ label: 'Start a project', href: '#contact' }}
        secondaryCta={{ label: 'See our work', href: '#work' }}
      />

      <section className="section" id="work">
        <h2 className="section__title">What this kit gives every build</h2>
        <div className="grid">
          <article className="card">
            <h3>Tiered render budget</h3>
            <p>
              Particle counts and pixel ratio scale to the device. A mid-range phone
              never receives the desktop scene.
            </p>
          </article>
          <article className="card">
            <h3>Three fallback paths</h3>
            <p>
              No WebGL, reduced motion, or pre-hydration all resolve to a static
              backdrop that carries the same visual weight.
            </p>
          </article>
          <article className="card">
            <h3>Indexable by default</h3>
            <p>
              Copy, headings and links are server-rendered. The canvas is decorative
              and marked as such for assistive technology.
            </p>
          </article>
          <article className="card">
            <h3>Accessible baseline</h3>
            <p>
              44px targets, visible focus, a skip link, contrast-checked tokens, and
              zoom left enabled.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="contact">
        <h2 className="section__title">Closing call to action</h2>
        <p>
          Repeat the primary action here. The hero CTA catches decided visitors; this
          one catches the visitors who needed to read first.
        </p>
        <p>
          <a className="btn btn--primary" href="mailto:hello@example.com">
            Start a project
          </a>
        </p>
      </section>
    </>
  );
}
