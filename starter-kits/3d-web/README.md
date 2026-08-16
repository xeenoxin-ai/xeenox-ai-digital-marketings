# 3D Web Starter Kit

Production baseline for client 3D websites. React Three Fiber + Next.js, with the
performance and accessibility guardrails already wired in so each new client build
starts from a passing state rather than a demo.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Why this stack

Client marketing sites have to rank. A bare Three.js canvas gives a crawler an empty
`<div>`, so the kit puts Next.js underneath: copy, headings and links are
server-rendered, and the WebGL layer is a client-only dynamic import behind them.

Verified in the current build — `/` prerenders to 12K of static HTML containing the
`<h1>`, subtitle and feature cards, with no Three.js in the server output.

For a pure showcase piece with no SEO stake, vanilla Three.js + Vite is the better
call and this kit is the wrong starting point.

## The rule this kit exists to enforce

**The 3D scene is an enhancement over a page that is already complete without it.**

Every visitor gets working content. The scene mounts only when it is safe to:

| Condition | Result |
|---|---|
| No WebGL context | static gradient backdrop |
| `prefers-reduced-motion: reduce` | static gradient backdrop |
| Server render / pre-hydration | static gradient backdrop |
| Capable device, motion allowed | particle field at the device's budget |

Reduced motion is treated as a hard stop, not a slowdown — it is a stated
accessibility need, and the listener stays subscribed so a mid-session change takes
effect without a reload.

## Render budget

Set in `lib/capabilities.ts`. Never hardcode a particle count at a call site.

| Tier | Particles | DPR cap | Antialias | Shadows |
|------|-----------|---------|-----------|---------|
| low (phones, weak GPUs) | 1,200 | 1.25 | off | off |
| mid (strong phones, average desktops) | 3,000 | 1.5 | on | off |
| high (8+ cores, 8GB+) | 6,000 | 2 | on | on |

3,000 is the documented safe mobile baseline. Desktop-to-mobile GPU ratios reach
10:1, so **profile on a real mid-range Android before raising any of these** — a
count that holds 60fps on your machine can land at 8fps on a client's phone.

## Per-client checklist

1. `app/layout.tsx` — replace `title`, `description`, OpenGraph. Do not ship the
   placeholder.
2. `app/page.tsx` — replace copy. Keep the Hero + Features + CTA shape.
3. `app/globals.css` — set the colour tokens to the client's brand. **Re-check
   contrast after** — brand palettes routinely fail 4.5:1, and the tokens shipped
   here are checked but yours will not be.
4. `components/scene/` — swap the particle field for the client's scene. Keep the
   `budget` prop threading; do not read device state inside the scene.
5. Profile on a real mid-range phone.
6. Run the pre-delivery checklist below.

## Pre-delivery checklist

- [ ] Interactive targets ≥44×44px with ≥8px separation
- [ ] Everything keyboard-reachable, focus always visible
- [ ] Contrast ≥4.5:1 in light **and** dark
- [ ] Reduced-motion path verified (DevTools → Rendering → Emulate CSS media)
- [ ] No-WebGL path verified (disable WebGL in browser flags)
- [ ] Profiled on real mid-range mobile hardware, not just a desktop throttle
- [ ] Zoom not disabled; layout survives 320px width
- [ ] Canvas `aria-hidden` and no meaning conveyed by the scene alone
- [ ] Icons are SVG, never emoji

## Structure

```
app/
  layout.tsx        metadata, skip link, viewport (zoom left enabled)
  page.tsx          reference page — Hero + Features + CTA
  globals.css       design tokens; no raw hex in components
components/
  Hero.tsx          content-first hero; gates and code-splits the scene
  scene/
    SceneCanvas.tsx R3F canvas; WebGL options set at construction
    ParticleField.tsx  budget-driven particle field
lib/
  capabilities.ts   WebGL detection, device tiering, render budgets
  useSceneGate.ts   the single hook deciding whether 3D mounts
```

## Traps this kit already avoids

- **`antialias` is passed in the `gl` constructor object.** Assigning
  `renderer.antialias` after construction is silently ignored — the context is
  already created.
- **Pointer state covers touch.** R3F normalises mouse and touch into
  `state.pointer`, so mobile visitors get the parallax instead of a dead scene.
- **Geometry is built once** into a static buffer attribute. Rebuilding per frame
  is the usual reason particle fields collapse on mobile.
- **Frame delta is clamped**, so a backgrounded tab does not resume with one large
  jump.
- **`depth: false`** on an additive point cloud, saving bandwidth on tile-based
  mobile GPUs.

## Design guidance

The `ui-ux-pro-max` skill in this repo backs this kit. Query it while building:

```bash
python3 ../../.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack threejs
python3 ../../.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux
python3 ../../.claude/skills/ui-ux-pro-max/scripts/search.py "<brief>" --design-system -p "Client"
```

Its own profile for this style records `performance: cost:high` and
`accessibility: risk:high`. That is the honest framing for 3D client work: the
technique wins pitches and loses conversions when the guardrails are skipped.
