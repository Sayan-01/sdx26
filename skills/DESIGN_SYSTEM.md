# Milestack — Design System

A calm, premium, minimal dark-only design system. One restrained mint accent on a near-black canvas. Editorial serif display, monospaced meta, refined sans body. Every value below is a token — never hardcode raw colors, fonts, or shadows in components.

**Stack target:** Tailwind CSS v4 (CSS-first config) + Next.js 16 App Router (React Server Components by default).

---

## 0. Stack conventions (Tailwind v4 + Next.js 16 App Router)

### 0.1 File layout

```
app/
  layout.tsx          // root layout — <html>, <body>, font vars, metadata
  globals.css         // Tailwind v4 entry — @import "tailwindcss" + @theme
  page.tsx            // route: /
  (dashboard)/
    layout.tsx        // sidebar + topbar shell (Server Component)
    page.tsx          // route: /  (or nested)
components/
  ui/                 // primitives (Button, Input, Pill, Card)
  app/                // composed pieces (Sidebar, TopBar, MetricTile)
lib/
  cn.ts               // clsx + tailwind-merge helper
```

- Default every component to a **Server Component**. Add `"use client"` only for interactive pieces (nav item with `usePathname`, search input, dropdowns, motion).
- No `pages/` directory. All routing lives in `app/`.

### 0.2 Tailwind v4 entry (`app/globals.css`)

Tailwind v4 is CSS-first: **no `tailwind.config.{js,ts}`**, no `@tailwind base/components/utilities` directives, no PostCSS `tailwindcss` plugin. Use a single import and declare tokens in `@theme`.

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  --radius: 0.5rem;

  --color-background: oklch(0.16 0.005 260);
  --color-foreground: oklch(0.955 0.005 100);

  --color-surface:    oklch(0.185 0.006 260);
  --color-surface-2:  oklch(0.215 0.007 260);
  --color-surface-3:  oklch(0.255 0.008 260);
  --color-card:       oklch(0.19 0.006 260);
  --color-popover:    oklch(0.2 0.006 260);

  --color-muted-foreground:   oklch(0.68 0.01 260);
  --color-subtle-foreground:  oklch(0.52 0.01 260);

  --color-accent:         oklch(0.82 0.13 155);
  --color-accent-foreground: oklch(0.16 0.005 260);
  --color-accent-soft:    oklch(0.35 0.06 155);
  --color-ring:           oklch(0.82 0.13 155 / 60%);

  --color-border:         oklch(1 0 0 / 7%);
  --color-border-strong:  oklch(1 0 0 / 12%);
  --color-input:          oklch(1 0 0 / 10%);

  --color-chart-1: oklch(0.82 0.13 155);
  --color-chart-2: oklch(0.72 0.12 220);
  --color-chart-3: oklch(0.78 0.14 65);
  --color-chart-4: oklch(0.7 0.18 15);
  --color-chart-5: oklch(0.6 0.13 300);

  --font-display: "Instrument Serif", ui-serif, Georgia, serif;
  --font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-sans:    "Inter", ui-sans-serif, system-ui, sans-serif;

  --shadow-elegant: 0 1px 0 oklch(1 0 0 / 4%) inset, 0 24px 60px -24px oklch(0 0 0 / 55%);
  --shadow-soft:    0 1px 0 oklch(1 0 0 / 4%) inset, 0 8px 24px -12px oklch(0 0 0 / 45%);
}

@utility shadow-elegant { box-shadow: var(--shadow-elegant); }
@utility shadow-soft    { box-shadow: var(--shadow-soft); }

@utility dotted-grid {
  background-image: radial-gradient(oklch(1 0 0 / 6%) 1px, transparent 1px);
  background-size: 22px 22px;
}

@layer base {
  html { color-scheme: dark; }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    font-feature-settings: "ss01", "cv11";
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    background-image:
      radial-gradient(1200px 600px at 15% -10%, oklch(0.82 0.13 155 / 5%), transparent 60%),
      radial-gradient(900px 500px at 100% 0%, oklch(0.72 0.12 220 / 4%), transparent 60%);
    background-attachment: fixed;
  }
  ::selection { background: oklch(0.82 0.13 155 / 25%); color: var(--color-foreground); }
}
```

Tailwind v4 rules that matter for this system:
- A `--color-*` token in `@theme` auto-generates `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, `stroke-*` utilities. Name tokens accordingly (`--color-surface-2` → `bg-surface-2`).
- Custom utilities use `@utility name { … }` at top level — **not** `@layer utilities { .name {} }`.
- Class-based dark mode uses `@custom-variant dark (&:is(.dark *));`. There is no `darkMode: "class"` config.
- Dynamic class names must be safelisted: `@source inline("bg-chart-1 bg-chart-2 bg-chart-3 bg-chart-4 bg-chart-5");`.
- `@apply` inside a CSS module or scoped stylesheet needs `@reference "../app/globals.css";` at the top of that file. Prefer utilities in `className` over `@apply`.

### 0.3 v4 default shifts to remember when writing components

- Bare `border` = `currentColor`. Always name a color: `border border-border`.
- Bare `ring` = 1px `currentColor`. Use `ring-2 ring-ring` for the mint focus ring.
- Bare `shadow`, `rounded`, `blur` are one step smaller than v3. Use `shadow-elegant` / `shadow-soft` tokens (never bare `shadow`).
- `outline-none` now literally removes the outline. Use `outline-hidden` on focusable elements to keep forced-colors accessibility.
- Removed names: use `bg-linear-to-r` (not `bg-gradient-to-r`), `shrink-0` (not `flex-shrink-0`), `grow` (not `flex-grow`).
- Arbitrary values with spaces use underscores: `grid-cols-[1fr_500px_2fr]`.

### 0.4 Fonts in Next.js 16 (App Router)

Load fonts with `next/font` in `app/layout.tsx` and expose them as CSS variables that match the `@theme` font tokens. **Do not** `@import` a remote Google Fonts URL in CSS.

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"], weight: ["300","400","500","600"],
  variable: "--font-sans", display: "swap",
});
const display = Instrument_Serif({
  subsets: ["latin"], weight: "400", style: ["normal","italic"],
  variable: "--font-display", display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"], weight: ["400","500","600"],
  variable: "--font-mono", display: "swap",
});

export const metadata: Metadata = {
  title: "Milestack — Studio OS for Modern Agencies",
  description: "The calm, minimal operations layer for modern agencies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

The `variable` values must match the `--font-*` tokens in `@theme` so `font-sans` / `font-display` / `font-mono` utilities pick them up.

### 0.5 Metadata & routing

- Per-route SEO uses the `export const metadata: Metadata` (or `generateMetadata`) API in each `page.tsx` / `layout.tsx`. No `<head>` tags authored by hand.
- Navigation: `import Link from "next/link"` and `useRouter` / `usePathname` from `next/navigation` (never `next/router`).
- Sidebar active state: mark that component `"use client"` and read `usePathname()`.
- Server actions or `fetch` in Server Components handle data; do not introduce client-side data hooks unless the piece is interactive.

---

## 1. Foundations

### 1.1 Color (OKLCH, dark-only)

All colors are defined as CSS custom properties on `:root`. No light mode.

**Canvas & surfaces**
| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.16 0.005 260)` | Page canvas (near-black, cool tint) |
| `--surface` | `oklch(0.185 0.006 260)` | Sidebar, subtle panels |
| `--card` | `oklch(0.19 0.006 260)` | Cards, elevated containers |
| `--surface-2` | `oklch(0.215 0.007 260)` | Active nav item, hover surfaces |
| `--surface-3` | `oklch(0.255 0.008 260)` | Chips, inline pills, progress track |
| `--popover` | `oklch(0.2 0.006 260)` | Popovers, menus |

**Text**
| Token | Value | Use |
|---|---|---|
| `--foreground` | `oklch(0.955 0.005 100)` | Primary text (near-white) |
| `--muted-foreground` | `oklch(0.68 0.01 260)` | Secondary text |
| `--subtle-foreground` | `oklch(0.52 0.01 260)` | Meta, timestamps, mono labels |

**Accent (mint — the ONLY hue in the system)**
| Token | Value | Use |
|---|---|---|
| `--accent` | `oklch(0.82 0.13 155)` | Progress fills, active dot, focus, key highlights |
| `--accent-foreground` | `oklch(0.16 0.005 260)` | Text on mint |
| `--accent-soft` | `oklch(0.35 0.06 155)` | Muted mint for backgrounds/borders |
| `--ring` | `oklch(0.82 0.13 155 / 60%)` | Focus ring (mint @ 60%) |

**Borders**
| Token | Value | Use |
|---|---|---|
| `--border` | `oklch(1 0 0 / 7%)` | Hairline dividers (default) |
| `--border-strong` | `oklch(1 0 0 / 12%)` | Emphasized separators |
| `--input` | `oklch(1 0 0 / 10%)` | Form field borders |

**Data / charts (used sparingly)**
`--chart-1: oklch(0.82 0.13 155)` mint · `--chart-2: oklch(0.72 0.12 220)` blue · `--chart-3: oklch(0.78 0.14 65)` amber · `--chart-4: oklch(0.7 0.18 15)` coral · `--chart-5: oklch(0.6 0.13 300)` violet.

**Destructive:** `oklch(0.68 0.16 22)` on `oklch(0.98 0.005 100)`.

**Rule:** No purple gradients. No white backgrounds. No secondary hues outside mint for UI chrome — additional hues appear only in chart/data contexts.

### 1.2 Body background gradient

Two large, low-opacity radial washes over the near-black canvas (fixed attachment):

```
background-image:
  radial-gradient(1200px 600px at 15% -10%, oklch(0.82 0.13 155 / 5%), transparent 60%),
  radial-gradient(900px 500px at 100% 0%, oklch(0.72 0.12 220 / 4%), transparent 60%);
background-attachment: fixed;
```

### 1.3 Typography

Load via `next/font` (see §0.4). Never `<link>` or `@import` remote font URLs.

- **Display** — `Instrument Serif` (weight 400, italic optional). Utility: `font-display`.
- **Mono** — `JetBrains Mono` (400/500/600). Utility: `font-mono`.
- **Sans (body)** — `Inter` (300/400/500/600). Utility: `font-sans` (default on `<body>`).

Body font features: `"ss01", "cv11"`. Antialiased. `text-rendering: optimizeLegibility`.

**Type scale**
| Role | Font | Size | Line-height | Tracking | Weight |
|---|---|---|---|---|---|
| Display H1 | Instrument Serif | 3.25rem (52px) | 1.02 | -0.01em | 400 |
| Display H2 | Instrument Serif | 2.25rem (36px) | 1.08 | -0.01em | 400 |
| Section title | Inter | 0.875rem (14px) | 1.4 | 0 | 500 |
| Body | Inter | 0.875rem (14px) | 1.55 | 0 | 400 |
| Meta / label | JetBrains Mono | 0.6875rem (11px) | 1.2 | 0.14em UPPERCASE | 500 |
| Micro meta | JetBrains Mono | 0.625rem (10px) | 1.2 | 0.16em UPPERCASE | 500 |
| Numeric metric | Instrument Serif | 2.5rem (40px) | 1 | -0.01em | 400 |

Uppercase text is JetBrains Mono only. Never uppercase in sans.

### 1.4 Spacing

4px base unit. Steps: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

- Card padding: `24px`.
- Panel padding: `32px` horizontal, `24px` vertical.
- Page gutter: `32px` mobile → `48px` desktop.
- Gap between metric cards: `1px` (hairline composite look).
- Gap between panels: `24px`.
- Stack rhythm inside a card: `12px` meta→title, `20px` title→body, `24px` body→footer.

### 1.5 Radius

Base `--radius: 0.5rem` (8px). Derived:
- `rounded-sm` 4px — inline chips
- `rounded-md` 6px — buttons, inputs
- `rounded-lg` 8px — nav items
- `rounded-xl` 12px — small cards
- `rounded-2xl` 16px — cards, panels, metric tiles
- `rounded-full` — status pills, avatars, dot markers

### 1.6 Border

- Width: `1px` always.
- Default color: `var(--border)` (white @ 7%).
- Emphasized: `var(--border-strong)` (white @ 12%).
- Hairline only — never 2px+ chrome borders.

### 1.7 Shadow

Two tokens. Both combine an inner highlight with a deep drop.

```
--shadow-elegant: 0 1px 0 oklch(1 0 0 / 4%) inset,
                  0 24px 60px -24px oklch(0 0 0 / 55%);
--shadow-soft:    0 1px 0 oklch(1 0 0 / 4%) inset,
                  0 8px 24px -12px oklch(0 0 0 / 45%);
```

- `shadow-elegant` — hero cards, metric grid, primary panels.
- `shadow-soft` — sidebar Pro card, popovers, dropdowns.
- No `shadow-md/lg` defaults. No colored shadows.

### 1.8 Motion

- Duration: 150ms micro · 220ms standard · 320ms layout.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Allowed interactions: color transitions, chevron `translate-x +2px` on hover, progress width, opacity fades. No bounce, parallax, or scroll-jacking.

### 1.9 Icons

Lucide only. Stroke `1.5`. Sizes: 15px (inline meta), 16px (nav / buttons), 18px (headers), 20px (empty states). Inherits `currentColor`.

---

## 2. Layout

### 2.1 App shell

```
┌────────────┬───────────────────────────────────────────┐
│  Sidebar   │  TopBar (64px)                            │
│  (264px)   ├───────────────────────────────────────────┤
│  fixed     │  Main content                             │
│  blur-xl   │  max-width 1400px · padding 32/48px       │
└────────────┴───────────────────────────────────────────┘
```

- Sidebar: `264px`, sticky, `backdrop-filter: blur(24px)`, background `var(--surface) / 70%`, hairline right border.
- TopBar: `64px`, hairline bottom, transparent, `backdrop-blur-xl`.
- Main: `max-width: 1400px`, horizontal padding `48px` (≥1024) / `32px` (<1024), vertical `40px`.

### 2.2 Content grid

1. **Header row** — display title + right-aligned actions.
2. **Metric grid** — 4 columns × 1 row, `1px` gap.
3. **Panel row** — 2 columns, `24px` gap. Left `2fr`, right `1fr`.
4. **Footer** — full width, top hairline, mono meta.

Collapse to one column below `900px`. Sidebar → off-canvas below `1024px`.

---

## 3. Components

### 3.1 Sidebar nav item
- Height `40px`, padding `12px`, gap `12px`, `rounded-lg`.
- Label: Inter 12px / 500, foreground on active, muted at rest.
- Icon: Lucide 15px, stroke 1.5.
- Active: bg `var(--surface-2)` + `6px` mint dot on far right.
- Hover: bg `oklch(1 0 0 / 3%)`, 150ms.

### 3.2 Pro Plan card (sidebar)
- Bg `oklch(0.19 0.006 260 / 70%)`, hairline border, `rounded-2xl`, padding `20px`, `shadow-soft`.
- Mono uppercase eyebrow (11px), Instrument Serif title (18px), Inter body (12px muted), full-width button.

### 3.3 Top bar
- Left: mono breadcrumb, 11px uppercase, subtle-foreground.
- Center: search input, `36px` tall, `rounded-md`, hairline border, transparent bg. Trailing `⌘K` kbd: mono 10px, bg `--surface-3`, `rounded-sm`, padding `2px 6px`.
- Right: bell icon button (`36px` square, ghost), avatar (`32px`, `rounded-full`, hairline border).

### 3.4 Metric tile
- Padding `24px`, `rounded-2xl` on outer corners of the 4-tile group, bg `var(--card)`, `shadow-elegant`.
- Eyebrow: mono 11px uppercase, subtle.
- Value: Instrument Serif 40px.
- Delta: mono 11px, mint if up, muted if flat, coral (`--chart-4`) if down. Prefix `▲ ▬ ▼`.
- Optional spark: 64×20px SVG, stroke `var(--accent)` 1.5px, no fill.

### 3.5 Project row
- Height `72px`, hairline bottom, hover bg `oklch(1 0 0 / 2%)`.
- Leading `44px` square: `rounded-xl`, bg `var(--surface-2)`, initials Instrument Serif 16px.
- Name: Inter 14px / 500. Meta below: mono 11px uppercase, subtle.
- Progress: `36px` wide × `4px` tall track, `rounded-full`, track `--surface-3`, fill `--accent`.
- Status pill (see 3.6).
- Trailing chevron: Lucide 16px, subtle, translates `+2px` on row hover.

### 3.6 Status pill
- `rounded-full`, padding `4px 10px`, mono 10.5px uppercase, tracking `0.14em`.
- Leading `6px` `rounded-full` dot.
- Variants:
  - **Live / on-track:** dot `--accent`, bg `oklch(0.82 0.13 155 / 10%)`.
  - **Review:** dot `--chart-3`, bg `oklch(0.78 0.14 65 / 10%)`.
  - **Blocked:** dot `--chart-4`, bg `oklch(0.7 0.18 15 / 10%)`.
  - **Idle:** dot muted, bg `--surface-3`.

### 3.7 Activity item
- Timeline: `1px` vertical line at `12px` from left, `var(--border)`.
- Node: `8px` `rounded-full`, `--surface-3` (mint if "new").
- Content: Inter 13px body, mono 11px timestamp above (subtle).
- Vertical rhythm: `20px` between items.

### 3.8 Buttons
| Variant | Bg | Text | Border | Shadow |
|---|---|---|---|---|
| Primary | `--foreground` | `--background` | none | `shadow-soft` |
| Accent | `--accent` | `--accent-foreground` | none | `shadow-soft` |
| Ghost | transparent | `--foreground` | hairline | none |
| Icon | transparent | muted → foreground on hover | none | none |

All: height `36px`, padding `0 14px`, `rounded-md`, Inter 13px / 500, `8px` gap to leading icon. Focus: 2px `--ring` with `2px` offset from `--background`.

### 3.9 Inputs
- Height `36px`, `rounded-md`, hairline border, transparent bg.
- Placeholder: subtle-foreground.
- Focus: border → `--border-strong`, ring 2px `--ring`.

### 3.10 Footer
- Top hairline, padding `20px 0`.
- Left: mono 11.5px uppercase copyright.
- Right: mono 11.5px "System · Operational" with `6px` mint dot.

---

## 4. Rules & anti-patterns

**Do**
- Use tokens for every color, font, radius, shadow.
- Keep uppercase text in JetBrains Mono only.
- Keep the mint accent scarce — one accent moment per region.
- Use hairline (1px, white @ 7%) dividers instead of heavy borders.
- Let generous negative space carry the composition.

**Don't**
- No purple/indigo gradients on white.
- No Inter/Poppins as the display face — Instrument Serif is the voice.
- No `shadow-md/lg` defaults, no colored shadows.
- No secondary accent hues in chrome (charts only).
- No emoji icons, no filled Lucide, no stroke-width ≠ 1.5.
- No motion beyond 320ms; no bounce/spring easing.
- No light mode — dark canvas is the identity.
