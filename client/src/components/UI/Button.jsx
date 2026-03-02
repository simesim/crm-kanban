export default function Button({ variant = "default", style, ...props }) {
  const base = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(17,24,39,0.10)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };

  const variants = {
    default: {},
    primary: { background: "#2563eb", borderColor: "#2563eb", color: "#fff" },
    danger: { background: "#ef4444", borderColor: "#ef4444", color: "#fff" },
    ghost: { background: "transparent", border: "none" },
  };

  return <button style={{ ...base, ...variants[variant], ...style }} {...props} />;
}
