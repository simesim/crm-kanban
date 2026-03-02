export default function Input({ label, hint, ...props }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      {label && <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>}
      <input {...props} />
      {hint && <div style={{ fontSize: 12, color: "#6b7280" }}>{hint}</div>}
    </label>
  );
}
