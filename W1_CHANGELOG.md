# W1 Changelog

## Source control

- Writable repository: `1heartsmoon-collab/human-atlas`
- Base commit: `1c38bf35c254a891200d3cedecfd57abebe83d8d`
- W1 branch: `v0/w1-model-fidelity-preview`
- Work started from the clean fixed baseline. The W0.5D baseline branch and upstream were not modified. A read-only remote branch check preceded creating W1; no W0.5D-2 changes were merged or overwritten.
- W1 commit: the commit containing this file, subject `Add W1 real-mesh fidelity lab and review evidence`. Resolve its exact SHA via branch history. No production deployment or merge was requested or performed.

## Changes

- `app/fidelity-data.ts`: runtime manifest diagnostics; real candidate and mesh ID lookup; JSON download helper.
- `app/fidelity-lab.tsx`: FACE / VISCERA / MATERIAL A/B / DEEP TRUNK, state presets, list selection, pair comparison, isolate/restore, camera controls, session PNG and metadata capture.
- `app/scene.tsx`: optional lab filtering in existing batch shader, diagnostic colors, bounds framing and per-scene camera cache, optional muscle material parameters, capture event and cleanup. Original geometry/normal buffers and axis conversion retained.
- `app/anatomy.ts`: optional lab state fields.
- `app/page.tsx`: lab entry/return; original whole-body interface retained.
- `app/globals.css`: bounded lab viewport, responsive layout, Japanese font fallback. Noto Sans JP uses Google Fonts; no external anatomy assets.
- `scripts/w1-verify.mjs`: reproducible count, mapping, source-asset and lockfile checks.
- `W1_MESH_DIAGNOSTICS.json`: generated actual concept/mesh/part-name catalogue for targets.
- `W1_REALITY_MATRIX.md`, `W1_VISUAL_COMPARISONS.md`, this file: design-review handoff.

No change to public/models, original normals, model binaries, package manifest or lockfile. No Z-Anatomy assets, new textures, fabricated fascia or muscle fibers, authentication, database or production publishing.

## Validation

- `node scripts/w1-verify.mjs --export`: PASS; generated diagnostic JSON.
- `node scripts/w1-verify.mjs`: PASS again at handoff.
- `npm run check`: PASS again at handoff.
- `npm run build`: PASS again after the CSS import-order correction. Remaining warning: JS chunk >500 kB (930.03 kB, gzip 269.04 kB); not a build failure or performance approval.
- `git diff --check`: PASS.
- 2234 unique parts, 3432 concepts, 15 chunks, nine confirmed anchor pairs unchanged. Lockfile SHA-256 `7442e01b64a04a4cc618793bc9ee8a544a9f22b298b3606613e332bf2513fd30` unchanged.
- Actual browser screenshots: ten saved in the review bundle. See visual comparison report for passed paths and limits.
- BLOCKED / incomplete: mobile, full camera/reset/return regression, per-organ and every-mesh visual inspection, GPU FPS and physical-device testing. No claim of complete test PASS.

The prior response was interrupted before this handoff and Git synchronization. This checkpoint preserves the implementation and explicitly records remaining verification. Stop at design review; do not advance to publication or medical/commercial approval.
