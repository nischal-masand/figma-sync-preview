# Figma Preview — Makeathon Submission Video Script

**Duration:** ~24 sec (room for ~4s slack)
**Format:** 9:16 vertical, 1080×1920, 60fps
**Style:** Screen recording only, no face. On-screen text + music. No voiceover.

---

## Recording approach (read first — affects everything)

**Record at 16:9 in 4K (3840×2160) at 60fps.** Then crop to 9:16 in your editor. This lets you:
- Pan within the recorded frame in post (like Ken Burns) without re-recording
- Push in / pull out smoothly without quality loss
- Reframe a shot if it doesn't work, without re-shooting

**Cursor:** Use a cursor highlighter. Mac: *Cursor Highlighter* or *Mouseposé*. Win: *Croncat* or *Cursor Highlighter*. Settings:
- Size: 1.5–2× default
- Highlight: soft yellow ring, ~60% opacity
- Click animation: ripple on click

**Editor:** CapCut (fastest), DaVinci Resolve (free, more control), or Premiere. CapCut is fine for this — built for vertical social cuts.

**Type system (keep consistent across all overlays):**
- Font: Inter or SF Pro, weight 700–800
- Color: white #FFFFFF with subtle drop shadow (4px blur, 50% opacity, +2 Y offset)
- Size: 60–80px for hero lines, 36–44px for sub-lines
- Position: bottom-third by default (avoids UI obstruction)
- Animation: fade-in over 0.15s with 4px upward slide

---

## SHOT 1 — The problem  ·  [0:00 – 0:06]  ·  6s

**The setup you're filming:**
A Figma file containing **four variants of the same screen**, arranged in a 2×2 grid:
- Top-left: mobile, light mode
- Top-right: mobile, dark mode
- Bottom-left: desktop, light mode
- Bottom-right: desktop, dark mode

The viewer should immediately read this as "the same screen, four versions." Use any UI (settings, dashboard, login).

**Framing & zoom:**
- Open on a wide-ish shot showing the **2×2 grid** so the viewer registers the problem space ("there are 4 of these to check")
- Then push in on whichever frame the cursor is previewing — pull back to grid between previews
- This in/out rhythm mirrors the manual checking dance
- For 9:16: crop vertically so the grid fits, with each frame previewed filling the screen during its moment

**Micro-beat timeline:**

| Time | Action | Cursor | Text overlay |
|------|--------|--------|--------------|
| 0:00–0:01 | Wide on the 2×2 grid. Establish "four versions." Cursor enters from edge. | Visible | *Figma preview: one screen at a time.* (fades in 0:00) |
| 0:01–0:02 | Push in on **mobile light**. Open preview (Shift+Space). Scroll down. | Click ripple | (line 1 still holding) |
| 0:02–0:03 | Close (Esc). Pull back to grid. Click **mobile dark**. Open preview. Scroll. | Quick | Line 1 fades; *Light, dark...* (fades in 0:02) |
| 0:03–0:04 | Close. Pull back. Click **desktop light**. Open preview. Scroll. | Quick | *...mobile, desktop...* (replaces previous, 0:03) |
| 0:04–0:05 | Close. Pull back. Click **desktop dark**. Open preview. Scroll. | Quick | *...one at a time.* (replaces previous, 0:04) |
| 0:05–0:06 | **Hold.** Pull all the way back to the grid. Cursor stalls. The "wait, what did the top section look like across all four?" beat. | Frozen | *Hope you remember what you just saw.* (fades in 0:05) |

**Sound:**
- Music in soft at 0:00
- UI click sounds on each open/close (subtle, ~30% volume) — they should build up rhythmically, almost percussive, communicating "this is repetitive"
- Tiny silence on the 0:05 beat — music dips for ~0.4s before shot 2

**Transition out:** Hard cut.

---

## SHOT 2 — Figma design file  ·  [0:06 – 0:09]  ·  3s

**The setup you're filming:**
A Figma file with **3 mock screens** of the plugin UI laid out left-to-right on the canvas:
- Frame 1: Plugin toolbar (frame selector, theme toggle, scroll sync toggle)
- Frame 2: Empty state (the welcome screen)
- Frame 3: 4-panel preview view (the hero state)

Quality: clean, mid-fidelity. Use real component sketches, not Lorem Ipsum boxes. Doesn't need to be production-polished — judges should believe a designer made this in Figma.

**Framing & zoom:**
- Open medium-wide. Frame 1 fills ~70% of the vertical at start
- Slow **horizontal pan** left → right across all 3 frames (~8% camera movement over 3s)
- Tiny push-in (3%) on the final frame to land softly
- Calm, reverent pace — direct contrast with shot 1's frantic open/close rhythm

**Cursor:** Hidden or parked off-frame. This is a "look at the design" shot, not an interaction shot.

**Micro-beat timeline:**

| Time | Action | Cursor | Text overlay |
|------|--------|--------|--------------|
| 0:06.0–0:06.3 | Cross-dissolve in from shot 1's 2×2 grid. Land on a wide shot of the Figma file with the 3 plugin mocks visible. | Hidden | — |
| 0:06.3–0:07.0 | Camera starts slow left-to-right pan. Frame 1 (toolbar) anchors. | Hidden | *Designed in Figma.* (fades in at 0:06.5, top-center, holds) |
| 0:07.0–0:08.0 | Pan continues. Frame 2 (empty state) drifts into center. | Hidden | Text holds |
| 0:08.0–0:09.0 | Pan settles on Frame 3 (4-panel hero view). Tiny push-in (3%) to land the shot. | Hidden | Text holds, then fades out at 0:08.8 |

**Sound:** Music continues at the same level as shot 1's end. **No UI sounds** — the silence after shot 1's clicking is part of the contrast.

**Transition out:** Cross-dissolve, 0.2s into shot 3 (signals "design → and then we built it").

---

## SHOT 3 — MCP → Claude  ·  [0:09 – 0:13]  ·  4s

**The setup you're filming:**
Claude (or Cursor) with Figma MCP wired up. You prompt something concrete and visible, like:
> *"Read the toolbar design from my Figma file and update the plugin's spacing to match."*

Claude makes an MCP call to read the Figma file, then streams a code change. The plugin UI in Figma updates to reflect it.

**What needs to be visible on screen (must-haves):**
- The MCP tool call line (e.g., `figma.get_file(...)` or whatever your client shows) — this is the "novel workflow" proof
- 3–4 lines of generated code streaming
- The plugin UI updating in response

**Framing & zoom — stacked split for 9:16:**
- **Top half (0–50% of vertical):** Claude/Cursor window, cropped tight on the MCP call line and the streaming code
- **Bottom half (50–100% of vertical):** Plugin UI in Figma, cropped tight on the toolbar
- A thin horizontal divider line between halves keeps it cleanly two-channel
- Subtle push-in (5%) on the code area during streaming

**Cursor:** Visible in the top half only, where Claude is being prompted. Hidden in the bottom half (no human touched the plugin — the code change updated it).

**Micro-beat timeline:**

| Time | Action | Cursor | Text overlay |
|------|--------|--------|--------------|
| 0:09.0–0:09.5 | Hard cut from shot 2's dissolve into the stacked split. Top: Claude window with prompt typed. Bottom: plugin UI sitting idle. | Visible on top half | *Built with Claude + Figma MCP.* (fades in at 0:09, bottom-third, holds) |
| 0:09.5–0:10.0 | Claude makes the MCP call. **A yellow ring pulses once on the `figma.get_file(...)` line** to draw the eye. | Top half, near MCP line | Text holds |
| 0:10.0–0:12.0 | Code streams in on top half (speed-ramp 1.5–2× so more code is visible). Bottom half: the plugin's toolbar **animates the change in sync** — spacing tightens, a color tweaks. | Hidden | Text holds |
| 0:12.0–0:12.5 | Streaming stops. Brief beat: code on top, updated UI on bottom — both held still for a half second so the connection lands. | Hidden | Text holds |
| 0:12.5–0:13.0 | Quick before/after wipe on the bottom half (left side: old toolbar, right side: new toolbar) to emphasize the change. | Hidden | Text fades out at 0:12.8 |

**Sound:**
- Soft keyboard typing layered under from 0:09.0 to 0:10.0 (the prompt + MCP call moment)
- A subtle "ping" or chime at 0:09.7 when the MCP call returns (the "Figma file was read" moment)
- Music lifts ~10% at 0:10.0 as the code streams — building anticipation toward shot 4

**Transition out:** Hard cut.

---

## SHOT 4 — Plugin demo (THE MONEY SHOT)  ·  [0:13 – 0:19]  ·  6s

**The setup you're filming:**
Plugin open in Figma. Have 4 frames ready in your file: light mode, dark mode, iPad version, Desktop version.

**Framing & zoom — this is the most important framing in the video:**
- **Start tight.** Camera framed on just the plugin's empty state + the first panel area. Roughly 50% of plugin UI visible.
- **Pull back with each click.** As each panel appears, your edit pulls the camera out so the new panel fits. Four pull-backs total.
- **End wide.** Final framing shows all 4 panels comfortably with ~10% margin.

Practically: this is 5 keyframes in your editor's scale/position transform. Start at scale 1.4×, end at scale 1.0×, with eased steps at each click.

**Micro-beat timeline:**

| Time | Action | Scale | Cursor |
|------|--------|-------|--------|
| 0:13–0:14 | Click → **mobile light** panel snaps in | 1.4× → 1.3× | Big highlight, click ripple |
| 0:14–0:15 | Click → **mobile dark** panel snaps in (← callback to shot 1) | 1.3× → 1.2× | Click ripple |
| 0:15–0:16 | Click → **desktop light** panel snaps in | 1.2× → 1.1× | Click ripple |
| 0:16–0:17 | Click → **desktop dark** panel snaps in. All 4 now visible — directly answers the grid from shot 1. | 1.1× → 1.0× | Click ripple |
| 0:17–0:19 | **Scroll once on any panel.** All four sync in unison. Slow scroll for ~2s so the magic registers. | 1.0× (hold) | Scroll gesture visible |

**Text overlay:**
- *One scroll. Every screen.*
- Appears at **0:17** (the moment scrolling starts — text and magic land together)
- Slides up from bottom, holds 2s

**Sound:**
- 4 satisfying "click" sounds, one per panel (slightly pitched up each time for momentum)
- Music peaks at 0:17
- Soft "whoosh" or wind sound on the synced scroll

**Transition out:** Hard cut to shot 5.

---

## SHOT 5 — Dark mode flip  ·  [0:19 – 0:21]  ·  2s

**The setup you're filming:**
Same 4-panel view from shot 4. Cursor moves to the theme toggle in the plugin toolbar and clicks.

**Framing & zoom:**
- Zoom in ~15% on the theme toggle button for the first 0:01 — make the click obvious
- On click, snap back to the wider 4-panel view to show the inversion across all panels at once

**Action:**

| Time | Action |
|------|--------|
| 0:19–0:19.5 | Cursor moves to dark mode toggle (zoomed in) |
| 0:19.5–0:20 | Click. Camera snaps to wide as UI inverts. |
| 0:20–0:21 | Hold on the dark version. All 4 panels in dark mode, still synced if you can fake a tiny scroll. |

**No text overlay.** Let the visual carry it.

**Sound:** One soft "whoosh" on the flip. Music continuing.

**Transition out:** Hard cut.

---

## SHOT 6 — Outro  ·  [0:21 – 0:24]  ·  3s

**The setup you're filming:**
Not a recording — design this as a static end card in Figma (or even in CapCut). Plain background, plugin logo, CTA, tags.

**Framing & zoom:**
- Full-frame static graphic
- Optional: very subtle zoom-out (3–4%) over the 3s for closure

**Layout (centered, vertically stacked):**

```
            [ Plugin icon ]

           Figma Preview        ← 80px, bold

   Live on Figma Community →    ← 44px, medium

      #ConfigMakeathon @figma   ← 32px, regular
```

**Animation:**
- Icon fades in at 0:21 (0.2s)
- "Figma Preview" fades in + slides up at 0:21.3 (0.2s)
- CTA fades in at 0:21.7
- Tags fade in at 0:22
- All hold from 0:23 to 0:24

**Sound:** Music tails out across last 1.5s.

**Transition out:** End of video.

---

## Recording order (easiest → hardest)

1. **Shot 4** + **Shot 5** — same setup, do them back-to-back
2. **Shot 1** — quick to fake with any Figma file
3. **Shot 6** — static graphic, no recording
4. **Shot 2** — make 2–3 quick mocks of plugin UI in Figma (~30 min)
5. **Shot 3** — wire MCP once, prompt Claude, record. Most setup time but only one take needed.

---

## Common pitfalls to avoid

- **Cursor too small** — defaults look invisible at 1080×1920. Bump to 1.5–2× and highlight it.
- **Recording at 30fps** — the synced scroll in shot 4 looks janky. 60fps minimum.
- **Plain Figma file in shot 1** — make sure your light/dark frames are clearly *different* in content visible above the fold. The compare-pain only lands if the difference is obvious.
- **Text overlay covering the cursor** — your overlays should sit in dead zones, never on top of the action.
- **Dead first second** — never open on an empty canvas. Pre-load the Figma frame so frame 1 already shows the design.
- **Music too loud under text moments** — text needs silence to breathe. Sidechain or just dip the music 30% during text overlays.

---

## Social caption

> Built **Figma Preview** for #ConfigMakeathon — Figma's native preview only shows one screen at a time. This plugin shows up to 4, with synced scrolling. Light vs dark, mobile vs desktop, side by side.
>
> Designed in Figma. Built with Claude + Figma MCP.
>
> Try it on Figma Community → [link]
>
> @figma #ConfigMakeathon
