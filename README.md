# PUBG/OVL — Desktop Stats Overlay

> 🌐 [English](#english) · 📄 [Deutsch](#deutsch)

---

<div align="center">

![PUBG Overlay](https://img.shields.io/badge/PUBG-Overlay-e0a220?style=for-the-badge&labelColor=0c0d0a)
![Platform](https://img.shields.io/badge/Platform-Windows%20x64-blue?style=for-the-badge&labelColor=0c0d0a)
![Electron](https://img.shields.io/badge/Electron-31-47848F?style=for-the-badge&labelColor=0c0d0a)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&labelColor=0c0d0a)

</div>

---

## English

A lightweight desktop application for displaying your PUBG stats — no browser required. Built with Electron, uses the official PUBG API.

### Features

- **Season Stats** — K/D, Wins, Kills, Avg. Damage, Top 10%, Headshots, Assists, Distance, Longest Kill — per game mode (Squad / Duo / Solo + FPP variants)
- **Last 3 Matches** — Placement, Kills, Damage, Assists, Survival Time, Headshots, Knocks, Map, Date
- **Lifetime Best-Of** — Longest Kill ever, Max Damage in a Match, Kill Streak Record, Longest Survival, Total Headshots, Total Kills/Wins/Matches/Distance
- **Overlay Mode** — compact always-on-top widget, sits in the bottom-right corner while you game
- **System Tray** — closes to tray, no taskbar clutter, minimal RAM usage
- **Auto-Refresh** every 3 minutes

### Download

Head to the [**Releases**](../../releases) page and download the latest `pubg-overlay-win32-x64.zip`.  
Unpack it anywhere and run `pubg-overlay.exe` — no installer needed.

### Getting your API Key

1. Go to [developer.pubg.com](https://developer.pubg.com)
2. Sign in / Register
3. Click **Register an App**
4. Fill in a short description (e.g. *"Personal local stats overlay for private use"*), give it a name, leave URL blank
5. Your API Key appears immediately — copy it

### Setup

1. Launch `pubg-overlay.exe`
2. Click the **⚙ Config** tab
3. Paste your API Key, enter your player name, select platform (`Steam` for PC)
4. Click **Save & Load Stats**

### Building from Source

**Requirements:** [Node.js LTS](https://nodejs.org)

```bash
# Clone the repo
git clone https://codeberg.org/wuest3nfuchs/pubg-overlay.git
cd pubg-overlay

# Run the build script (Windows)
build.bat
```

The portable EXE will be created in `dist\pubg-overlay-win32-x64\`.

### Overlay Mode (OBS / Gaming)

Click the **⧉** button in the title bar to switch to compact overlay mode:
- Always on top of all other windows
- Minimized to a small widget in the bottom-right corner
- Shows Season Stats for your current mode at a glance

For OBS, add a **Window Capture** source and select `pubg-overlay.exe`.

### Supported Platforms

| Platform | Value |
|----------|-------|
| Steam (PC) | `steam` |
| Xbox | `xbox` |
| PlayStation | `psn` |
| Kakao (KR) | `kakao` |

### Tech Stack

- [Electron](https://electronjs.org) v31
- [electron-packager](https://github.com/electron/packager)
- [PUBG Official API](https://developer.pubg.com)
- Barlow Condensed (Google Fonts)

### License

MIT — do whatever you want with it.

---

## Deutsch

Eine schlanke Desktop-Anwendung zur Anzeige deiner PUBG-Stats — kein Browser nötig. Gebaut mit Electron, nutzt die offizielle PUBG API.

### Features

- **Season Stats** — K/D, Wins, Kills, Ø Damage, Top 10%, Headshots, Assists, Distanz, Längster Kill — pro Spielmodus (Squad / Duo / Solo + FPP-Varianten)
- **Letzte 3 Matches** — Platzierung, Kills, Damage, Assists, Überlebenszeit, Headshots, Knocks, Map, Datum
- **Lifetime Best-Of** — Längster Kill ever, Max Damage in einem Match, Kill Streak Rekord, Längste Überlebenszeit, Gesamt-Headshots, Gesamt Kills/Wins/Matches/Distanz
- **Overlay-Modus** — kompaktes Widget immer im Vordergrund, rechts unten — zum Spielen nebenbei
- **System-Tray** — schließt in den Tray, kein Taskleisten-Clutter, minimaler RAM-Verbrauch
- **Auto-Refresh** alle 3 Minuten

### Download

Auf der [**Releases**](../../releases)-Seite die neueste `pubg-overlay-win32-x64.zip` herunterladen.  
Irgendwo entpacken, `pubg-overlay.exe` starten — kein Installer nötig.

### API Key holen

1. Auf [developer.pubg.com](https://developer.pubg.com) gehen
2. Einloggen / Registrieren
3. **Register an App** klicken
4. Kurze Beschreibung eingeben (z.B. *"Personal local stats overlay for private use"*), Name vergeben, URL leer lassen
5. Der API Key erscheint sofort — kopieren

### Einrichtung

1. `pubg-overlay.exe` starten
2. Tab **⚙ Config** öffnen
3. API Key einfügen, Spielername eingeben, Plattform wählen (`Steam` für PC)
4. **Save & Load Stats** klicken

### Aus dem Quellcode bauen

**Voraussetzung:** [Node.js LTS](https://nodejs.org)

```bash
# Repo klonen
git clone https://codeberg.org/wuest3nfuchs/pubg-overlay.git
cd pubg-overlay

# Build-Skript ausführen (Windows)
build.bat
```

Die portable EXE liegt danach in `dist\pubg-overlay-win32-x64\`.

### Overlay-Modus (OBS / Gaming)

Den **⧉** Button in der Titelleiste klicken um in den kompakten Overlay-Modus zu wechseln:
- Immer im Vordergrund über allen anderen Fenstern
- Kleines Widget rechts unten
- Zeigt die Season-Stats für den aktuellen Modus auf einen Blick

Für OBS: **Fensteraufnahme**-Quelle hinzufügen und `pubg-overlay.exe` auswählen.

### Unterstützte Plattformen

| Plattform | Wert |
|-----------|------|
| Steam (PC) | `steam` |
| Xbox | `xbox` |
| PlayStation | `psn` |
| Kakao (KR) | `kakao` |

### Tech Stack

- [Electron](https://electronjs.org) v31
- [electron-packager](https://github.com/electron/packager)
- [PUBG Official API](https://developer.pubg.com)
- Barlow Condensed (Google Fonts)

### Lizenz

MIT — mach damit was du willst.

---

<div align="center">
<sub>Built by <a href="https://codeberg.org/wuest3nfuchs">wuest3nfuchs</a> · Uses the official PUBG API · Not affiliated with PUBG Corporation</sub>
</div>
