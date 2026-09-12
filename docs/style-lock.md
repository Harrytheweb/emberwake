# First Light Hunt — the locked style

> Hard-sun pastoral realism: living timber, dark hide and worn leather under a bright temperate sky, finished matte with saturated meadow green and blue-grey stone, treated as noon-leaning morning — electric grass, long hard shadows, no peach haze, no cartoon chalk.

| role | hex | where it belongs |
|---|---|---|
| meadow-hot | `0x3EC12A` | sunlit grass, near field |
| meadow-deep | `0x1F7A28` | grass in shade, hollows |
| leaf | `0x2F6B2A` | tree mass, hedge |
| hide-dark | `0x1A120E` | horse body, dark fur |
| hide-rim | `0x3A2A22` | horse muzzle, joints, mane light |
| leather | `0x4A3728` | saddle, straps, boots |
| cloth-light | `0xE8E4DC` | rider shirt, unbleached cloth |
| cloth-dark | `0x2C2C2E` | rider trousers, cap |
| ridge-near | `0x2A3842` | nearest mountain faces (kept dark so ACES cannot snow them) |
| ridge-far | `0x3A5470` | distant ridges, cool stone |
| sky | `0x4AA3E6` | sky-facing cool fill, water |
| sand | `0xD2B48C` | beach, dune |

## Fixed decisions
- Metres. The riding horse is 1.62 m at the withers (about 2.0 m to ear tips). The young hunter is 1.68 m. A meadow oak is 8.6 m. A cottage is 4.8 m to the ridge. A fence bay is 2.4 m long and 1.15 m high. A shop stall is 2.2 m wide and 2.0 m high. A bush is 1.05 m. A grass tuft is 0.42 m. A range ridge is 22 m tall and about 70 m along.
- Animals keep the previous standing heights.
- Base at y = 0, centred on x and z, front faces +Z.
- Flat colours with sensible roughness; surfaces are applied at load time.
- Material names from the contract's list: plaster | stone | timber | tile | metal | fabric | foliage | ground.
- No logos, no glyphs, no branded stripes. No photo mapped from a stock rider.
- Two temperatures: hard warm key, cool blue fill. Shade is darker and cooler. Meadow takes the key.
- The opening frame sells scale: open grass, a dark horse, layered blue ridges, a bright sky.

## Claims a critic may fail
- Meadow reads saturated green, not mint pastel or khaki dust.
- Mountains are blue-grey ridges with depth, not pale peach cones.
- The horse is a dark readable silhouette, not a brown ball.
- Long ground shadows exist; the sun is a direction, not an ambient wash.
