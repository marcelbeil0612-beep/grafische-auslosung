import { useState, useRef } from "react";
import "./App.css";

const teamHeads = ["Božo", "Daniel", "Andi", "Marcel", "Damir"];

// Spieler mit versteckter Stärke (nicht im UI anzeigen!)
const players = [
  { name: "Alessandro", strength: 4 },
  { name: "Maxim", strength: 4 },
  { name: "Luka", strength: 4 },
  { name: "Mathias", strength: 4 },
  { name: "Mayar", strength: 4 },
  { name: "Erik", strength: 3 },
  { name: "Edin", strength: 3 },
  { name: "Amin", strength: 3 },
  { name: "Elias", strength: 3 },
  { name: "Tarik", strength: 3 },
  { name: "Mattia", strength: 2 },
  { name: "Matthias G", strength: 2 },
  { name: "Jonas", strength: 2 },
  { name: "Steini", strength: 2 },
  { name: "Tijan", strength: 2 },
];

const TOTAL_PLAYERS = players.length;

// faire Verteilung nach Stärke
function buildBalancedSequence() {
  // Spieler nach Stärke gruppieren
  const strengthMap = {};
  players.forEach((p) => {
    if (!strengthMap[p.strength]) {
      strengthMap[p.strength] = [];
    }
    strengthMap[p.strength].push(p);
  });

  // Teams vorbereiten
  const assignments = {};
  teamHeads.forEach((head) => {
    assignments[head] = [];
  });

  // Stärken sortieren (starke zuerst, ist aber eher kosmetisch)
  const strengths = Object.keys(strengthMap)
    .map((s) => Number(s))
    .sort((a, b) => b - a);

  const teamCount = teamHeads.length;

  // Für jede Stärkestufe: Spieler zufällig auf die Teams verteilen,
  // dabei max. EIN Spieler dieser Stärke pro Team.
  strengths.forEach((strength) => {
    const group = [...strengthMap[strength]];

    // Spieler dieser Stärke durchmischen
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }

    // Reihenfolge der Teams ebenfalls leicht mischen,
    // damit nicht immer derselbe Kopf den gleichen Typ bekommt
    const teamOrder = [...teamHeads];
    for (let i = teamOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teamOrder[i], teamOrder[j]] = [teamOrder[j], teamOrder[i]];
    }

    // Round-Robin-Zuteilung: pro Team höchstens ein Spieler dieser Stärke
    const maxAssignments = Math.min(group.length, teamCount);
    for (let i = 0; i < maxAssignments; i++) {
      const player = group[i];
      const head = teamOrder[i % teamCount];
      assignments[head].push(player.name);
    }
  });

  // Zieh-Sequenz bauen
  const sequence = [];
  for (const head of teamHeads) {
    for (const name of assignments[head]) {
      sequence.push({ player: name, head });
    }
  }

  // Reihenfolge der Ziehung mischen
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }

  return sequence;
}

function createEmptyTeams() {
  const t = {};
  teamHeads.forEach((head) => (t[head] = []));
  return t;
}

function shuffleNames(names) {
  const arr = [...names];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ShowView() {
  const [sequence, setSequence] = useState(() => buildBalancedSequence());
  const [teams, setTeams] = useState(() => createEmptyTeams());
  const [drawIndex, setDrawIndex] = useState(0);

  const [currentPlayer, setCurrentPlayer] = useState("");
  const [currentHead, setCurrentHead] = useState("");

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const shotSoundRef = useRef(null);
  const revealSoundRef = useRef(null);

  // zufällige Anzeige-Reihenfolge in der Mittelliste
  const [playerOrder] = useState(() =>
    shuffleNames(players.map((p) => p.name))
  );

  const remaining = TOTAL_PLAYERS - drawIndex;
  const finished = drawIndex >= sequence.length;

  // Menge aller bereits zugeordneten Spieler
  const assignedNames = new Set(
    teamHeads.flatMap((head) => teams[head])
  );

  function handleReset() {
    setSequence(buildBalancedSequence());
    setTeams(createEmptyTeams());
    setDrawIndex(0);
    setCurrentPlayer("");
    setCurrentHead("");
    setLeftOpen(false);
    setRightOpen(false);
    setIsAnimating(false);
  }

  function playSound(ref) {
    const el = ref.current;
    if (!el) return;
    try {
      el.currentTime = 0;
      el.play();
    } catch {
      // Sound optional
    }
  }

  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

  function handleDraw() {
    if (isAnimating || finished) return;

    const { player, head } = sequence[drawIndex];

    setIsAnimating(true);
    setCurrentPlayer("");
    setCurrentHead("");
    setLeftOpen(false);
    setRightOpen(false);

    // 1) nach 0,6s: linke Tür öffnet sich, Spielername erscheint
    setTimeout(() => {
      setLeftOpen(true);
      setCurrentPlayer(player);
      playSound(shotSoundRef);
    }, 600);

    // 2) nach 2,6s: rechte Tür öffnet sich, Teamkopf erscheint
    setTimeout(() => {
      setRightOpen(true);
      setCurrentHead(head);
      playSound(revealSoundRef);
    }, 2600);

    // 3) nach 4,6s: Türen schließen sich
    setTimeout(() => {
      setLeftOpen(false);
      setRightOpen(false);

      // Namen wieder zurücksetzen, wenn die Türen zugehen
      setCurrentPlayer("");
      setCurrentHead("");
    }, 7000);

    // 4) nach 5,2s: Spieler wird dem Team zugeordnet, nächster Klick möglich
    setTimeout(() => {
      setTeams((prev) => ({
        ...prev,
        [head]: [...prev[head], player],
      }));
      setDrawIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 7600);
  }

  return (
    <div className="app-root">
      {/* Sounds (optional) */}
      <audio ref={shotSoundRef} src="/shot.mp3" preload="auto" />
      <audio ref={revealSoundRef} src="/reveal.mp3" preload="auto" />

      <header className="app-header">
        <h1>Team-Auslosung – SV Steinheim</h1>
      </header>

      <div className="container">
        <div className="field-wrapper">
          <div className="field">
            <div className="mid-line" />
            <div className="center-circle" />

            {/* Mittlere Spieler-Liste */}
            <div className="player-column">
              <div className="player-column-title">Spieler-Pool</div>
              <ul>
                {playerOrder.map((name) => (
                  <li
                    key={name}
                    className={assignedNames.has(name) ? "assigned" : ""}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="goal-area" />
            <div className="goal" />

            <div className="panel-title panel-title-left">SPIELER-LOS</div>

            {/* Linkes Panel: Spieler-Los */}
            <div className={`logo-panel left ${leftOpen ? "open" : ""}`}>
              <div className="logo-inner">
                <div className="door door-left">
                  <img
                    src="/sv-steinheim-logo.png"
                    alt="SV Steinheim"
                    className="door-logo"
                  />
                </div>
                <div className="door door-right">
                  <img
                    src="/sv-steinheim-logo.png"
                    alt="SV Steinheim"
                    className="door-logo"
                  />
                </div>

                <div className="ticket">
                  <span>{currentPlayer}</span>
                </div>
              </div>
            </div>

            <div className="panel-title panel-title-right">TEAMKOPF</div>

            {/* Rechtes Panel: Teamkopf */}
            <div className={`logo-panel right ${rightOpen ? "open" : ""}`}>
              <div className="logo-inner">
                <div className="door door-left">
                  <img
                    src="/sv-steinheim-logo.png"
                    alt="SV Steinheim"
                    className="door-logo"
                  />
                </div>
                <div className="door door-right">
                  <img
                    src="/sv-steinheim-logo.png"
                    alt="SV Steinheim"
                    className="door-logo"
                  />
                </div>

                <div className="ticket">
                  <span>{currentHead}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="controls">
            <button onClick={handleDraw} disabled={isAnimating || finished}>
              {finished ? "Auslosung abgeschlossen" : "Nächsten Losvorgang starten"}
            </button>
            <button onClick={handleReset}>Reset</button>
            <button type="button" className="secondary" onClick={enterFullscreen}>
              Show starten (Fullscreen)
            </button>
          </div>

          <div className="info">
            {finished
              ? "Alle Spieler sind verteilt. 🎉"
              : `${remaining} Spieler verbleiben.`}
          </div>

          <div className="tables">
            {teamHeads.map((head) => (
              <div key={head} className="team-table">
                <div className="team-header">
                  <span>{`Team ${head}`}</span>
                  <span>{teams[head].length} Spieler</span>
                </div>
                <ul>
                  {teams[head].map((p, i) => (
                    <li key={p + i}>{`${i + 1}. ${p}`}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowView;
