import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "system-ui, sans-serif", padding: 24 }}>
          <div style={{ maxWidth: 760, margin: "40px auto", background: "#fff", border: "1px solid #fecaca", borderRadius: 8, padding: 18 }}>
            <div style={{ color: "#dc2626", fontWeight: 900, fontSize: 20, marginBottom: 8 }}>OneRoot Meetings could not start</div>
            <pre style={{ whiteSpace: "pre-wrap", color: "#7f1d1d", background: "#fef2f2", padding: 12, borderRadius: 8 }}>{String(this.state.error?.message || this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
