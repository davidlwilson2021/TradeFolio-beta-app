# TradeFolio Design System

**Style:** "Iron & Amber" (Industrial, Rugged, High-Utility)
**Inspiration:** DeWalt, Caterpillar, Milwaukee Tool
**Principle:** Rugged Premium -- sophisticated code wrapped in an industrial shell.

---

## 1. Color Palette

### Core Colors

| Token          | Hex       | Name             | Usage                                       |
|----------------|-----------|------------------|---------------------------------------------|
| `primary`      | `#FFB800` | Safety Gold      | Primary buttons, CTAs, critical alerts      |
| `secondary`    | `#1A1C1E` | Off-Black        | Headers, hero cards, dark surfaces          |
| `accent`       | `#37474F` | Steel Blue-Grey  | Secondary buttons, borders, card backgrounds|
| `success`      | `#2E7D32` | Forest Green     | Completed tasks, passed inspections         |
| `background`   | `#F5F5F5` | Concrete Grey    | Main page background (light theme)          |

### Extended Palette

| Token             | Hex       | Context                        |
|-------------------|-----------|--------------------------------|
| `primaryDark`     | `#E0A200` | Pressed/active state of Gold   |
| `primaryLight`    | `#FFCA40` | Hover/highlight state of Gold  |
| `accentLight`     | `#455A64` | Lighter steel for hover states |
| `surface`         | `#FFFFFF` | Card surfaces (light theme)    |
| `surfaceDark`     | `#1A1C1E` | Card surfaces (dark theme)     |
| `textPrimary`     | `#1A1C1E` | Primary body text (light)      |
| `textSecondary`   | `#546E7A` | Secondary/muted text (light)   |
| `textOnDark`      | `#FFFFFF` | Text on dark backgrounds       |
| `textOnPrimary`   | `#1A1C1E` | Text on Safety Gold buttons    |
| `border`          | `#37474F` | Structural borders             |
| `borderLight`     | `#B0BEC5` | Subtle borders (light theme)   |
| `error`           | `#C62828` | Error states                   |
| `warning`         | `#FFB800` | Warning (shares primary gold)  |
| `info`            | `#1565C0` | Informational states           |

### Dark Theme Overrides

| Token          | Light         | Dark          |
|----------------|---------------|---------------|
| `background`   | `#F5F5F5`     | `#121212`     |
| `surface`      | `#FFFFFF`     | `#1A1C1E`     |
| `surfaceLight` | `#ECEFF1`     | `#263238`     |
| `textPrimary`  | `#1A1C1E`     | `#FFFFFF`     |
| `textSecondary`| `#546E7A`     | `#B0BEC5`     |
| `border`       | `#37474F`     | `#37474F`     |
| `borderLight`  | `#B0BEC5`     | `#455A64`     |

---

## 2. Typography

### Font Families

| Role     | Font              | Weight          | Notes                                   |
|----------|-------------------|-----------------|-----------------------------------------|
| Headings | Barlow Condensed  | Bold / ExtraBold| All-caps for H1/H2, letter-spacing: -0.02em |
| Body     | Inter             | Regular (400)   | Clean, high-legibility sans-serif       |

### Type Scale

| Token       | Size | Weight   | Family            | Transform  | Letter Spacing |
|-------------|------|----------|-------------------|------------|----------------|
| `h1`        | 32px | 800      | Barlow Condensed  | uppercase  | -0.02em        |
| `h2`        | 24px | 700      | Barlow Condensed  | uppercase  | -0.02em        |
| `h3`        | 20px | 600      | Barlow Condensed  | none       | normal         |
| `h4`        | 18px | 600      | Barlow Condensed  | none       | normal         |
| `body`      | 16px | 400      | Inter             | none       | normal         |
| `bodySmall` | 14px | 400      | Inter             | none       | normal         |
| `caption`   | 12px | 400      | Inter             | none       | normal         |
| `button`    | 16px | 600      | Barlow Condensed  | uppercase  | 0.04em         |
| `label`     | 14px | 500      | Inter             | none       | normal         |

---

## 3. Spacing & Layout

### Spacing Scale

| Token | Value |
|-------|-------|
| `xs`  | 4px   |
| `sm`  | 8px   |
| `md`  | 16px  |
| `lg`  | 24px  |
| `xl`  | 32px  |
| `xxl` | 48px  |

### Border Radius

All corners kept tight -- max **4px**. No pill shapes. Everything should feel machined and structural.

| Token    | Value | Usage                  |
|----------|-------|------------------------|
| `sm`     | 2px   | Small elements, chips  |
| `md`     | 4px   | Cards, buttons, inputs |
| `lg`     | 4px   | Capped at max          |
| `xl`     | 4px   | Capped at max          |
| `round`  | 999px | Avatar circles only    |

### Touch Targets

Minimum touch target: **48px** (accessibility requirement).

---

## 4. Component Specifications

### Buttons

| Variant   | Background  | Text Color  | Border                |
|-----------|-------------|-------------|-----------------------|
| Primary   | `#FFB800`   | `#1A1C1E`   | none                  |
| Secondary | `#1A1C1E`   | `#FFFFFF`   | none                  |
| Outline   | transparent | `#37474F`   | 2px solid `#37474F`   |
| Ghost     | transparent | `#37474F`   | none                  |

- Corner radius: 4px
- Font: Barlow Condensed SemiBold, uppercase, letter-spacing 0.04em
- Min height: 48px
- Horizontal padding: 24px

### Cards

- Background: `surface` token (white in light, `#1A1C1E` in dark)
- Border: 1px solid `#37474F` (structural, not shadow-based)
- Corner radius: 4px
- Padding: 16px
- No drop shadows -- depth defined by borders

### Inputs

- Background: `surfaceLight` token
- Border: 1px solid `#37474F`
- Corner radius: 4px
- Font: Inter Regular, 16px
- Label: Inter Medium, 14px, `textSecondary`
- Error state: border changes to `error` color
- Focus state: border changes to `primary` (Safety Gold)
- Min height: 48px

### High-Impact Sections

Use `#1A1C1E` (Off-Black) background for hero areas, feature cards, and sections that need visual weight. Text on these sections uses `#FFFFFF` with Safety Gold for accents.

---

## 5. Design Principles

1. **Machined, not rounded.** Keep corners tight (4px max). Avoid soft, "app-like" pill shapes.
2. **Borders over shadows.** Use 1-2px solid borders (`#37474F`) to define depth. No drop shadows.
3. **High-visibility CTAs.** Safety Gold stands out against both light and dark surfaces.
4. **Built for the field.** UI must be readable in bright sunlight (high contrast) and operable with gloves (large touch targets).
5. **Rugged Premium.** Sophisticated engineering wrapped in an industrial shell.

---

## 6. Implementation Reference

Theme tokens are implemented in:

```
mobile/src/theme/
  colors.ts       -- Color palette with light/dark theme support
  typography.ts   -- Font families, sizes, weights, transforms
  spacing.ts      -- Spacing scale and border radius
  index.ts        -- Public exports
```

Fonts required (load via Expo):
- `BarlowCondensed-SemiBold`
- `BarlowCondensed-Bold`
- `BarlowCondensed-ExtraBold`
- `Inter-Regular`
- `Inter-Medium`
