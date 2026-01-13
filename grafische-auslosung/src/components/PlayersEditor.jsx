import { useState } from "react";
import { useStore } from "../stores/useStore";

function PlayersEditor() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", strength: 3, position: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updatePlayer(editingId, formData);
      setEditingId(null);
    } else {
      addPlayer(formData);
    }
    setFormData({ name: "", strength: 3, position: "" });
  };

  const handleEdit = (player) => {
    setEditingId(player.id);
    setFormData({
      name: player.name,
      strength: player.strength,
      position: player.position || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", strength: 3, position: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Spieler wirklich löschen?")) {
      deletePlayer(id);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#e5e7eb" }}>Spielerverwaltung</h2>

      {/* Formular */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          border: "1px solid #22c55e44",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb" }}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                background: "#0f172a",
                border: "1px solid #4b5563",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb" }}>
              Stärke (1-5) *
            </label>
            <select
              value={formData.strength}
              onChange={(e) => setFormData({ ...formData, strength: Number(e.target.value) })}
              required
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
              <option value={1}>1 (Schwach)</option>
              <option value={2}>2</option>
              <option value={3}>3 (Mittel)</option>
              <option value={4}>4</option>
              <option value={5}>5 (Stark)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb" }}>
              Position (optional)
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="z.B. Torwart, Abwehr, Mittelfeld, Sturm"
              style={{
                width: "100%",
                padding: "0.5rem",
                background: "#0f172a",
                border: "1px solid #4b5563",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1.5rem",
                background: "#22c55e",
                color: "#022c14",
                border: "none",
                borderRadius: "999px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {editingId ? "Speichern" : "Hinzufügen"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "0.5rem 1.5rem",
                  background: "#64748b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Abbrechen
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Liste */}
      <div>
        <h3 style={{ marginBottom: "1rem", color: "#e5e7eb" }}>
          Spieler ({players.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {players.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>
              Noch keine Spieler vorhanden
            </p>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                style={{
                  background: "#020617",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #4b5563",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#e5e7eb" }}>{player.name}</strong>
                  <span style={{ color: "#9ca3af", marginLeft: "1rem" }}>
                    Stärke: {player.strength}
                  </span>
                  {player.position && (
                    <span style={{ color: "#9ca3af", marginLeft: "1rem" }}>
                      Position: {player.position}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(player)}
                    style={{
                      padding: "0.4rem 1rem",
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    style={{
                      padding: "0.4rem 1rem",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayersEditor;
