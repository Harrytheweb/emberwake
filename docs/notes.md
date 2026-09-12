# Build notes

Hero objects used three construction arms. Winners, picked for silhouette and part-count against the references in `docs/references/`:

- `riding_horse` arm A (primitives + joints) over lathe barrel B — saddle and limb pivots read, B lost the shoulder.
- `meadow_oak` arm A (clumped spheres) over disk canopy C — A occupies volume the way the reference does.
- `young_hunter` arm A (boxed plates + joints) over capsule C — C is a doll; A takes the light plates.

Animals share a quadruped or bird kit with different proportions, antlers, tusks and stance so the book of twenty stays distinct without twenty unique generators. Shore birds and the heron use the bird kit; aurochs, elk and stag carry bone.

Ground coupling and two temperatures come from `rig.js` at hour 10.15 / maxElevation 40 (about 35° sun, blue sky, long hard shadows). Three.js `smoothstep` is `(x, min, max)` — the first meadow used GLSL argument order and baked a perfectly flat plane.
