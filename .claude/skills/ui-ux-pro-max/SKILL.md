---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation."
---

# UI/UX Pro Max - Design Intelligence

Prioritized UI/UX guidance for design and implementation review across web, mobile, and desktop.

> **Standalone edition.** The upstream version of this skill shipped a `scripts/search.py`
> query tool backed by CSV datasets (styles, palettes, font pairings, UX guidelines, icons,
> GSAP presets, chart types, stacks). Those files were not included with this installation,
> so this edition carries the guidance inline instead. See "Restoring the full edition" at
> the end if you have the original bundle.

## When to Apply

Use this Skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior, or improving perceived quality and usability.

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Rule Categories by Priority

Work priority 1→10 to decide what to address first. When time or scope is limited, categories 1 and 2 are non-negotiable; 9 and 10 can wait.

| Priority | Category | Impact | Key Checks (Must Have) | Anti-Patterns (Avoid) |
|----------|----------|--------|------------------------|------------------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Removing focus rings, Icon-only buttons without labels |
| 2 | Touch & Interaction | CRITICAL | Min size 44×44px, 8px+ spacing, Loading feedback | Reliance on hover only, Instant state changes (0ms) |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) | Layout thrashing, Cumulative Layout Shift |
| 4 | Style Selection | HIGH | Match product type, Consistency, SVG icons (no emoji) | Mixing flat & skeuomorphic randomly, Emoji as icons |
| 5 | Layout & Responsive | HIGH | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px container widths, Disabling zoom |
| 6 | Typography & Color | MEDIUM | Base 16px, Line-height 1.5, Semantic color tokens | Body text < 12px, Gray-on-gray, Raw hex in components |
| 7 | Animation | MEDIUM | Context-aware timing, Motion conveys meaning, Spatial continuity | One duration for every transition, Animating width/height, No reduced-motion |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only labels, Errors only at top, Overwhelming upfront |
| 9 | Navigation Patterns | HIGH | Predictable back, Bottom nav ≤5 items, Deep linking | Overloaded nav, Broken back behavior, No deep links |
| 10 | Charts & Data | LOW | Legends, Tooltips, Accessible colors | Relying on color alone to convey meaning |

## Workflow

### Step 1: Analyze Requirements

Extract from the request:

- **Product type**: SaaS, e-commerce, portfolio, dashboard, entertainment, tool, productivity, or hybrid
- **Target audience & context**: age group, usage context (commute, leisure, work)
- **Style keywords**: playful, vibrant, minimal, dark mode, content-first, immersive
- **Stack**: detect from the project — check `package.json` deps (react/next/vue/svelte/nuxt/@angular), `pubspec.yaml` (Flutter), `*.xcodeproj`/`Package.swift` (SwiftUI), `composer.json` (Laravel), or React Native markers (`app.json` + `react-native` dep). If nothing is detectable and stack guidance matters, ask the user. **Never assume a stack** — a hardcoded default silently misroutes every recommendation.

### Step 2: Establish the Design System

For a new page or project, decide and write down these before building — inconsistency is far more expensive to fix later than to prevent:

- **Spacing scale** — pick one and hold to it. Spacious (24–96px) for marketing, standard (16–64px) for general product, dense (8–32px) for dashboards.
- **Type scale** — base 16px minimum for body, line-height ~1.5, a clear step ratio for headings.
- **Color tokens** — semantic names (`--color-surface`, `--color-danger`), never raw hex in components. Verify each foreground/background pair against 4.5:1.
- **Radius, elevation, border treatment** — one consistent language, not per-component improvisation.
- **Motion tier** — subtle micro-interactions, standard scroll/stagger, or complex choreography. Pick one tier and apply it uniformly.

Record these in the project (a `design-system/MASTER.md` or equivalent) so later pages inherit rather than re-invent. When a page needs to deviate, document the override next to the master rather than editing the master.

### Step 3: Apply Category Guidance

Walk the priority table top-down for the surface being built or reviewed. For each category that applies, verify the Key Checks and scan for the Anti-Patterns.

### Step 4: Stack-Specific Implementation

Apply the idioms of the detected stack — component boundaries, styling approach, and the platform's own interface guidelines (Apple HIG for SwiftUI, Material for Compose, etc.). Common stacks: `react`, `nextjs`, `vue`, `svelte`, `astro`, `nuxtjs`, `angular`, `laravel`, `swiftui`, `react-native`, `flutter`, `jetpack-compose`, `html-tailwind`, `shadcn`, `threejs`, and desktop (`javafx`, `wpf`, `winui`, `avalonia`, `uno`).

## Troubleshooting

| Problem | Focus on |
|---------|----------|
| Can't decide on style/color | Category 4 — anchor to product type first, then narrow palette |
| Dark mode contrast issues | Category 1 + 6 — re-verify every pair at 4.5:1 in *both* themes; dark mode is not an inversion |
| Animations feel unnatural | Category 7 — vary duration by distance/context, ease out on enter, exit faster than enter |
| Form UX is poor | Category 8 — visible labels, inline validation, errors adjacent to the field, manage focus on error |
| Navigation feels confusing | Category 9 — flatten hierarchy, cap bottom nav at 5, make back predictable |
| Layout breaks on small screens | Category 5 — mobile-first breakpoints, fluid containers, never disable zoom |
| Performance / jank | Category 3 — virtualize long lists, reserve image space, debounce/throttle, animate transform/opacity only |

## Before Delivering UI

Run this checklist. It is scoped tightest for native/mobile app UI but every item applies to web:

- [ ] Every interactive target is ≥44×44px with ≥8px separation
- [ ] Every control is reachable and operable by keyboard, with a visible focus indicator
- [ ] Every icon-only control has an accessible label; decorative icons are hidden from assistive tech
- [ ] All text meets 4.5:1 contrast in light **and** dark themes
- [ ] Every async action has a loading state, and every failure has a recoverable error state
- [ ] Layout respects safe areas / notches and survives 320px width without horizontal scroll
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Icons are SVG or a real icon set — never emoji
- [ ] Nothing conveys meaning through color alone

## Restoring the Full Edition

If you obtain the original bundle, add `scripts/search.py`, `references/quick-reference.md`,
`references/pro-rules.md`, and the CSV datasets to this skill's directory. Invoke the script
by absolute path from the skill directory — note that `${CLAUDE_PLUGIN_ROOT}` used in the
upstream docs is only defined for plugin-packaged skills and will not resolve for a
project-scoped skill like this one.
