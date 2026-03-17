export default function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#6b7280" }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          border: "2px solid rgba(17,24,39,0.15)",
          borderTopColor: "rgba(37,99,235,0.85)",
          animation: "spin 1s linear infinite",
        }}
      />
      <div style={{ fontSize: 13 }}>{label || "Загрузка..."}</div>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
