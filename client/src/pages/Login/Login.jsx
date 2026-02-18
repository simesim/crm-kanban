import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginThunk } from "../../store/auth/slice";
import { selectAuthError, selectAuthLoading, selectIsAuthed, selectUser } from "../../store/auth/selectors";
import Spinner from "../../components/UI/Spinner";
import { toast } from "../../utils/toastBus";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const authed = useSelector(selectIsAuthed);
  const user = useSelector(selectUser);

  const [email, setEmail] = useState("lead@test.com");
  const [password, setPassword] = useState("123456");

  const hint = useMemo(() => {
    const base = process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";
    return `API: ${base}`;
  }, []);

  if (authed) {
    return (
      <div style={{ maxWidth: 520, margin: "70px auto", padding: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>You’re already signed in</div>
        <div style={{ color: "#94a3b8" }}>{user?.email}</div>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => navigate("/boards")}>Go to boards</button>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginThunk({ email: email.trim(), password }));
    if (res.meta.requestStatus === "fulfilled") {
      toast("Signed in", "ok");
      navigate("/boards");
    } else {
      toast(res.payload || "Login failed", "error");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "70px auto", padding: 16 }}>
      <div
        style={{
          padding: 18,
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.18)",
          background: "rgba(15,23,42,0.62)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 6 }}>Sign in</div>
        <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 14 }}>{hint}</div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" autoComplete="email" />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
              autoComplete="current-password"
            />
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </button>

          {loading && <Spinner label="Contacting server..." />}
          {error && <div style={{ color: "#fb7185" }}>{error}</div>}
        </form>

        <hr style={{ margin: "14px 0" }} />
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
          Default credentials from your Postman collection:
          <div style={{ marginTop: 6 }}>
            <span className="kbd">lead@test.com</span> / <span className="kbd">123456</span>
          </div>
        </div>
      </div>
    </div>
  );
}
