import { useState } from "react";
import { useStore } from "../stores/useStore";

function TeamsEditor() {
  const { teams, addTeam, updateTeam, deleteTeam, setTeamCount, config } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", color: "#22c55e", icon: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateTeam(editingId, formData);
      setEditingId(null);
    } else {
      addTeam(formData);
    }
    setFormData({ name: "", color: "#22c55e", icon: "" });
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
    setFormData({
      name: team.name,
      color: team.color || "#22c55e",
      icon: team.icon || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", color: "#22c55e", icon: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Team wirklich löschen?")) {
      deleteTeam(id);
    }
  };

  const handleTeamCountChange = (e) => {
    const count = Number(e.target.value);
    if (count >= 1 && count <= 10) {
      setTeamCount(count);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#e5e7eb" }}>Team-Verwaltung</h2>

      {/* Team-Anzahl */}
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          border: "1px solid #22c55e44",
        }}
      >
        <label style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb" }}>
          Anzahl der Teams
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={config.teamCount}
          onChange={handleTeamCountChange}
          style={{
            padding: "0.5rem",
            background: "#0f172a",
            border: "1px solid #4b5563",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "1rem",
            width: "100px",
          }}
        />
        <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Aktuell: {teams.length} Teams
        </p>
      </div>

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
              Team-Name *
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
              Farbe
            </label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{
                  width: "60px",
                  height: "40px",
                  border: "1px solid #4b5563",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#22c55e"
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  background: "#0f172a",
                  border: "1px solid #4b5563",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#e5e7eb" }}>
              Icon/Emoji (optional)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="z.B. ⚽ oder 🏆"
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
          Teams ({teams.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {teams.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem" }}>
              Noch keine Teams vorhanden
            </p>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
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
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {team.icon && (
                    <span style={{ fontSize: "1.5rem" }}>{team.icon}</span>
                  )}
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      background: team.color || "#22c55e",
                      border: "1px solid #fff",
                    }}
                  />
                  <div>
                    <strong style={{ color: "#e5e7eb" }}>{team.name}</strong>
                    {team.color && (
                      <span style={{ color: "#9ca3af", marginLeft: "1rem" }}>
                        {team.color}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(team)}
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
                    onClick={() => handleDelete(team.id)}
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

export default TeamsEditor;
