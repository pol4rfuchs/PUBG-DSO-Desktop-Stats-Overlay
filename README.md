<div align="center">

```
██████╗ ██╗   ██╗██████╗  ██████╗      ██████╗ ██╗   ██╗██╗
██╔══██╗██║   ██║██╔══██╗██╔════╝     ██╔═══██╗██║   ██║██║
██████╔╝██║   ██║██████╔╝██║  ███╗    ██║   ██║██║   ██║██║
██╔═══╝ ██║   ██║██╔══██╗██║   ██║    ██║   ██║╚██╗ ██╔╝██║
██║     ╚██████╔╝██████╔╝╚██████╔╝    ╚██████╔╝ ╚████╔╝ ███████╗
╚═╝      ╚═════╝ ╚═════╝  ╚═════╝      ╚═════╝   ╚═══╝  ╚══════╝
```

**DESKTOP STATS OVERLAY**

[![Download](https://img.shields.io/badge/⬇_DOWNLOAD-LATEST_RELEASE-e0a220?style=for-the-badge&labelColor=0c0d0a&color=e0a220)](../../releases)
[![Platform](https://img.shields.io/badge/WINDOWS-x64_ONLY-0a1628?style=for-the-badge&labelColor=0c0d0a)](../../releases)
[![Electron](https://img.shields.io/badge/ELECTRON-v31-47848F?style=for-the-badge&labelColor=0c0d0a)](https://electronjs.org)
[![API](https://img.shields.io/badge/PUBG-OFFICIAL_API-e0a220?style=for-the-badge&labelColor=0c0d0a)](https://developer.pubg.com)
[![License](https://img.shields.io/badge/LICENSE-MIT-555?style=for-the-badge&labelColor=0c0d0a)](LICENSE)

</div>

---

<div align="center">

`🇬🇧` **[ENGLISH](#-english)** &nbsp;·&nbsp; `🇦🇹` **[DEUTSCH](#-deutsch)**

</div>

---

<br>

## 🇬🇧 ENGLISH

<table><tr><td>

> **PUBG/OVL** is a lightweight native desktop application for displaying your PUBG stats in real time.  
> No browser tab, no memory overhead — just your stats, always available.

</td></tr></table>

<br>

### ◈ FEATURES

```
┌─────────────────────────────────────────────────────────────────┐
│  SEASON STATS   │  K/D · Wins · Kills · Avg DMG · Top 10%      │
│                 │  Headshots · Assists · Distance · Longest Kill │
├─────────────────────────────────────────────────────────────────┤
│  LAST 3 MATCHES │  Placement · Kills · DMG · Assists · Survival  │
│                 │  Headshots · Knocks · Map · Date · Duration    │
├─────────────────────────────────────────────────────────────────┤
│  LIFETIME       │  Longest Kill Ever · Max DMG/Match             │
│  BEST-OF        │  Kill Streak Record · Longest Survival         │
│                 │  Total HS · Total Kills/Wins/Matches/Distance  │
├─────────────────────────────────────────────────────────────────┤
│  OVERLAY MODE   │  Compact always-on-top widget · bottom-right   │
│                 │  Perfect for gaming or streaming               │
├─────────────────────────────────────────────────────────────────┤
│  SYSTEM TRAY    │  Closes to tray · minimal RAM · no clutter     │
│  AUTO-REFRESH   │  Updates stats every 3 minutes automatically   │
└─────────────────────────────────────────────────────────────────┘
```

<br>

### ◈ DOWNLOAD & INSTALL

> **No installer. No setup wizard. No admin rights needed.**

1. Go to [**Releases**](../../releases)
2. Download `pubg-overlay-win32-x64.zip`
3. Unzip anywhere you like (e.g. `C:\Tools\pubg-overlay\`)
4. Run `pubg-overlay.exe`

<br>

### ◈ API KEY

You need a **free** PUBG Developer API Key — takes about 2 minutes.

| Step | Action |
|------|--------|
| **1** | Visit [developer.pubg.com](https://developer.pubg.com) |
| **2** | Sign in or create an account |
| **3** | Click **Register an App** |
| **4** | Enter any description · give it a name · leave URL blank |
| **5** | Copy the API Key that appears immediately |

<br>

### ◈ SETUP

```
1. Launch pubg-overlay.exe
2. Click the  ⚙ Config  tab
3. Paste your API Key
4. Enter your player name  (e.g. Wuest3nFuchs)
5. Select your platform    (Steam for PC)
6. Click  ▶ Save & Load Stats
```

<br>

### ◈ OVERLAY MODE

Click **⧉** in the title bar to activate overlay mode:

- Always on top of all other windows including games
- Compact widget docked to the bottom-right corner
- Shows current season stats at a glance
- Click **⧉** again to return to full window

> **OBS Users:** Add a **Window Capture** source and select `pubg-overlay.exe`

<br>

### ◈ SUPPORTED PLATFORMS

| Platform | API Value |
|----------|-----------|
| Steam (PC) | `steam` |
| Xbox | `xbox` |
| PlayStation | `psn` |
| Kakao (KR) | `kakao` |

All Squad / Duo / Solo modes and their FPP variants are supported.

<br>

### ◈ BUILD FROM SOURCE

**Requirement:** [Node.js LTS](https://nodejs.org) must be installed.

```bash
git clone https://codeberg.org/wuest3nfuchs/pubg-overlay.git
cd pubg-overlay
build.bat
```

Output: `dist\pubg-overlay-win32-x64\pubg-overlay.exe`

<br>

### ◈ TECH STACK

| Component | Details |
|-----------|---------|
| Runtime | Electron v31 |
| Packager | electron-packager |
| API | PUBG Official API v2 |
| Font | Barlow Condensed (Google Fonts) |
| Storage | localStorage (no server, no account) |

<br>

### ◈ LICENSE

MIT — use it, fork it, modify it, do whatever you want.

---
---

<br>

## 🇦🇹 DEUTSCH

<table><tr><td>

> **PUBG/OVL** ist eine schlanke native Desktop-App zur Anzeige deiner PUBG-Stats in Echtzeit.  
> Kein Browser-Tab, kein RAM-Overhead — nur deine Stats, immer verfügbar.

</td></tr></table>

<br>

### ◈ FEATURES

```
┌─────────────────────────────────────────────────────────────────┐
│  SEASON STATS   │  K/D · Wins · Kills · Ø DMG · Top 10%        │
│                 │  Headshots · Assists · Distanz · Längst. Kill  │
├─────────────────────────────────────────────────────────────────┤
│  LETZTE 3       │  Platzierung · Kills · DMG · Assists · Zeit   │
│  MATCHES        │  Headshots · Knocks · Map · Datum · Dauer     │
├─────────────────────────────────────────────────────────────────┤
│  LIFETIME       │  Längster Kill Ever · Max DMG/Match            │
│  BEST-OF        │  Kill Streak Rekord · Längste Überlebenszeit   │
│                 │  Ges. HS · Ges. Kills/Wins/Matches/Distanz    │
├─────────────────────────────────────────────────────────────────┤
│  OVERLAY-MODUS  │  Kompaktes Always-on-top Widget · rechts unten │
│                 │  Perfekt zum Spielen oder Streamen             │
├─────────────────────────────────────────────────────────────────┤
│  SYSTEM-TRAY    │  Schließt in Tray · minimaler RAM · kein Müll  │
│  AUTO-REFRESH   │  Aktualisiert Stats alle 3 Minuten             │
└─────────────────────────────────────────────────────────────────┘
```

<br>

### ◈ DOWNLOAD & INSTALLATION

> **Kein Installer. Kein Setup-Assistent. Keine Admin-Rechte nötig.**

1. [**Releases**](../../releases) aufrufen
2. `pubg-overlay-win32-x64.zip` herunterladen
3. Irgendwo entpacken (z.B. `C:\Tools\pubg-overlay\`)
4. `pubg-overlay.exe` starten

<br>

### ◈ API KEY

Du brauchst einen **kostenlosen** PUBG Developer API Key — dauert ca. 2 Minuten.

| Schritt | Aktion |
|---------|--------|
| **1** | [developer.pubg.com](https://developer.pubg.com) aufrufen |
| **2** | Einloggen oder Account erstellen |
| **3** | **Register an App** klicken |
| **4** | Beschreibung eingeben · Name vergeben · URL leer lassen |
| **5** | Den sofort angezeigten API Key kopieren |

<br>

### ◈ EINRICHTUNG

```
1. pubg-overlay.exe starten
2. Tab  ⚙ Config  öffnen
3. API Key einfügen
4. Spielernamen eingeben  (z.B. Wuest3nFuchs)
5. Plattform wählen       (Steam für PC)
6. ▶ Save & Load Stats  klicken
```

<br>

### ◈ OVERLAY-MODUS

**⧉** in der Titelleiste klicken um den Overlay-Modus zu aktivieren:

- Immer im Vordergrund — auch über dem Spiel
- Kompaktes Widget rechts unten
- Zeigt die aktuellen Season-Stats auf einen Blick
- Nochmal **⧉** klicken um zum Vollbild zurückzukehren

> **OBS:** Fensteraufnahme-Quelle hinzufügen und `pubg-overlay.exe` auswählen

<br>

### ◈ UNTERSTÜTZTE PLATTFORMEN

| Plattform | API-Wert |
|-----------|----------|
| Steam (PC) | `steam` |
| Xbox | `xbox` |
| PlayStation | `psn` |
| Kakao (KR) | `kakao` |

Alle Squad / Duo / Solo Modi inklusive FPP-Varianten werden unterstützt.

<br>

### ◈ AUS QUELLCODE BAUEN

**Voraussetzung:** [Node.js LTS](https://nodejs.org) muss installiert sein.

```bash
git clone https://codeberg.org/wuest3nfuchs/pubg-overlay.git
cd pubg-overlay
build.bat
```

Ausgabe: `dist\pubg-overlay-win32-x64\pubg-overlay.exe`

<br>

### ◈ TECH STACK

| Komponente | Details |
|------------|---------|
| Runtime | Electron v31 |
| Packager | electron-packager |
| API | PUBG Official API v2 |
| Font | Barlow Condensed (Google Fonts) |
| Speicher | localStorage (kein Server, kein Account) |

<br>

### ◈ LIZENZ

MIT — benutzen, forken, ändern, mach was du willst.

---

<div align="center">
<br>

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

Built by [**wuest3nfuchs**](https://codeberg.org/wuest3nfuchs) &nbsp;·&nbsp; Uses the official PUBG API &nbsp;·&nbsp; Not affiliated with PUBG Corporation

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

</div>
