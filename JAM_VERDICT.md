# Jam verdict

Live gate against the GitHub Pages play URL. Block unedited from `harness/jam.mjs`.

```
=== 404 JAM VERDICT ===
url             https://harrytheweb.github.io/emberwake/game/
utc             2026-09-12T09:23:21.123Z
commit          6c96743da82dfb8a856ccade7a43a6044598bac5
viewport        390x844 @3x phone, real touch, Android Chrome UA
network         4G: 4 Mbps down, 1 Mbps up, 60 ms latency, CPU 2x slower
ready           3.8 s   budget 20 s   PASS
weight          1.6 MB   budget 10 MB   PASS
started         yes (tap on #startb)
moved           13.8 m   needs 1 m   PASS
peak draws      209   budget 900   PASS
peak tris       132,306   budget 1,500,000   PASS
median fps      7.710100235554891 (software rendering, not a verdict)
errors          0   PASS
404s            0   PASS
external deps   none   cdn: cdn.jsdelivr.net
outside folder  none, every file came from the game folder
RESULT: PASS
=== END ===
```

The pastoral look pass after this block is a `game/` change at the same play URL. Re-run the live gate once Pages has the new `main` sha.
