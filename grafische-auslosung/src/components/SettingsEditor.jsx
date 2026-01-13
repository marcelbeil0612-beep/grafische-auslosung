import { useStore } from "../stores/useStore";

function SettingsEditor() {
  const { config, updateConfig, updateShowSettings } = useStore();

  const handleFairnessModeChange = (e) => {
    updateConfig({ fairnessMode: e.target.value });
  };

  const handleDoorModeChange = (e) => {
    updateConfig({ doorMode: e.target.value });
  };

  const handleSoundEnabledChange = (e) => {
    updateShowSettings({ soundEnabled: e.target.checked });
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#e5e7eb" }}>Einstellungen</h2>

      {/* Fairness-Modus */}
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "1px solid #22c55e44",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#e5e7eb",
            fontWeight: 600,
          }}
        >
          Fairness-Modus
        </label>
        <select
          value={config.fairnessMode}
          onChange={handleFairnessModeChange}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "#0f172a",
            border: "1px solid #4b5563",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          <option value="ultra">Ultra fair</option>
          <option value="mixed">Gemischt</option>
          <option value="chaos">Chaos</option>
        </select>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          {config.fairnessMode === "ultra" &&
            "Minimiert die Differenz der Team-Gesamtstärken, bevorzugt schwächere Teams"}
          {config.fairnessMode === "mixed" &&
            "Kombiniert Stärke-Balance mit etwas Zufall (ca. 70% Fairness, 30% Zufall)"}
          {config.fairnessMode === "chaos" &&
            "Komplett zufällige Verteilung, ignoriert Stärke"}
        </p>
      </div>

      {/* Tür-Modus */}
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "1px solid #22c55e44",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#e5e7eb",
            fontWeight: 600,
          }}
        >
          Tür-Modus
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="doorMode"
              value="double"
              checked={config.doorMode === "double"}
              onChange={handleDoorModeChange}
              style={{ cursor: "pointer" }}
            />
            <span>Double-Door (zwei Türen – Spieler & Teamkopf)</span>
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="doorMode"
              value="single"
              checked={config.doorMode === "single"}
              onChange={handleDoorModeChange}
              style={{ cursor: "pointer" }}
            />
            <span>Single-Door (eine Tür mit Teamfarbe)</span>
          </label>
        </div>
      </div>

      {/* Sound-Einstellungen */}
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "1px solid #22c55e44",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#e5e7eb",
            fontWeight: 600,
          }}
        >
          <span>Sounds aktivieren</span>
          <input
            type="checkbox"
            checked={config.showSettings.soundEnabled}
            onChange={handleSoundEnabledChange}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          />
        </label>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          Aktiviert/deaktiviert Sound-Effekte während der Auslosung
        </p>
      </div>
    </div>
  );
}

export default SettingsEditor;
