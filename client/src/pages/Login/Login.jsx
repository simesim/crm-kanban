import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginThunk } from "../../store/auth/slice";
import { selectAuthError, selectAuthLoading, selectIsAuthed, selectUser } from "../../store/auth/selectors";
import Spinner from "../../components/UI/Spinner";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
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

  if (authed) {
    return (
      <div style={{ maxWidth: 520, margin: "70px auto", padding: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Вы уже вошли</div>
        <div style={{ color: "#6b7280" }}>{user?.email}</div>
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" onClick={() => navigate("/boards")}>Перейти в CRM</Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast("Заполните email и пароль", "error");
      return;
    }

    const res = await dispatch(loginThunk({ email: email.trim(), password }));
    if (res.meta.requestStatus === "fulfilled") {
      toast("Вход выполнен", "ok");
      navigate("/boards");
    } else {
      toast(res.payload || "Не удалось войти", "error");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "70px auto", padding: 16 }}>
      <div style={{ border: "1px solid rgba(17,24,39,0.10)", borderRadius: 14, padding: 16, boxShadow: "var(--shadow)" }}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Вход</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
          API: {process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1"}
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Входим..." : "Войти"}
          </Button>

          {loading && <Spinner label="Проверяем..." />}
          {error && <div style={{ color: "#ef4444" }}>{String(error)}</div>}

          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>
            Тестовые данные:
            <div style={{ marginTop: 6 }}>
              <span className="kbd">lead@test.com</span> / <span className="kbd">123456</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
