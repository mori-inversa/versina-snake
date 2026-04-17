# Snake

https://mori-inversa.github.io/versina-snake/

A tiny HTML5 canvas Snake game. Zero dependencies — open `index.html` in a browser.

## Run

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just `open index.html` directly.

## Controls

- Arrow keys: move
- R: restart

## Structure

- `index.html` — page shell, styles, score display
- `snake.js` — game loop, rendering, input

That's it. No build, no tests, no framework. This repo is the target for Versina tickets.
