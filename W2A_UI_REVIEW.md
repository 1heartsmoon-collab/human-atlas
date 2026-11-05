# W2A — Khronos Real Canvas UI (design review, not published)

Branch: `v0/w2a-khronos-atlas-ui`, cut from `v0/w1-model-fidelity-preview` @ 7c09f1d. The W1 commits are kept unchanged.
Default route: Khronos UI. `#classic` = the existing Human Atlas UI. `#lab` = the W1 Fidelity Lab.

## Preserved
- The fixed BodyParts3D manifest, geometry chunks, FMA concept ↔ FJ mesh mapping, and the Three.js engine. No meshes were added, replaced, or synthesized.
- `scene.tsx` has two additive, optional props: `variant="khronos"` (dark clear color and ground) and `hidden` (a per-mesh FJ hide set). Classic and Lab render exactly as before when these props are omitted.
- `anatomy.ts` gained only an export (`isCanonicalSearchMatch`), so search normalization can be reused.

## New code (`app/khronos/`)
| File | Role |
|---|---|
| khronos-atlas.tsx | Shell: header, three panes, mobile bottom sheets, and state for selection, isolate, hidden, view, and language |
| structure-panel.tsx | Search, system toggles, gap register |
| detail-panel.tsx | Details / Meshes / Relations tabs, isolate and per-mesh hide |
| canvas-toolbar.tsx | View presets, auto-rotate, isolate, restore hidden meshes, reset |
| search.ts | Normalizes `FMA:13405`, `fma13405`, and `FJ1541` to stored IDs |
| gap-register.ts | Live W1 manifest audit; NOT_FOUND items are listed, never modeled |
| i18n.ts | JA / EN / bilingual UI strings. Japanese terms are marked 和名未確認 until reviewed |

## Browser tests (desktop 1439×1176, mobile 390×844, WebGL)
| Test | Result |
|---|---|
| Real meshes render on the dark canvas | PASS — 2229/2234 visible (integument off by default) |
| `FMA:13405` search (W0.5D defect) | PASS — resolves to FMA13405 / FJ1541 |
| FJ ID search | PASS |
| Select → back view → isolate | PASS — 1/2234 visible; FJ1541 only |
| Per-mesh hide / restore | PASS — 2229 → 2228 → 2229 |
| Missing structure search (orbicularis oculi) | PASS — 0 results plus a gap row; no substitute shown |
| Bilingual toggle | PASS |
| Mobile: no horizontal overflow, bottom sheets | PASS (bug fixed: Reset now closes the open sheet) |
| Classic route round trip | PASS — engine and controls unchanged |
| `tsc --noEmit`, `vite build` | PASS (existing large-chunk warning only) |

## Open for review
- Japanese anatomical names are not reviewed. The UI shows English plus 和名未確認 instead of guessing.
- The selection tint is still the existing engine's selected material; it was not restyled in W2A.
- Production publish: not performed. Stopped at the design review.
