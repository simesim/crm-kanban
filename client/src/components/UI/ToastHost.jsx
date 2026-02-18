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
    <div style={{ position: "fixed", right: 16, bottom: 16, display: "grid", gap: 10, zIndex: 100 }}>
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            minWidth: 240,
            maxWidth: 420,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(17,24,39,0.92)",
            border: "1px solid rgba(148,163,184,0.22)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
            {t.type === "error" ? "Error" : t.type === "ok" ? "OK" : "Info"}
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{t.message}</div>
        </div>
      ))}
    </div>
  );
}
