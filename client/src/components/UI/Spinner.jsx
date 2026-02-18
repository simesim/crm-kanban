export default function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8" }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          border: "2px solid rgba(148,163,184,0.35)",
          borderTopColor: "rgba(96,165,250,0.95)",
          animation: "spin 1s linear infinite",
        }}
      />
      <div style={{ fontSize: 13 }}>{label || "Loading..."}</div>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
