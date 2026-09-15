# design-sync notes — ad-paws-web-app

## Repo shape

- This repo is the app itself, not a standalone design-system package. There is no
  `dist/` build for a component library — synced components come straight from
  `src/components/ui` (shadcn primitives) via the converter's synth-entry fallback
  (no `.d.ts` package to read, so prop contracts are extracted from the `.tsx` source
  directly — weaker than a real package build).
- Scope for this sync (user-confirmed): `src/components/ui` ONLY. `src/components/Form`,
  `Dialog`, `Dashboard`, `CheckIn`, `Services` are feature/domain compositions, not
  generic DS pieces, and were deliberately excluded.

## Prop-contract fidelity (important — do this before every sync)

Synth-entry mode has no real `.d.ts` to read by default, so raw prop extraction
degrades to `{[key: string]: unknown}` for every component (verified: all 79/79
did on the first build). Fixed by generating real declarations and giving the
converter an `index.d.ts` entry point to resolve function signatures against:

```
rm -rf dist/types
npx tsc -p .design-sync/tsconfig.dts.json      # emits dist/types/components/ui/*.d.ts
```

`<repoRoot>/index.d.ts` (gitignored, regenerate if the component file list
changes) re-exports every `dist/types/components/ui/<file>` — this is what lets
`dts.mjs`'s fallback signature-extraction path resolve each component's real
prop type (variant/size unions, Radix-inherited props like `checked`) instead
of the generic stub. Both `dist/types/` and root `index.d.ts` are build
artifacts, never committed. If a new file is added to `components/ui/`, add a
matching `export * from './dist/types/components/ui/<file>';` line to
`index.d.ts` before rebuilding.

Event handler props (`onClick`, `onCheckedChange`, etc.) are still filtered out
by the converter's DOM-noise heuristic since they're inherited from
`@radix-ui/*` packages, not declared in-package — this is expected/non-blocking;
the design agent is expected to know standard React event props regardless.

## CSS / Tailwind v4

- Tailwind v4 via `@tailwindcss/vite` — there is no static `tailwind.config.js`, and
  `src/index.css` alone is just `@import "tailwindcss"` plus token definitions with
  no compiled utility classes. Real utility CSS only exists after a Vite build.
- **Before every sync**, regenerate the compiled CSS:
  ```
  pnpm run build
  cp dist/assets/index-*.css .design-sync/compiled/app.css
  ```
  `cfg.cssEntry` points at the stable copy (`.design-sync/compiled/app.css`), not the
  hashed `dist/assets/*.css` path (which changes every build).
- All design tokens (colors, radius, sidebar, badges, toast colors) live directly in
  `src/index.css` (`:root` / `.dark` blocks + `@theme inline` mapping) — nothing is
  pulled from `design-system/adpaws-*.css` at build time. Those UX Pilot export files
  in `design-system/` are NOT wired into the app; they were not used as `cssEntry` or
  `tokensGlob` for this reason. Revisit if the app ever migrates to consume them.

## Fonts

- Brand fonts (`sofia-pro`, `bookmania`) load at runtime from Adobe Typekit
  (`<link rel="stylesheet" href="https://use.typekit.net/dti3mzf.css">` in
  `index.html`) — no `@font-face` ships in the bundle. Wired via
  `cfg.runtimeFontPrefixes` to suppress `[FONT_MISSING]`; this is intentional, not a
  gap to fix.

## Package manager / environment

- Repo pins Node 22 (`.nvmrc`) but pnpm install/build were run successfully under
  Node 24 in this environment — no issues observed.
- No `pnpm` binary on PATH; used `corepack pnpm ...` (or `corepack enable` once).
- First install hit `ERR_PNPM_IGNORED_BUILDS` for `esbuild` and `@parcel/watcher` —
  resolved with `corepack pnpm approve-builds --all` (both are standard Vite/esbuild
  build-time deps, safe to approve).

## Re-sync risks

- The compiled CSS copy (`.design-sync/compiled/app.css`) is a snapshot — if the app's
  Tailwind usage changes (new utility classes added/removed elsewhere in the app) and
  this copy isn't refreshed before a re-sync, previews can silently drift from what's
  actually shipped. Always re-run the `pnpm run build` + copy step first.
- Synth-entry mode means `.d.ts` prop contracts are inferred from `.tsx` source, not a
  real type-checked package build — more prone to missing/loose prop types than a
  packaged DS. If this app ever gets a real component-library package extracted with
  its own build, switching this sync to point at that package's `dist/` would meaningfully
  improve contract fidelity.
- Scope is intentionally narrow (`components/ui` only) — if `Form`, `Dialog`, or other
  shared component folders should become part of the synced DS later, that's a scope
  change to `cfg.srcDir`/`componentSrcMap`, not a bug.
