import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutThunk } from "../../store/auth/slice";
import { selectUser } from "../../store/auth/selectors";
import { toast } from "../../utils/toastBus";

function TopLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: "10px 14px",
        borderRadius: 12,
        color: "#111827",
        position: "relative",
        fontWeight: 600,
        opacity: isActive ? 1 : 0.8,
      })}
    >
      {({ isActive }) => (
        <span style={{ position: "relative" }}>
          {children}
          {isActive && (
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -10,
                height: 3,
                background: "#2563eb",
                borderRadius: 999,
              }}
            />
          )}
        </span>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const enableTeacher = String(process.env.REACT_APP_ENABLE_TEACHER_PAGES || "true") === "true";

  const onLogout = async () => {
    await dispatch(logoutThunk());
    toast("Вы вышли из аккаунта", "ok");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img
              src="/assets/logo.svg"
              alt="logo"
              style={{ width: 28, height: 28, borderRadius: 8, flex: "0 0 auto" }}
            />

            <nav style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              {enableTeacher && (
                <>
                  <TopLink to="/disk">Диск</TopLink>
                  <TopLink to="/reviews">Отзывы</TopLink>
                  <TopLink to="/lessons">Уроки</TopLink>
                  <span style={{ width: 14 }} />
                </>
              )}

              <TopLink to="/boards">CRM</TopLink>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/assets/avatar.svg"
                alt="avatar"
                style={{ width: 30, height: 30, borderRadius: 999, border: "1px solid rgba(17,24,39,0.12)" }}
              />
              <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{user?.email || "Пользователь"}</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <StatBox title="проведено" value="0 часов" accent="#2563eb" />
              <StatBox title="заработано" value="0 руб" accent="#ef4444" />
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

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}

function StatBox({ title, value, accent }) {
  return (
    <div
      style={{
        border: `2px solid ${accent}`,
        borderRadius: 12,
        padding: 10,
        minWidth: 110,
        textAlign: "center",
        boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div
        style={{
          marginTop: 6,
          background: accent,
          color: "#fff",
          fontWeight: 800,
          borderRadius: 10,
          padding: "6px 10px",
        }}
      >
        {value}
      </div>
    </div>
  );
}
