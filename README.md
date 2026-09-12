# First Light Hunt

404 Game Jam entry. A dawn hunting ride across an open pastoral country: mount, gallop, jump the rails, loose the bow, creep when the shy ones listen, and fill a book of twenty animals.

Play: **https://harrytheweb.github.io/emberwake/game/**

## Concept

Golden hour sliding into morning blue. Meadows, oaks, fences, a village stall, dunes and a shore, mountains on the far line. You are a young hunter with one horse. Points from hide, fur, feathers and meat unlock a quieter creep and a faster horse. Meat and fur buy a harder bow and a fuller quiver at the stall. The win is one of each of the twenty.

## Controls

| | Desktop | Mobile |
|---|---|---|
| Move | WASD / arrows | Left stick (drag up to go) |
| Look | Mouse (click to lock) | Right look pad |
| Loose | Click | LOOSE |
| Mount / dismount | E | MOUNT |
| Creep | Shift | CREEP |
| Jump rails | Space (or gallop at them) | Automatic when fast enough |

## Local run

The folder `game/` is the whole game. Serve it as a directory (ES modules will not load from `file://`):

```bash
git clone https://github.com/404-Repo/404-game-recipe
cd 404-game-recipe && npm install
node harness/serve.mjs /path/to/emberwake/game
```

Open the URL it prints. `window.__READY__`, `window.__START__`, and per-frame `window.__GAME__` are on for the jam harness.

```bash
node harness/ship.mjs /path/to/emberwake/game --stamp
node harness/jam.mjs https://harrytheweb.github.io/emberwake/game/ --commit=<sha>
```

## Tools

Cursor (Grok 4.6) against [404-game-recipe](https://github.com/404-Repo/404-game-recipe): style lock, path B asset modules, `verify.mjs`, copied `assetlib.js` / `surfaces.js` / `rig.js`. No Atlas, no downloaded meshes.

## What I found

The book of twenty is one quadruped kit and one bird kit, stretched into different silhouettes (antlers, tusks, stilts) rather than twenty unrelated generators — that is what made the set finish. The expensive mistake was a first frame of empty mint disk and a hunter standing on the saddle; sitting the rider and dressing the near meadow did more than another animal. Hoof rumble is the gamepad actuator when a pad is there, and a procedural thud plus dust when it is not.
