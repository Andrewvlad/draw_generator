# FS Draw Generator

Feature-rich draw generator for the competitive skydiving pool of randoms and blocks.
Points for each dive are drawn from the pool until empty, and then the pool resets (as per the rules).
The generation is perfectly random, as unique constraints do not influence the draw - rather they are checked against the draw until it passes.
Hosted [here](https://andrewvlad.github.io/draw_generator/) on GitHub.

## Options
- 4/8-way
- Number of dives & points
- Toggle between text and image preview
- Randoms and/or blocks
- Unique exits
- Unique transitions

## Features
- Instant generation
- Perfectly random (not context-aware!)
- Creating/editing dives
  - Lock edits in place (switches to simpler, context-aware random fill)
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
  - Drag to resize, or collapse
  - Drag from the left edge to reopen a collapsed drawer
  - Double-tap to reset to the default width
- Text preview is formatted such that you can select + copy from the preview directly
  - [Ctrl] + [A] also works (inputs appear selected but don't copy)
- Segmented control animation includes a slight overshoot before settling in place
- Edit mode keyboard navigation overrides harsh focus centering

## Keyboard Navigation (Edit Mode)
- [Tab] moves to the next cell
- [Shift] + [Tab] moves to the previous cell
- [Enter] moves to the next cell, also looping from the very end to the start