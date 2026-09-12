# First Light Hunt — the locked style

> Soft pastoral realism: objects are built from living timber, worn leather, dry thatch and field stone, finished matte with warm dawn dust, treated as if they have stood in gold light that is already giving way to cool morning blue.

| role | hex | where it belongs |
|---|---|---|
| gold-light | `0xF0C27B` | sun side of thatch, dry grass tips, hide highlights |
| warm-sand | `0xE8A87C` | dunes, beach, skin, clay daub |
| meadow | `0x7EC850` | grass tops, new leaves |
| deep-leaf | `0x2D5A27` | foliage mass, hedge shade, pine |
| khaki | `0xC2B280` | paths, hide, unbleached cloth, dune grass |
| morning-blue | `0x87CEEB` | sky-facing cool planes, distant haze, water sheen |
| bark | `0x4A3728` | trunks, leather straps, hooves, dark fur |
| pale-stone | `0xD4D4D4` | cottage limewash, fence lime, bone, horn |

## Fixed decisions
- Metres. The riding horse is 1.62 m at the withers (about 2.05 m to ear tips). The young hunter is 1.68 m. A meadow oak is 9.4 m. A cottage is 4.8 m to the ridge. A fence bay is 2.4 m long and 1.15 m high. A shop stall is 2.2 m wide and 2.0 m high. A bush is 1.1 m. A grass tuft is 0.42 m. Horizon peaks are authored at 28 m and placed far away.
- Animals, standing, at the shoulder or crown: rabbit 0.22 m, hare 0.32 m, squirrel 0.18 m, pigeon 0.20 m, pheasant 0.38 m, mallard 0.28 m, goose 0.55 m, fox 0.45 m, badger 0.32 m, roe doe 0.85 m, heron 0.95 m, wild sheep 0.85 m, mountain goat 0.90 m, red stag 1.35 m, wild boar 0.85 m, wolf 0.80 m, lynx 0.60 m, brown bear 1.20 m, elk 1.60 m, aurochs 1.70 m.
- Base at y = 0, centred on x and z, front faces +Z.
- Flat colours with sensible roughness; surfaces are applied at load time.
- Material names from the contract's list, not a shortened one: plaster | stone | timber | tile | metal | fabric | foliage | ground.
- No logos, no glyphs, no lettering on any prop. Readable silhouettes do the naming.
- Two temperatures in every frame: warm gold key, cool morning-blue fill. Meadow ground must take the key.

## Claims a critic may fail
- Shade is cooler (blue) than sun, not merely darker.
- The horse reads as the hero: scale, gloss on hide, silhouette against the meadow.
- Near-camera volume is occupied (grass, fence, bush), not a bald green disk.
- Gallop frames stay readable: horizon level, ground lit, animal or landmark in depth.
