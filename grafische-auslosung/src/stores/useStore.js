import { create } from "zustand";
import { persist } from "zustand/middleware";

// Standard-Spieler (Fallback)
const defaultPlayers = [
  { id: "1", name: "Alessandro", strength: 4 },
  { id: "2", name: "Maxim", strength: 4 },
  { id: "3", name: "Luka", strength: 4 },
  { id: "4", name: "Mathias", strength: 4 },
  { id: "5", name: "Mayar", strength: 4 },
  { id: "6", name: "Erik", strength: 3 },
  { id: "7", name: "Edin", strength: 3 },
  { id: "8", name: "Amin", strength: 3 },
  { id: "9", name: "Elias", strength: 3 },
  { id: "10", name: "Tarik", strength: 3 },
  { id: "11", name: "Mattia", strength: 2 },
  { id: "12", name: "Matthias G", strength: 2 },
  { id: "13", name: "Jonas", strength: 2 },
  { id: "14", name: "Steini", strength: 2 },
  { id: "15", name: "Tijan", strength: 2 },
];

// Standard-Teams (Fallback)
const defaultTeams = [
  { id: "1", name: "Božo", color: "#22c55e" },
  { id: "2", name: "Daniel", color: "#3b82f6" },
  { id: "3", name: "Andi", color: "#a855f7" },
  { id: "4", name: "Marcel", color: "#f59e0b" },
  { id: "5", name: "Damir", color: "#ef4444" },
];

// Standard-Config (Fallback)
const defaultConfig = {
  teamCount: 5,
  fairnessMode: "ultra",
  doorMode: "double",
  showSettings: {
    animationSpeed: 1.0,
    soundEnabled: true,
    confettiEnabled: false,
    showProgress: true,
  },
};

export const useStore = create(
  persist(
    (set, get) => ({
      // Players
      players: defaultPlayers,
      addPlayer: (player) => {
        const newPlayer = {
          ...player,
          id: player.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          players: [...state.players, newPlayer],
        }));
      },
      updatePlayer: (id, updates) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },
      deletePlayer: (id) => {
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        }));
      },

      // Teams
      teams: defaultTeams,
      addTeam: (team) => {
        const newTeam = {
          ...team,
          id: team.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          teams: [...state.teams, newTeam],
        }));
      },
      updateTeam: (id, updates) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },
      deleteTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
        }));
      },
      setTeamCount: (count) => {
        // Wert parsen und validieren
        const newCount = Number(count);
        if (isNaN(newCount) || newCount < 2) {
          return; // Ungültiger Wert, abbrechen
        }
        
        const currentTeams = get().teams;
        const currentLength = currentTeams.length;
        
        if (newCount > currentLength) {
          // Teams hinzufügen
          const newTeams = [];
          // Farbe-Palette für neue Teams
          const colors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316"];
          
          for (let i = currentLength; i < newCount; i++) {
            const colorIndex = i % colors.length;
            newTeams.push({
              id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
              name: `Team ${i + 1}`,
              color: colors[colorIndex],
            });
          }
          set((state) => ({
            teams: [...state.teams, ...newTeams],
            config: {
              ...state.config,
              teamCount: newCount,
            },
          }));
        } else if (newCount < currentLength) {
          // Teams entfernen (von hinten)
          set((state) => ({
            teams: state.teams.slice(0, newCount),
            config: {
              ...state.config,
              teamCount: newCount,
            },
          }));
        }
      },

      // Config
      config: defaultConfig,
      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
        }));
      },
      updateShowSettings: (updates) => {
        set((state) => ({
          config: {
            ...state.config,
            showSettings: { ...state.config.showSettings, ...updates },
          },
        }));
      },

      // Reset-Funktion
      resetToDefaults: () => {
        set({
          players: defaultPlayers,
          teams: defaultTeams,
          config: defaultConfig,
        });
      },
    }),
    {
      name: "teamdraw-storage",
      version: 1,
    }
  )
);
