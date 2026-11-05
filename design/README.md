# Field Ledger

Aaron picked Direction B. The live pages are the parent `site/` folder. `tokens-B.json` is the source of truth. `tokens-B.css` holds the same values as CSS variables. `../tokens.mjs` re-exports the JSON for Remotion and HyperFrames.

Directions A and C, and the original Field Ledger mock, are in `archive/`.

Contrast pairs for these tokens are in `archive/b`’s original notes and in the previous design README history. The pairs that the pages use:

| Pair | Ratio |
| --- | --- |
| `#1b1814` on `#f4efe4` | 15.42:1 |
| `#1b1814` on `#fffbf3` | 17.13:1 |
| `#1b1814` on `#f3e2d6` | 14.03:1 |
| `#3e382f` on `#f4efe4` | 10.11:1 |
| `#fffbf3` on `#9e3412` | 6.89:1 |
| `#fffbf3` on `#7c280e` | 9.39:1 |
| `#9e3412` on `#f4efe4` | 6.20:1 |
| `#6e6254` on `#f4efe4` | 5.18:1 |
| `#8a7b68` on `#f4efe4` | 3.58:1 |

Type is Fraunces and Public Sans, self-hosted. Motion is a 480ms fade and a 700ms rule draw, both once. `prefers-reduced-motion: reduce` shows the rule already drawn.
