import { useState } from "react";
import PlayersEditor from "./components/PlayersEditor";
import TeamsEditor from "./components/TeamsEditor";
import SettingsEditor from "./components/SettingsEditor";

function EditorView() {
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, #0f172a 0, #022c22 35%, #01110c 75%, #000000 100%)" }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid #22c55e44", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={() => setActiveTab("players")}
          style={{
            padding: "0.5rem 1.5rem",
            background: activeTab === "players" ? "#22c55e" : "#020617",
            color: activeTab === "players" ? "#022c14" : "#e5e7eb",
            border: "none",
            borderRadius: "999px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Spieler
        </button>
        <button
          onClick={() => setActiveTab("teams")}
          style={{
            padding: "0.5rem 1.5rem",
            background: activeTab === "teams" ? "#22c55e" : "#020617",
            color: activeTab === "teams" ? "#022c14" : "#e5e7eb",
            border: "none",
            borderRadius: "999px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Teams
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          style={{
            padding: "0.5rem 1.5rem",
            background: activeTab === "settings" ? "#22c55e" : "#020617",
            color: activeTab === "settings" ? "#022c14" : "#e5e7eb",
            border: "none",
            borderRadius: "999px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Einstellungen
        </button>
      </div>

      {activeTab === "players" && <PlayersEditor />}
      {activeTab === "teams" && <TeamsEditor />}
      {activeTab === "settings" && <SettingsEditor />}
    </div>
  );
}

export default EditorView;
