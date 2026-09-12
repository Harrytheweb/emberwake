# Jam verdict

GitHub Pages could not be enabled from this token (`Resource not accessible by integration`). The gate below was run against a local serve of `game/` with the same `jam.mjs` phone / 4G / real-touch profile. Re-run on the live URL after Pages is turned on (Settings → Pages → GitHub Actions):

```
node harness/jam.mjs https://harrytheweb.github.io/emberwake/game/ --commit=<sha>
```

Paste that block, unedited, into the 404-game-jam entry PR.

Local run (this commit’s parent tree; modules stamped `?v=202609120856`):

```
=== 404 JAM VERDICT ===
url             http://127.0.0.1:8080/__game__/game/
utc             2026-09-12T08:57:24.623Z
commit          313e63dadcb4e48f576476f0f956c054b308bfc7
viewport        390x844 @3x phone, real touch, Android Chrome UA
network         4G: 4 Mbps down, 1 Mbps up, 60 ms latency, CPU 2x slower
ready           3.3 s   budget 20 s   PASS
weight          1.6 MB   budget 10 MB   PASS
started         yes (tap on #startb)
moved           12.0 m   needs 1 m   PASS
peak draws      212   budget 900   PASS
peak tris       133,018   budget 1,500,000   PASS
median fps      5.966587112168523 (software rendering, not a verdict)
errors          0   PASS
404s            0   PASS
external deps   none   cdn: cdn.jsdelivr.net
outside folder  none, every file came from the game folder
RESULT: PASS
=== END ===
```
