# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Fixed reflected-content injection: PUBG API error bodies were inserted into the DOM via `innerHTML`/`outerHTML` without escaping; now escaped, and map/mode strings from the API are escaped defensively as well.
- API key is no longer stored in renderer `localStorage`. Config is now persisted by the main process via Electron `safeStorage` (OS keychain-backed encryption at rest).
- Tightened Content-Security-Policy: removed `'unsafe-inline'` from `script-src` (all inline `onclick=""` handlers moved to `addEventListener` in an external `app.js`); added `object-src 'none'` and `base-uri 'none'`.
- Added `setWindowOpenHandler` and a `will-navigate` guard in the main process: all external links now open in the OS default browser (https only), never inside an Electron window. Previously, links had no handler and likely failed to open at all.
- Enabled renderer sandboxing (`sandbox: true`).

### Added
- Automatic update check on startup: compares the running version against the latest GitHub Release and shows an in-app banner with a link to download it. No auto-install — the app never downloads or replaces itself.
- `assets/icon.ico` (was referenced by `main.js` but missing from the repo, so the app ran without a window icon).

### Changed
- Renderer script split out of `index.html` into `src/app.js`.

## [1.0.0] - 2026-05-24

### Added
- Initial release of PUBG/DSO Desktop Stats Overlay
- Season stats view (K/D, Wins, Kills, Avg DMG, Top 10%, Headshots, Assists, Distance, Longest Kill)
- Last 3 matches view (Placement, Kills, DMG, Assists, Survival, Headshots, Knocks, Map, Date, Duration)
- Lifetime best-of stats (Longest Kill Ever, Max DMG/Match, Kill Streak Record, Longest Survival, Totals)
- Compact always-on-top overlay mode
- Windows x64 build via electron-packager

[Unreleased]: https://github.com/Pol4rFuchs/PUBG-DSO-Desktop-Stats-Overlay/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Pol4rFuchs/PUBG-DSO-Desktop-Stats-Overlay/releases/tag/v1.0.0
