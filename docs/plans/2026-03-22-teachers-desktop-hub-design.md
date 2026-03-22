# Teacher's Desktop Hub Design
**Date:** 2026-03-22
**Status:** Approved

## Overview
A "Teacher's Desktop Hub" that acts as a full-screen, frameless, solid-surface replacement for the native OS desktop, built using Electron and React.

## Architecture & Structure
**Single-Window React App:**
- One full-screen `BrowserWindow` acts as the master desktop surface.
- The UI captures all mouse events, sitting above the native OS background but acting as the user's new interactive workspace layer.

**Project Structure:**
- `electron/`
  - `main.js`: Main Electron process (handles window lifecycle, IPC, and positioning).
  - `preload.js`: Context Bridge allowing secure fs read/write.
- `src/`
  - `components/`: Glassmorphism React widgets (Dock, Schedule, ToDo, Scratchpad).
  - `context/`: Loads persistent state.
  - `App.jsx`: Master absolute-positioned workspace wrapper.
- `data.json`: Local storage file for widget state.

## Electron Configuration Details
- `frame: false`: No titlebar.
- `fullscreen: true` or `kiosk: true`: Ensures total screen coverage.
- `skipTaskbar: true`: Hides the Electron app from OS taskbars.
- `type: 'desktop'` (or using `win.moveBottom()` hooks): Ensures it stays at the lowest z-index possible behind interacting windows if possible.
- **IPC**: Handlers in `main.js` to parse and save `data.json` based on React widget updates.
