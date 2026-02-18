import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 640, margin: "70px auto", padding: 16 }}>
      <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 8 }}>404</div>
      <div style={{ color: "#94a3b8" }}>This page does not exist.</div>
      <div style={{ marginTop: 14 }}>
        <Link to="/boards">
          <button>Go to boards</button>
        </Link>
      </div>
    </div>
  );
}
