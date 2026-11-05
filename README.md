# ElevatorUnits

This is the public ElevatorUnits website. The extension source lives in a separate private repository and is not published here.

GitHub Pages serves the files at the root of this repository. There is no custom domain.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Landing |
| `lookup.html` | Palm Beach sample lookup |
| `pricing.html` | Price TBD, reserve button `#stripe-placeholder` |
| `dlm.html` | 2029 door lock monitoring explainer |
| `privacy.html` | Privacy policy |
| `readiness.html` | Readiness check, action `#form-placeholder` |

## Local preview

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. The same relative links also work under a project path such as `/elevatorunits-site/`.

Fonts in `fonts/` are SIL Open Font License subsets. See `fonts/LICENSE`.
