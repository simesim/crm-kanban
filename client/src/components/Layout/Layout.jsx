import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../store/auth/slice";
import { selectUser } from "../../store/auth/selectors";
import { toast } from "../../utils/toastBus";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const onLogout = async () => {
    await dispatch(logoutThunk());
    toast("Logged out", "ok");
    navigate("/login");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          padding: 16,
          borderRight: "1px solid rgba(148,163,184,0.18)",
          background: "rgba(15,23,42,0.65)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 12 }}>CRM Kanban</div>

        <div style={{ padding: 12, border: "1px solid rgba(148,163,184,0.18)", borderRadius: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Signed in as</div>
          <div style={{ marginTop: 4, fontWeight: 700 }}>{user?.email}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#94a3b8" }}>
            Role: <b style={{ color: "#e5e7eb" }}>{user?.role}</b>
          </div>
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink
            to="/boards"
            style={({ isActive }) => ({
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.18)",
              background: isActive ? "rgba(96,165,250,0.16)" : "rgba(255,255,255,0.04)",
            })}
          >
            Boards
          </NavLink>
        </nav>

        <div style={{ marginTop: 16 }}>
          <button onClick={onLogout} style={{ width: "100%" }}>
            Logout
          </button>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: "#94a3b8" }}>
          Tips: <span className="kbd">drag</span> cards like Trello
        </div>
      </aside>

      <main style={{ padding: 18 }}>
        <Outlet />
      </main>
    </div>
  );
}
