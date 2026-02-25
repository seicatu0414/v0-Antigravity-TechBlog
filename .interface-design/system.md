# TechBlog Design System

## Core Intent
**Direction:** Editorial Tech
**Feel:** Stoic, code-first, highly readable, precise. Like a high-quality technical manual or a dedicated developer tool.
**Domain:** Authorship, Publication, Knowledge Curation, Readability, Code Snippets.

## Token Architecture

### 1. Color World (Values)
- **Paper (Backgrounds):** `bg-zinc-50` (light) / `bg-zinc-950` (dark)
- **Ink (Foregrounds):** `text-zinc-900` (primary light), `text-zinc-500` (muted light) / `text-zinc-50` (primary dark), `text-zinc-400` (muted dark)
- **Charcoal (Borders):** `border-zinc-200` (light) / `border-zinc-800` (dark)
- **Accents (Editor vibes):** Subtle Cyan (`text-cyan-600` / `text-cyan-400`) and Amber (`text-amber-600` / `text-amber-400`) for structural highlights, never for large surfaces.
- **Surface Elevation:** We do NOT use shadows. Hierarchy is established exclusively through subtle background shifts and borders.
  - Base: `bg-background` (zinc-50/zinc-950)
  - Surface 1 (Inputs/Code): `bg-zinc-100` / `bg-zinc-900`
  - Surface 2 (Hover/Active): `bg-zinc-200` / `bg-zinc-800`

### 2. Depth Strategy (Borders-Only)
- **Zero Drop Shadows.** Remove all `shadow-sm`, `shadow-md`, `shadow-lg` from the application.
- Use `border` (1px) for definition.
- Use `border-l-2` or `border-l-4` for emphasis (like blockquotes or active navigation items).

### 3. Typography
- **Headlines / Prose:** Proportional sans-serif (Inter/system-ui) or Serif (if applicable for long-form reading).
- **Metadata / Badges / Tags:** Monospace (`font-mono`). This is the signature. Any system-level information (dates, tags, authors, status) should be monospaced to feel technical and precise.
- **Weights:** Use `font-normal` and `font-medium`. Avoid `font-extrabold` or `font-black` unless absolutely necessary for a specific hero section.

### 4. Spacing & Padding
- **Base Unit:** 4px (Tailwind `1`).
- **Scale:** Standardize on multiples: 4, 8, 16, 24, 32, 48, 64.
- **Symmetry:** Keep padding symmetrical (e.g., `p-4` or `px-4 py-2`).

### 5. Interaction States
- Every interactive element needs:
  - Default
  - Hover (`hover:bg-zinc-100` / `hover:bg-zinc-800`)
  - Focus (`focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1`)
  - Disabled (`disabled:opacity-50 disabled:cursor-not-allowed`)

### 6. Signatures to Implement
1. **Cards:** Remove shadows and rounded corners `rounded-xl` or larger. Use `border border-zinc-200 dark:border-zinc-800` and `rounded-sm` or `rounded-none`.
2. **Tags:** Make them sharp rectangles (`rounded-none` or `rounded-sm`), with monospaced text uppercase (`text-xs font-mono uppercase tracking-wider`).
3. **Buttons:** Flat, bordered, minimal radius (`rounded-sm`).
4. **Hero/Headers:** Clean, wide whitespace, emphasizing the typography and removing gradient blobs or decorative shapes.
