# CALIX
> A scientific calculator built with pure HTML, CSS & JS — no libraries, no frameworks, zero dependencies.



## About

CALIX is a scientific calculator built with pure HTML, CSS & JS. It features a 3D door entry, electric violet UI, animated background, BASIC & SCI modes with 18 functions including trig, log, powers, factorial, π and e. Mobile responsive, keyboard support and DevTools protected.

---

## Features

- 🚪 **3D Door Entry** — knock to open, door swings with CSS perspective animation
- 🎨 **Electric Violet UI** — obsidian background with animated grid, orbs and particles
- 🧮 **BASIC & SCI Modes** — toggle between standard and scientific layout
- 🔬 **18 Scientific Functions** — sin, cos, tan, log, ln, √, x², x³, xʸ, 1/x, |x|, n!, π, e, ⌊x⌋, ⌈x⌉, ( )
- 📐 **DEG / RAD Toggle** — switch angle units for trigonometry
- 👁️ **Live Preview** — shows approximate result as you type
- 📱 **Mobile Responsive** — fluid sizing with `clamp()` down to 320px
- ⌨️ **Keyboard Support** — full keyboard input including shortcuts
- 🔒 **DevTools Protection** — blocks right-click, F12, Ctrl+U and inspect shortcuts

---

## File Structure

```
calix/
├── calix.html      → Structure
├── calix.css       → Styles & animations
├── calix.js        → Logic & protection
└── README.md
```

> All three files must be in the **same folder**.

---

## Usage

Simply open `calix.html` in any browser — no installation or build step required.

```bash
# Or serve locally
npx serve .
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Equals |
| `Backspace` | Delete |
| `Escape` | Clear all |
| `s` `c` `t` | sin cos tan |
| `l` `r` `p` | log √ π |

---

## License

MIT — free to use, modify and distribute.
