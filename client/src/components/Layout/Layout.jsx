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
    toast("Вы вышли из аккаунта", "ok");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#fff",
          borderBottom: "1px solid rgba(17,24,39,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 16px",
            maxWidth: 1360,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/assets/logo.svg"
              alt="logo"
              style={{ width: 28, height: 28, borderRadius: 8, flex: "0 0 auto" }}
            />

            <NavLink
              to="/boards"
              style={({ isActive }) => ({
                padding: "10px 14px",
                borderRadius: 12,
                color: "#111827",
                fontWeight: 700,
                background: isActive ? "rgba(37,99,235,0.10)" : "transparent",
              })}
            >
              CRM
            </NavLink>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/assets/avatar.svg"
                alt="avatar"
                style={{ width: 32, height: 32, borderRadius: 999, border: "1px solid rgba(17,24,39,0.12)" }}
              />
              <div>
                <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{user?.email || "Пользователь"}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{user?.role || "—"}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                border: "none",
                background: "transparent",
                color: "#ef4444",
                fontWeight: 700,
                padding: "10px 10px",
              }}
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: 16, maxWidth: 1360, margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
