# TeamDraw – Bauplan

## 1. Überblick

### Kurzbeschreibung des Projekts

TeamDraw ist ein grafisch spektakuläres Auslosungstool für Fußballteams (U13/C-Jugend). Die Anwendung bietet einen Show-Modus mit Animationen (Türen, Nebel, Name-Reveal), eine faire Verteilung nach Spielstärke und soll später um einen Editor für Spieler/Teams/Branding sowie PWA-App-Funktionalität erweitert werden.

### Technische Basis

- **Basis**: React + Vite
- **Aktueller Stand**: Show-Ansicht existiert bereits mit folgenden Features:
  - Tür-Animationen (zweiflügelige Schiebetüren mit Logo)
  - Nebel-Effekt beim Öffnen der Türen
  - Schreib-Effekt für Namen
  - Spieler-Pool-Liste in der Mitte
  - Team-Tabellen unten
  - Fairness-Verteilung nach Stärke (pro Stärkestufe max. ein Spieler pro Team)
  - Fullscreen-Modus
  - Stadionartiges Design mit dunklem Gradient-Hintergrund

## 2. Zielbild (Feature-Liste)

Die Zielversion soll folgende Features umfassen:

### Editor-Bereich

- **Spielerverwaltung**
  - Liste aller Spieler anzeigen
  - Spieler hinzufügen, bearbeiten, löschen (CRUD)
  - Felder: Name, Stärke (1–5), Position (optional)
  - Bulk-Import/Export möglich (später)

- **Team-/Gruppenkopf-Editor**
  - Anzahl der Teams konfigurierbar
  - Pro Team: Name, Farbe, Icon/Emoji
  - Vorschau der Team-Farben im Editor

- **Branding-Einstellungen**
  - Logo-Upload (ersetzt SV-Steinheim-Logo)
  - Primär- und Sekundärfarben anpassbar
  - Hintergrund-Gradient konfigurierbar (optional)

- **Regel-/Modus-Einstellungen**
  - **Fairness-Modus**:
    - Ultra fair: Maximale Ausgewogenheit der Team-Gesamtstärken
    - Gemischt: Balance zwischen Fairness und Zufall
    - Chaos: Zufällige Verteilung ohne Stärke-Berücksichtigung
  - **Tür-Modus**:
    - Double-Door: Zwei Türen (wie aktuell) – eine für Spieler, eine für Teamkopf
    - Single-Door: Eine Tür pro Ziehung, Farbe entsprechend dem Team, Teamname wird angezeigt

### Verteilungslogik

- Verteilung nach Stärke mit möglichst ausgeglichener Team-Gesamtstärke
- Funktioniert auch bei ungleicher Spieleranzahl
- Handling von Edge Cases (zu viele/zu wenige Spieler, ungleiche Stärkeverteilung)
- Optional: Positions-Balancing (z.B. pro Team max. 2 Verteidiger)

### Show-Modus

- **Spieler-Reveal**
  - Tür-/Nebel-Animationen je nach konfiguriertem Modus
  - Single-Door-Modus mit Teamfarbe + Teamname
  - Smooth Transitions

- **Fortschrittsanzeige pro Team**
  - Visueller Fortschrittsbalken je Team
  - Anzeige: "X von Y Spielern"
  - Farbcodierung entsprechend Team-Farbe

- **Hotkeys**
  - `Space` = Nächster Draw
  - `R` = Reset
  - `F` = Fullscreen ein/aus
  - `U` = Undo (letzte Ziehung rückgängig) – optional

- **Weitere Show-Features**
  - Konfetti-Effekt beim Abschluss (optional, konfigurierbar)
  - Sounds (Tür-Öffnung, Whoosh, Jubel) – optional, konfigurierbar
  - History-Leiste: Letzte Ziehungen anzeigen

### PWA-Funktion

- Installierbar auf Handy/Tablet/PC (Homescreen)
- Vollbild ohne Browser-Chrome (Display: standalone)
- Offline-Funktionalität (Service Worker)
- App-Icons für verschiedene Gerätegrößen

### Export

- Teams als Text/Tabellen-Ansicht (Copy-Paste)
- Format: Text-Tabelle oder Markdown
- Optional (V2): PDF-Export mit Formatierung

## 3. Architektur & Tech-Stack

### Frontend

- **Framework**: React + Vite (bereits vorhanden)
- **State-Management**: 
  - Vorschlag: Zustand (zustand) – leichtgewichtig, einfach zu verwenden
  - Alternative: Redux Toolkit (bei komplexeren Anforderungen)
- **Routing**: React Router
  - `/show` – Show-Modus (aktuell bereits vorhanden)
  - `/editor` – Konfiguration (Spieler, Teams, Settings)
  - `/settings` – Branding/Globale Einstellungen
  - `/export` – Export-Ansicht (optional)

### PWA

- **Plugin**: `vite-plugin-pwa`
- **Manifest-Konfiguration**:
  - Name: "TeamDraw"
  - ShortName: "TeamDraw"
  - Theme-Color: Grün (passend zum Stadion-Design)
  - Background-Color: Dunkelgrün/Schwarz
  - Icons: Mehrere Größen (192x192, 512x512, etc.)
  - Start-URL: `/show`
  - Display: `standalone`
  - Orientation: `portrait` oder `any`

### Persistenz

- **Phase 1**: `localStorage` für:
  - Spieler-Array
  - Teams-Array
  - Config-Objekt
- **Später (optional)**: Backend-Integration
  - Optionen: Supabase, Firebase, oder eigener API-Server
  - Mehrnutzer-Funktion möglich

### Optionale spätere Erweiterung

- Native Apps via Capacitor (React-basiert) oder React Native
- Nur als langfristige Option, nicht Teil der ersten Versionen

## 4. Datenmodell

### Player

```typescript
interface Player {
  id: string;              // Eindeutige ID (z.B. UUID oder Timestamp)
  name: string;            // Spielername
  strength: number;        // Stärkewert (z.B. 1-5, 5 = am stärksten)
  position?: string;       // Optional: Position (z.B. "Torwart", "Abwehr", "Mittelfeld", "Sturm")
}
```

### Team

```typescript
interface Team {
  id: string;              // Eindeutige ID
  name: string;            // Team-Name (z.B. "Božo", "Daniel")
  color?: string;          // Hex-Farbe (z.B. "#22c55e")
  icon?: string;           // Emoji oder Icon-Name (z.B. "⚽" oder "team-1")
}
```

### Config

```typescript
interface Config {
  teamCount: number;                       // Anzahl der Teams
  fairnessMode: "ultra" | "mixed" | "chaos";  // Fairness-Modus
  doorMode: "double" | "single";           // Tür-Modus
  showSettings: {
    animationSpeed: number;                // Multiplikator für Animationsgeschwindigkeit (0.5-2.0)
    soundEnabled: boolean;                 // Sounds ein/aus
    confettiEnabled: boolean;              // Konfetti ein/aus
    showProgress: boolean;                 // Fortschrittsbalken anzeigen
  };
}
```

### StoredState

```typescript
interface StoredState {
  players: Player[];       // Array aller Spieler
  teams: Team[];           // Array aller Teams
  config: Config;          // Konfiguration
}
```

### Erläuterung der Felder

- **Player.id**: Wird beim Erstellen automatisch generiert, dient zur eindeutigen Identifikation beim Bearbeiten/Löschen
- **Player.strength**: Numerischer Wert, höhere Zahl = stärkerer Spieler. Wird für Fairness-Berechnung verwendet
- **Player.position**: Optional, kann später für Positions-Balancing verwendet werden
- **Team.color**: Wird im Single-Door-Modus für die Türfarbe verwendet
- **Team.icon**: Visuelles Element, kann Emoji oder Icon-Name sein
- **Config.fairnessMode**: Bestimmt, wie stark die Stärke-Balance gewichtet wird
- **Config.doorMode**: Bestimmt die Art der Animation (aktuell nur double vorhanden)
- **Config.showSettings.animationSpeed**: Erlaubt Anpassung der Geschwindigkeit (für Präsentationen)

## 5. Meilensteine / Etappen mit Checklisten

### Phase 1 – PWA-Basis & Projektstruktur

**Ziele:**
- App PWA-fähig machen
- Klare Struktur für Views (Editor vs. Show)
- Navigation zwischen Views

**TODOs:**

- [ ] `vite-plugin-pwa` installieren (`npm install vite-plugin-pwa`)
- [ ] `vite.config.js` anpassen: Plugin importieren und konfigurieren
- [ ] Manifest-Datei erstellen/anpassen:
  - [ ] Name: "TeamDraw"
  - [ ] ShortName: "TeamDraw"
  - [ ] Theme-Color: Passend zum Design (#022c22 oder ähnlich)
  - [ ] Background-Color: Dunkel (#000000 oder #020617)
  - [ ] Icons: Mehrere Größen erstellen (192x192, 512x512) – können zunächst Platzhalter sein
  - [ ] Start-URL: `/show`
  - [ ] Display: `standalone`
- [ ] Service Worker über das Plugin konfigurieren:
  - [ ] Strategie: `generateSW` (automatisch generiert)
  - [ ] Workbox-Strategie für Assets: `CacheFirst` oder `NetworkFirst`
- [ ] Test: App im Browser auf Handy öffnen und "Zum Home-Bildschirm hinzufügen" testen
- [ ] Test: Nach Installation: App startet ohne Browser-Chrome
- [ ] React Router installieren (`npm install react-router-dom`)
- [ ] Routing-Struktur anlegen:
  - [ ] `/show` – Show-Ansicht (bestehende App-Komponente)
  - [ ] `/editor` – Editor-Ansicht (neu)
  - [ ] `/settings` – Settings-Ansicht (neu)
  - [ ] `/` – Redirect zu `/show` oder Startseite mit Navigation
- [ ] Basis-Navigation implementieren:
  - [ ] Navigation-Komponente (z.B. `Navigation.tsx`)
  - [ ] Links/Buttons für Wechsel zwischen Views
  - [ ] Optional: Mobile-freundliches Hamburger-Menü
- [ ] Sicherstellen, dass Show-Ansicht weiterhin funktioniert (keine Regressions)

### Phase 2 – Editor für Spieler & Teams

**Ziele:**
- Spieler- und Teamdaten ohne Code änderbar machen
- Alles lokal speicherbar (localStorage)
- Show-Modus verwendet diese Daten (kein Hardcode mehr)

**TODOs:**

- [ ] Zustand installieren (`npm install zustand`) oder State-Management-Lösung wählen
- [ ] Store-Struktur anlegen:
  - [ ] Store für Players (`usePlayerStore`)
  - [ ] Store für Teams (`useTeamStore`)
  - [ ] Store für Config (`useConfigStore`)
- [ ] `PlayersEditor`-View erstellen:
  - [ ] Liste aller Spieler anzeigen (Tabelle oder Card-Liste)
  - [ ] Formular für neuen Spieler:
    - [ ] Name-Input
    - [ ] Stärke-Input (Zahl, 1-5, mit Slider oder Select)
    - [ ] Position-Input (optional, Select oder Text)
    - [ ] "Hinzufügen"-Button
  - [ ] Bearbeiten-Funktion:
    - [ ] Edit-Button pro Spieler
    - [ ] Formular im Edit-Modus
    - [ ] "Speichern"-Button
  - [ ] Löschen-Funktion:
    - [ ] Delete-Button pro Spieler
    - [ ] Bestätigungsdialog (optional)
  - [ ] Validierung: Name darf nicht leer sein
- [ ] `TeamsEditor`-View erstellen:
  - [ ] Liste aller Teams anzeigen
  - [ ] Formular für neues Team:
    - [ ] Name-Input
    - [ ] Farb-Picker (Color-Input oder Custom-Picker)
    - [ ] Icon-Input (Emoji-Picker oder Text-Input)
    - [ ] "Hinzufügen"-Button
  - [ ] Bearbeiten-Funktion (analog zu Spielern)
  - [ ] Löschen-Funktion (analog zu Spielern)
  - [ ] Anzahl-Teams-Einstellung:
    - [ ] Input für Team-Anzahl
    - [ ] Automatisches Erstellen/Löschen von Teams bei Änderung
- [ ] Persistenz in `localStorage` integrieren:
  - [ ] Beim Laden: Daten aus `localStorage` lesen
  - [ ] Bei Änderungen: Daten in `localStorage` schreiben
  - [ ] Fallback: Wenn keine Daten vorhanden, Standard-Daten verwenden (aktuell hardcoded)
- [ ] Buttons "Preset speichern" / "Preset laden":
  - [ ] "Preset speichern": Export als JSON (Download oder Copy-Paste)
  - [ ] "Preset laden": Import aus JSON (Upload oder Paste)
  - [ ] Optional: Mehrere Presets verwalten
- [ ] Show-Ansicht umbauen:
  - [ ] Hardcoded `players`-Array entfernen
  - [ ] Hardcoded `teamHeads`-Array entfernen
  - [ ] Daten aus Store laden
  - [ ] Sicherstellen, dass Verteilungslogik weiterhin funktioniert
- [ ] Test: Spieler hinzufügen/bearbeiten/löschen
- [ ] Test: Teams hinzufügen/bearbeiten/löschen
- [ ] Test: Daten bleiben nach Browser-Neustart erhalten
- [ ] Test: Show-Ansicht funktioniert mit geänderten Daten

### Phase 3 – Config & Modi (Fairness/Türen/Show)

**Ziele:**
- Einstellbare Modi im Editor
- Show verhält sich je nach Config anders

**TODOs:**

- [ ] `SettingsView` oder Settings-Bereich im Editor erstellen:
  - [ ] Bereich für Config-Einstellungen
  - [ ] Fairness-Modus-Auswahl (Radio-Buttons oder Select)
  - [ ] Tür-Modus-Auswahl (Radio-Buttons)
  - [ ] Show-Settings:
    - [ ] Animation-Geschwindigkeit (Slider)
    - [ ] Sound ein/aus (Toggle)
    - [ ] Konfetti ein/aus (Toggle)
    - [ ] Fortschrittsanzeige ein/aus (Toggle)
- [ ] Fairness-Modi definieren und dokumentieren:
  - [ ] **Ultra fair**: Minimiert die Differenz der Team-Gesamtstärken, bevorzugt schwächere Teams
  - [ ] **Gemischt**: Kombiniert Stärke-Balance mit etwas Zufall (z.B. 70% Fairness, 30% Zufall)
  - [ ] **Chaos**: Komplett zufällige Verteilung, ignoriert Stärke
- [ ] Tür-Modi definieren:
  - [ ] **Double-Door**: Zwei separate Türen (wie aktuell) – eine zeigt Spieler, eine zeigt Teamkopf
  - [ ] **Single-Door**: Eine Tür pro Ziehung, Farbe entspricht Team-Farbe, Teamname wird angezeigt
- [ ] Config-Store erweitern:
  - [ ] Standard-Werte definieren
  - [ ] Persistenz in `localStorage`
  - [ ] Getter/Setter-Funktionen
- [ ] Show-Ansicht so umbauen, dass sie die Config respektiert:
  - [ ] Fairness-Modus in `buildBalancedSequence()` berücksichtigen
  - [ ] Tür-Modus: UI entsprechend anpassen (Single-Door vs. Double-Door)
  - [ ] Animation-Geschwindigkeit anwenden
  - [ ] Sound/Konfetti-Flags berücksichtigen
- [ ] Single-Door-Modus implementieren (wenn doorMode === "single"):
  - [ ] Nur eine Tür anzeigen (statt zwei)
  - [ ] Türfarbe = Team-Farbe
  - [ ] Teamname in/auf der Tür anzeigen
  - [ ] Spielername wie bisher
- [ ] Testszenarien definieren und testen:
  - [ ] 17 Spieler, 4 Teams, gemischte Stärken
  - [ ] 10 Spieler, 5 Teams (ungleiche Verteilung)
  - [ ] 15 Spieler, 3 Teams
  - [ ] Fairness-Modus wechseln und Verteilung prüfen
- [ ] Dokumentation: Erläutern, wann welcher Modus sinnvoll ist

### Phase 4 – Verteilungslogik (Fairness-Algorithmus)

**Ziele:**
- Algorithmus, der Teams nach Gesamtstärke ausbalanciert
- Funktioniert auch bei ungleichen Spielerzahlen
- Unterstützt verschiedene Fairness-Modi

**TODOs:**

- [ ] Funktion `assignTeams(players, teams, config)` konzipieren:
  - [ ] Eingabe: Spieler-Array, Teams-Array, Config
  - [ ] Ausgabe: Sequence-Array (wie bisher)
- [ ] Ziel definieren:
  - [ ] Minimierung der Differenz der Team-Gesamtstärken
  - [ ] Bei "Ultra fair": Streng nach Stärke-Balance
  - [ ] Bei "Gemischt": Balance + etwas Zufall
  - [ ] Bei "Chaos": Komplett zufällig
- [ ] Algorithmus-Implementierung:
  - [ ] Spieler nach Stärke sortieren (stärkste zuerst)
  - [ ] Für jeden Spieler: Team mit geringster Gesamtstärke finden
  - [ ] Bei Gleichstand: Zufälliges Team wählen
  - [ ] "Gemischt"-Modus: Gelegentlich zufälliges Team wählen (auch wenn nicht schwächstes)
  - [ ] "Chaos"-Modus: Komplett zufällige Zuordnung
- [ ] Handling für Edge Cases:
  - [ ] Zu viele Spieler: Alle Spieler verteilen, auch wenn Teams ungleich groß
  - [ ] Zu wenige Spieler: Einige Teams bleiben leer oder haben weniger Spieler
  - [ ] Ungleiche Stärkeverteilung: Bestmögliche Balance finden
  - [ ] Unmögliche Kombinationen (z.B. 1 Spieler, 5 Teams): Graceful Handling
- [ ] Optional: Positionslogik andenken (als V2 markieren):
  - [ ] Pro Team max. X Spieler einer Position
  - [ ] Nur wenn Positions-Daten vorhanden
- [ ] Manuelle Testszenarien dokumentieren und testen:
  - [ ] 15 Spieler, 5 Teams, perfekte Balance (3 pro Team) – erwartet: Gleichmäßige Verteilung
  - [ ] 17 Spieler, 4 Teams – erwartet: 4-4-4-5 oder 4-4-5-4 Verteilung
  - [ ] 10 Spieler, 5 Teams – erwartet: 2-2-2-2-2 Verteilung
  - [ ] 20 Spieler, 3 Teams – erwartet: 6-7-7 oder ähnlich
  - [ ] Fairness-Modi vergleichen: Gleiche Spieler, verschiedene Modi → verschiedene Verteilungen
- [ ] Debug-Modus (optional):
  - [ ] Console-Log der Team-Stärken nach Verteilung
  - [ ] Visualisierung der Stärke-Verteilung in der UI (optional)

### Phase 5 – Show-Features & Atmosphäre

**Ziele:**
- Mehr Show: Sounds, Konfetti, Fortschrittsanzeige
- Single-Door-Modus vollständig implementiert
- Hotkeys für bessere Bedienung

**TODOs:**

- [ ] Single-Door-Modus vollständig implementieren:
  - [ ] Nur eine Tür anzeigen (statt zwei)
  - [ ] Türfarbe = Team-Farbe (aus Config)
  - [ ] Teamname in/auf der Tür anzeigen
  - [ ] Spielername wie bisher
  - [ ] Animation anpassen (eine Tür öffnet sich)
- [ ] Fortschrittsanzeige im UI:
  - [ ] Team-Boxes mit Spielern darunter (wie aktuell)
  - [ ] Zusätzlich: Fortschrittsbalken pro Team
  - [ ] Anzeige: "X von Y Spielern" (Y = Ziel-Anzahl basierend auf Gesamtanzahl)
  - [ ] Farbcodierung entsprechend Team-Farbe
  - [ ] Optional: Prozentanzeige
- [ ] Sounds einbinden (nur wenn `config.showSettings.soundEnabled === true`):
  - [ ] Sound-Dateien vorbereiten/hochladen:
    - [ ] Tür-Öffnung (z.B. `door-open.mp3`)
    - [ ] Whoosh (z.B. `whoosh.mp3`)
    - [ ] Jubel (z.B. `cheer.mp3`)
  - [ ] Sounds in `public/`-Ordner legen
  - [ ] Sound-Playback-Funktion erweitern (bereits vorhanden)
  - [ ] Sound bei Tür-Öffnung
  - [ ] Sound bei Name-Reveal
  - [ ] Sound bei Abschluss (Jubel)
- [ ] Konfetti-Effekt beim Abschluss:
  - [ ] Library installieren (z.B. `canvas-confetti` oder `react-confetti`)
  - [ ] Konfetti nur wenn `config.showSettings.confettiEnabled === true`
  - [ ] Trigger: Wenn alle Spieler verteilt sind
  - [ ] Optional: Konfetti in Team-Farben
- [ ] Hotkeys implementieren:
  - [ ] `Space` = Nächster Draw (wenn nicht animierend)
  - [ ] `R` = Reset
  - [ ] `F` = Fullscreen ein/aus (bereits vorhanden, erweitern)
  - [ ] `U` = Undo (optional, letzte Ziehung rückgängig)
  - [ ] Event-Listener für Keyboard-Events
  - [ ] Dokumentation: Hotkeys in UI anzeigen (Tooltip oder Info-Box)
- [ ] History-Leiste (optional):
  - [ ] Letzte Ziehungen anzeigen (z.B. letzte 5)
  - [ ] Format: "Spieler → Team"
  - [ ] Position: Oben oder unten im Show-View
  - [ ] Optional: Klickbar für Undo
- [ ] Undo-Funktion (optional):
  - [ ] Stack der Ziehungen speichern
  - [ ] "Undo"-Button oder Hotkey `U`
  - [ ] Letzte Ziehung rückgängig machen
  - [ ] Spieler aus Team entfernen, zurück in Pool
- [ ] Animation-Geschwindigkeit anwenden:
  - [ ] Alle Timeouts mit `config.showSettings.animationSpeed` multiplizieren
  - [ ] Test: Verschiedene Geschwindigkeiten ausprobieren
- [ ] Test: Alle Show-Features kombinieren und testen
- [ ] Test: Single-Door vs. Double-Door-Modus vergleichen

### Phase 6 – Export & Qualität

**Ziele:**
- Ergebnisse einfach weiterverwenden
- Projekt gut wartbar
- Bugs fixen

**TODOs:**

- [ ] Export-View erstellen:
  - [ ] Route `/export` oder Modal/Dialog
  - [ ] Teams tabellarisch anzeigen
  - [ ] Format: Text-Tabelle (Copy-Paste-freundlich)
  - [ ] Format-Optionen:
    - [ ] Plain Text (Tab-getrennt)
    - [ ] Markdown-Tabelle
    - [ ] CSV (optional)
  - [ ] "Copy"-Button: In Zwischenablage kopieren
  - [ ] "Download"-Button: Als `.txt`-Datei downloaden
- [ ] Optional: PDF-Export recherchieren:
  - [ ] Libraries: `jspdf`, `react-pdf`, etc.
  - [ ] Als V2 markieren (nicht jetzt umsetzen)
  - [ ] Anforderungen dokumentieren: Format, Layout, etc.
- [ ] Kleinere Bugs & Glitches sammeln und Fix-Liste anlegen:
  - [ ] Bekannte Issues dokumentieren
  - [ ] Prioritäten setzen
  - [ ] Fixes implementieren:
    - [ ] Beispiel: "?"-Bug (falls noch vorhanden)
    - [ ] Timing-Türen (falls Probleme)
    - [ ] Mobile-Ansicht (Responsive Design prüfen)
    - [ ] Browser-Kompatibilität testen
- [ ] Smoke-Test-Liste erstellen:
  - [ ] Kurze manuelle Testfälle vor Nutzung
  - [ ] Checkliste für wichtige Funktionen:
    - [ ] Spieler hinzufügen/bearbeiten/löschen
    - [ ] Teams konfigurieren
    - [ ] Show starten
    - [ ] Fullscreen funktioniert
    - [ ] Reset funktioniert
    - [ ] Export funktioniert
    - [ ] PWA-Installation funktioniert
- [ ] Code-Qualität:
  - [ ] Kommentare in komplexen Funktionen
  - [ ] Konsistente Namenskonventionen
  - [ ] Unbenutzte Imports entfernen
  - [ ] Console-Logs entfernen (oder durch Logger ersetzen)
- [ ] Dokumentation:
  - [ ] README.md aktualisieren
  - [ ] Installationsanleitung
  - [ ] Nutzungsanleitung (kurz)
  - [ ] Bekannte Einschränkungen dokumentieren

## 6. Optional: Backend & Native Apps (Parkplatz)

**Hinweis: Diese Ideen sind für spätere Versionen gedacht, nicht für die erste Implementierung.**

### Backend-Optionen

- **Supabase**: 
  - PostgreSQL-Datenbank
  - Authentifizierung
  - Real-time Subscriptions
  - Vorteil: Schneller Einstieg, kostenloser Tier verfügbar

- **Firebase**:
  - Firestore-Datenbank
  - Authentifizierung
  - Vorteil: Gut dokumentiert, große Community

- **Next.js API Routes**:
  - Eigenes Backend mit Next.js
  - Vorteil: Alles in einem Stack

- **Eigener API-Server**:
  - Node.js/Express oder Python/FastAPI
  - Vorteil: Volle Kontrolle

### Mehrnutzer-Funktion

- Anderer Trainer loggt sich ein
- Daten werden online gespeichert
- Eventuell: Team-Kollaboration (mehrere Trainer arbeiten zusammen)

### Native App-Option

- **Capacitor**:
  - React-App in Native App wrappen
  - iOS und Android
  - Vorteil: Code-Sharing mit Web-App

- **React Native**:
  - Komplett neue Implementierung
  - Vorteil: Native Performance
  - Nachteil: Mehr Aufwand

### Online-Multiplayer-/Stream-Setup

- OBS-Szene: Show-Ansicht als Overlay
- Live-Streaming-Integration
- Eventuell: Remote-Steuerung (ein Gerät steuert, anderes zeigt)

## 7. Nächste konkrete Schritte

### Kurzfristige Roadmap

1. **Phase 1 komplett abarbeiten**
   - PWA-Basis einrichten
   - Routing-Struktur anlegen
   - Navigation implementieren
   - Alle TODOs aus Phase 1 abhaken

2. **Danach mit Phase 2 starten**
   - Editor für Spieler & Teams
   - Schritt für Schritt vorgehen
   - Nach jedem größeren Feature testen

3. **Weiter mit Phase 3, 4, 5, 6**
   - Immer erst eine Phase weitgehend fertig machen
   - Vor Beginn der nächsten Phase: Bestehende Funktionalität testen
   - Keine halbfertigen Features hinterlassen

### Wichtige Prinzipien

- **Immer erst eine Phase komplett fertig machen**, bevor die nächste begonnen wird
- **Regelmäßig testen**: Nach jedem größeren Feature die App testen
- **Dokumentation**: Wichtige Entscheidungen und Änderungen dokumentieren
- **Versionierung**: Git-Commits sinnvoll strukturieren (z.B. "feat:", "fix:", "refactor:")
- **Inkrementell vorgehen**: Kleine Schritte, die funktionieren, sind besser als große, die nicht funktionieren

### Erfolgskriterien für jede Phase

- Alle TODOs der Phase sind abgehakt
- App funktioniert ohne kritische Bugs
- Neue Features sind getestet
- Code ist kommentiert (wo nötig)
- Keine Regressions (bestehende Features funktionieren weiterhin)

---

**Viel Erfolg bei der Umsetzung! 🚀**
