# FS Draw Generator

Feature-rich draw generator for the competitive skydiving pool of randoms and blocks.
Points for each dive are drawn from the pool until empty, and then the pool resets (as per the rules).
The generation is perfectly random, as unique constraints do not influence the draw - rather they are checked against the draw until it passes.
Hosted [here](https://andrewvlad.github.io/draw_generator/) on GitHub.

## Options
- 4/8-way
- Number of dives & points
- Class
- Toggle between text and image preview
- Randoms and/or blocks
- Unique exits
- Unique transitions
- Pick between any diagram (image) provider

## Features
- Instant generation
- Perfectly random (not context-aware!)
- Creating/editing dives
  - Lock edits in place (switches to simpler, context-aware random fill)
  - Edits to formations that conflict with your constraints are highlighted in red (hover for explanation)
- Copy to clipboard
- Export as PDF
  - Either vertical or horizontal
- Settings auto-saved

## TODO
- [x] Unique exits
- [x] Unique transitions
- [x] Images
- [x] Different dive pools
- [ ] Different disciplines

## UX Flex
- Mobile settings drawer comes from below instead
- Settings drawer is resizable
  - Drag edge to resize, or collapse
  - Drag from the left edge to reopen a collapsed drawer
  - Double-tap to reset to the default width
  - Hovering the edge shows a grip and a hint (or a pull tab when collapsed)
- Text preview is formatted such that you can select + copy from the preview directly
  - [Ctrl] + [A] also works (inputs appear selected but don't copy)
- Segmented control animation includes a slight overshoot before settling in place
- Edit mode keyboard navigation overrides harsh focus centering
- Edit mode tool dropdown's width is responsive as to not overlap the dive list

## Keyboard Navigation (Edit Mode)
- [Tab] moves to the next cell
- [Shift] + [Tab] moves to the previous cell
- [Enter] moves to the next cell, also looping from the very end to the start