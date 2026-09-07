---
name: Metrix Design System
description: High-contrast editorial store intelligence with tactile precision and chromatic clarity
colors:
  primary: "#4f46e5"
  primary-dark: "#7c3aed"
  primary-hover: "#4338ca"
  accent-apricot: "#FFE5C8"
  accent-apricot-mid: "#FFDAAE"
  accent-apricot-deep: "#FFCC91"
  success: "#2DD881"
  error: "#e63946"
  warn: "#fb8500"
  neutral-bg-light: "#F0F0F0"
  neutral-bg-dark: "#121212"
  neutral-surface-light: "#ffffff"
  neutral-surface-dark: "#1e1e1e"
  neutral-text-light: "#111827"
  neutral-text-dark: "#f3f4f6"
  neutral-muted: "#9ca3af"
  neutral-border-light: "#e5e7eb"
  neutral-border-dark: "#2a2a2a"
typography:
  display:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.neutral-text-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "2.5rem"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "2.5rem"
  chip-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  chip-warn:
    backgroundColor: "{colors.warn}"
    textColor: "{colors.warn}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: Metrix

## Overview

**Creative North Star: "The Editorial Ledger"**

Metrix balances the utilitarian density of an e-commerce operational command center with the razor-sharp aesthetic authority of an avant-garde editorial journal. It rejects the generic pastel gradients, puffy borders, and toy-like illustrations typical of commodity SaaS templates. Instead, it pairs a disciplined monochromatic substrate with vibrant electric indigo and ultramarine accents that guide evaluators through complex datasets with immediate visual priority.

The system relies on structured information rhythm, explicit typography contrast, and high-frequency tabular alignment. Transitions are fluid, tactile, and responsive—conveying an immediate sense of engineering precision. Depth is created tonally rather than through diffuse ambient shadows, preserving high contrast across both light and dark operational modes.

**Key Characteristics:**
- **Tabular Precision**: Clean horizontal rule dividers and tabular number alignments that prioritize scanability across high-density operational data.
- **Tonal Substrates**: Crisp hierarchy between app canvas, nested surfaces, and actionable containers without murky drop shadows.
- **Chromatic Signal Discipline**: Color is not mere decoration; it systematically encodes operational state, trends, and focus.
- **Micro-Interaction Elasticity**: Springy, purposeful transitions that respond decisively to pointer and keyboard engagement.

## Colors

The palette pairs high-contrast monochrome canvas layers with electric indigo/violet focal accents and semantic status indicators.

### Primary
- **Electric Indigo** (#4f46e5 / light mode): Dominant interactive trigger and focal anchor on light canvas surfaces.
- **Ultramarine Violet** (#7c3aed / dark mode): Tuned for luminescence and legibility against deep dark substrates.
- **Deep Indigo / Violet Hover** (#4338ca / #6d28d9): Deepened contrast feedback on active and hover states.

### Secondary
- **Sunlit Apricot** (#FFE5C8): High-visibility contextual background for key analytical summary icons and notification pings.
- **Warm Amber Accent** (#FFCC91): Mid-tone border and badge accent used for secondary metric emphasis.

### Tertiary
- **Signal Emerald** (#2DD881): High-saturation green denoting active customers, completed orders, and positive growth vectors.
- **Signal Crimson** (#e63946): Clean red reserved for destructive actions, validation errors, and cancelled orders.
- **Alert Ochre** (#fb8500): Warning tone for low inventory, pending orders, and simulated system alerts.

### Neutral
- **Deep Black Canvas** (#121212): Root backdrop in dark mode providing maximum contrast with elevated cards.
- **Subtle Gray Canvas** (#F0F0F0): Root backdrop in light mode creating crisp perimeter separation from white card surfaces.
- **Card Surface Light** (#ffffff): Pristine white elevated plane for cards, modal dialogs, and table shells.
- **Card Surface Dark** (#1e1e1e): Low-reflectance dark card plane providing sharp definition without eye fatigue.
- **Text Ink Primary** (#111827 / light mode, #f3f4f6 / dark mode): High-contrast primary typographic copy.
- **Text Muted Slate** (#9ca3af): Secondary meta-information, table headers, and timestamp labels.
- **Border Hairline** (#e5e7eb / light, #2a2a2a / dark): Subtle 1px bounding lines defining surface geometry.

### Named Rules
**The Chromatic Feedback Rule.** Color actively encodes domain statuses across all cards, graphs, and metric badges with explicit semantic meaning; decorative color without semantic value is prohibited.

**The Contrast Parity Rule.** Every interactive element, status indicator, and typography level must achieve equivalent WCAG AA contrast ratios in both light and dark modes.

## Typography

**Display Font:** Roboto (with fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)  
**Body Font:** Roboto (with fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)  
**Label/Mono Font:** Roboto, tabular numerals (with fallback: ui-monospace, SFMono-Regular, monospace)

**Character:** Modern, clean, highly legible grotesque sans-serif with geometric clarity and tight vertical proportion, balanced for dense metrics and editorial poise.

### Hierarchy
- **Display** (700 bold, 1.5rem / 24px, line-height 1.2, letter-spacing -0.02em): Section headers, top-level metric hero statistics.
- **Headline** (700 bold, 1.25rem / 20px, line-height 1.3, letter-spacing -0.01em): Card titles, modal headers, page views.
- **Title** (500 medium, 1rem / 16px, line-height 1.4, letter-spacing normal): Table caption titles, group headers, navigation links.
- **Body** (400 regular, 0.875rem / 14px, line-height 1.5, letter-spacing normal): Data table cells, customer emails, chat messages, input values.
- **Label** (500 medium, 0.75rem / 12px, line-height 1.4, letter-spacing 0.02em): Table column headers, status badges, secondary timestamps.

### Named Rules
**The Tabular Alignment Rule.** All monetary figures, order counts, dates, and quantitative values must align with monospace or tabular numerals to maintain columnar scanning stability.

## Layout

Metrix operates on a flexible sidebar-and-canvas layout with a persistent top navigation bar and fluid responsive grid.

- **Sidebar**: Fixed-width navigation shell (64px collapsed, 192px expanded) featuring smooth CSS width transitions and persistent icon anchoring.
- **Header**: 58px fixed-height utility strip housing contextual view titles, theme toggles, data reset trigger, and user profile avatar.
- **Grid & Containers**: Summary metric cards utilize a 4-column responsive CSS grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`) with 16px to 24px gutters.
- **Density**: High operational density with compact table rows (36px to 44px height), 8px cell padding, and sticky table header positioning (`sticky top-0`).

## Elevation & Depth

Metrix uses **tonal layering** as its primary depth mechanism rather than diffuse drop shadows. Surfaces step forward through calculated background color progression: canvas (`surface-2`) → card container (`surface-1`) → nested input/control (`surface-2`) → active flyout (`surface-3`).

### Shadow Vocabulary
- **Overlay Flyout Shadow** (`box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`): Used exclusively on active dropdown menus, date pickers, and search completion flyouts.
- **Notification Toast Shadow** (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`): Floats centered alert toasts above all UI z-indices.

### Named Rules
**The Flat-By-Default Rule.** Surfaces remain completely flat at rest, bounded only by 1px hairline borders and background tonal contrast. Elevation shadows are permitted only during temporary spatial detachment (dialogs, dropdowns, floating toasts).

## Shapes

- **Corners**: Moderate, consistent curvature. Small chips and avatars use full pills (`rounded-full` / 9999px); cards, inputs, and buttons use crisp medium corners (`rounded-md` / 6px); inner pills use small radii (`rounded-sm` / 4px).
- **Borders**: Crisp 1px hairline borders (`border border-gray-2 dark:border-dark-3`) delineating table headers, search fields, and modal containers.
- **Avatars**: Circular clips (`rounded-full` / 50%) for customer portraits and user profile photos.

## Components

### Buttons
- **Shape:** Medium radius (6px / `rounded-md`).
- **Primary:** Electric Indigo (`#4f46e5`) on light, Ultramarine Violet (`#7c3aed`) on dark. Height 40px (2.5rem), padding 8px 16px, text uppercase or capitalized with font-medium.
- **Hover / Focus:** Transitions over 150ms to deepened hue (`#4338ca` / `#6d28d9`); active state applies slight compression. Focus rings illuminate with a 2px violet ring offset.
- **Text / Ghost:** Transparent background, primary accent text, hover applies subtle `surface-2` backing tint.

### Chips
- **Style:** Subtle tinted translucent background (12% opacity) paired with 100% saturation foreground text.
- **Variants:**
  - Success: Tinted `#2DD881` for active customer status and completed fulfillment.
  - Warning: Tinted `#fb8500` for low stock and pending orders.
  - Neutral / Disabled: Tinted `#9ca3af` for archived items.

### Cards / Containers
- **Corner Style:** Medium radius (6px / `rounded-md`).
- **Background:** `surface-1` (pure white in light mode, `#1e1e1e` in dark mode).
- **Border:** Subtle 1px structural hairline.
- **Internal Padding:** 16px to 24px (`p4` to `p6`).

### Inputs / Fields
- **Style:** 40px height (`h-10`), `surface-2` fill, medium radius (6px), no default border stroke.
- **Focus:** 1px outline ring transitioning to violet (`focus:outline-violet` / `focus:outline-indigo-4`).
- **Error State:** Subtle red tint with 10% opacity, crisp `#e63946` error subtext.

### Tables (BaseTable)
- **Header:** Sticky top position, subtle hairline outline, uppercase or capitalized muted labels (`typo-clr-muted`).
- **Rows:** Hover background shift (`hover:surface-2`), alternating or clean whitespace, aligned tabular numbers for currency and dates.

## Do's and Don'ts

### Do:
- **Do** preserve 100% explicit imports across all Vue components, icons, and composables.
- **Do** use `surface-1`, `surface-2`, and `surface-3` tokens instead of hardcoded hex codes inside component templates.
- **Do** ensure every interactive state provides both visual hover feedback and accessible keyboard focus styling.
- **Do** maintain tabular numeric alignment for all price, quantity, and date columns.
- **Do** use the single-click "Reset Data" flow to test clean-slate states during development and evaluation.

### Don't:
- **Don't** use diffuse, fuzzy drop shadows on resting cards or tables; keep surfaces flat and tonally separated.
- **Don't** introduce global component auto-importing or register components in `main.ts`.
- **Don't** invent third-party cloud backend calls or external API endpoints; all data operations must pass through `mockDb`.
- **Don't** use saturated accent colors purely for decorative whimsy; color must convey status, focus, or brand identity.
- **Don't** break dark/light mode parity; every new view must look equally intentional in both themes.
