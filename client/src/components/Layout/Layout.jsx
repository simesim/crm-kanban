import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>CRM Kanban</div>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/boards">Boards</Link>
        </nav>
      </aside>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
