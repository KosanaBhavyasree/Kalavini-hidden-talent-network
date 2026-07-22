// src/pages/NotFound.jsx
//
// Simple 404 page shown for any route that doesn't match.
// This will get a fuller redesign in the Pages module, but we
// need a minimal version now so the router has somewhere to send
// unmatched URLs.

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
      }}
    >
      <h1 className="gradient-text" style={{ fontSize: "4rem" }}>
        404
      </h1>
      <p style={{ color: "var(--text-secondary)", margin: "12px 0 24px" }}>
        This page wandered off the talent map.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
