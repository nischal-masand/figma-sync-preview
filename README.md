# Multi View

A Figma plugin that previews up to four frames side by side, wrapped in device
frames, with synchronized scrolling. Figma's native preview shows one screen at
a time — this shows four, so you can compare light against dark, mobile against
tablet, or consecutive screens in a flow without switching back and forth.

## Features

- **Up to 4 panels** in a single plugin window, added from your canvas selection
- **Device frames** — Actual Size, iPhone 16 / 16 Plus / 17, iPhone 16 & 17 Pro,
  iPhone 16 & 17 Pro Max, iPad Pro 11", iPad Pro 12.9", and Android Large
- **Synced scrolling** — scroll one panel and the rest follow; toggleable
- **Light / dark theme** for the plugin UI, remembered between sessions
- **Resizable window**, clamped to a size where the toolbar stays readable
- **Live selection** — the plugin tracks what you select on the canvas and offers
  it as the next panel

## Install (development)

```bash
npm install
npm run build:plugin
```

Then in Figma: **Plugins → Development → Import plugin from manifest…** and pick
[`manifest.json`](manifest.json).

While iterating, `npm run watch:plugin` rebuilds on save. Re-run the plugin in
Figma to pick up a new build.

## How it works

`plugin/code.ts` runs in Figma's sandbox: it enumerates frames on the current
page, exports the ones you pick with `exportAsync` as base64 PNGs at 2× scale,
and relays selection changes. The React UI in `src/plugin-ui/` renders those
PNGs inside CSS device bezels and wires the panels' scroll positions together.
The two halves talk over `postMessage` using the union types in
[`src/plugin-ui/types.ts`](src/plugin-ui/types.ts), which is also where the
device presets live.

The build is a single esbuild pass ([`esbuild.config.mjs`](esbuild.config.mjs)):
the plugin controller compiles to `dist/code.js`, and the UI bundle plus
Tailwind output are inlined into a self-contained `dist/ui.html` — Figma plugin
UIs are one HTML file with no external requests, which is also why
`networkAccess` in the manifest is set to `none`.

## Layout

```
plugin/code.ts        Figma sandbox controller — exports, selection, resize
src/plugin-ui/        React UI (App, components, device presets)
src/styles/           Tailwind entry and theme tokens
esbuild.config.mjs    Build → dist/code.js + dist/ui.html
manifest.json         Figma plugin manifest
dist/                 Built output, committed so a clone runs as-is
```

`community-listing.md` and `video-script.md` are drafts for the Figma Community
submission, not part of the plugin.

Built for #ConfigMakeathon.
