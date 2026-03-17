import { useEffect, useState } from "react";
import { onToast } from "../../utils/toastBus";

export default function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return onToast((t) => {
      const id = Math.random().toString(16).slice(2);
      setItems((s) => [...s, { id, ...t }]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), 2800);
    });
  }, []);

  if (!items.length) return null;

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, display: "grid", gap: 10, zIndex: 999 }}>
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            minWidth: 240,
            maxWidth: 420,
            padding: "10px 12px",
            borderRadius: 12,
            background: "#111827",
            color: "#fff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
            {t.type === "error" ? "Ошибка" : t.type === "ok" ? "ОК" : "Инфо"}
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
}
