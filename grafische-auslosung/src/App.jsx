import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ShowView from "./ShowView";
import EditorView from "./EditorView";
import "./App.css";

function Navigation() {
  const location = useLocation();

  return (
    <nav style={{
      padding: "1rem",
      background: "#020617dd",
      borderBottom: "1px solid #22c55e44",
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
    }}>
      <Link
        to="/show"
        style={{
          padding: "0.5rem 1.5rem",
          background: location.pathname === "/show" ? "#22c55e" : "#020617",
          color: location.pathname === "/show" ? "#022c14" : "#e5e7eb",
          textDecoration: "none",
          borderRadius: "999px",
          fontWeight: 600,
        }}
      >
        Show
      </Link>
      <Link
        to="/editor"
        style={{
          padding: "0.5rem 1.5rem",
          background: location.pathname === "/editor" ? "#22c55e" : "#020617",
          color: location.pathname === "/editor" ? "#022c14" : "#e5e7eb",
          textDecoration: "none",
          borderRadius: "999px",
          fontWeight: 600,
        }}
      >
        Editor
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/show" element={<ShowView />} />
        <Route path="/editor" element={<EditorView />} />
        <Route path="/" element={<ShowView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
