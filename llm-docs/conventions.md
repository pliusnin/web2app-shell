# Code conventions

Rules for every code change in `src/`. Layer map and composition: [architecture.md](architecture.md).

## FSD

FSD v2.1, pages first. Layers from top to bottom: `app` → `pages` → `widgets` → `features` → `shared`. No `entities`: the app has no shared business entities.

- Import only from lower layers. Slices of one layer never import each other.
- Every slice and every `shared` segment has an `index.ts` with explicit named exports, no `export *`. Other slices import only through it.
- Inside a slice, import the exact file by a relative path.
- Imports between slices are relative too, no `@/` aliases: `tsc` doesn't rewrite aliases in `.d.ts`, and `src/` is going to become a separate package.
- Never import from outside `src/`.
- Place code by meaning, not by its only current caller: generic helpers go to `src/shared/lib` even when one slice uses them.
- Code used by one page stays in that page. Move it to `features` only when a second consumer appears (Steiger `insignificant-slice`).
- `shared/ui` holds components only, never colors or helpers.

## Naming

- File names in kebab-case.
- Helpers (non-hook functions): verb name ending in `Helper`, file `*.helper.ts`, e.g. `getTabIconHelper` in `get-tab-icon.helper.ts`. Applies to every layer, `shared/lib` included.
- Hooks: `use*`, file `use-*.ts`.
- Types: `*.types.ts` next to their code, split by domain, no catch-all `types.ts`. Component props and hook-local types stay in their module.
- Not renamed so far: reducers (`page-load-reducer.ts`), `resolveConfig` and module-local functions. Ask before extending the `Helper` rule to them.

## Responsibility

One responsibility per module. Components only render and wire props. Behavior such as WebView handlers lives in its own hook, every helper in its own file.

## Comments

- Every exported helper and hook gets a JSDoc of 1–4 lines right above it: what it does and why. In English.
- Components, types, config fields, reducers and `resolveConfig` get no header comment.
- Inside functions, comment only non-obvious platform or library quirks, the kind a reader would otherwise "fix".

## Checks

Run after a change:

- `npx tsc --noEmit`
- `npm run lint`: ESLint, Prettier violations included
- `npm run lint:fsd`: Steiger, config `steiger.config.mjs`
- `npm run format:check`: Prettier, `*.md` included

`steiger.config.mjs` stays `.mjs`: Steiger ignores `.mts` configs, and `.ts` triggers a Node module-type warning.
