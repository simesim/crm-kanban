export default function Modal({ title, children, onClose, footer }) {
  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 60,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(620px, 96vw)",
          borderRadius: 14,
          background: "#fff",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 14, borderBottom: "1px solid rgba(17,24,39,0.08)", fontWeight: 800 }}>
          {title}
        </div>
        <div style={{ padding: 14 }}>{children}</div>
        {footer && <div style={{ padding: 14, borderTop: "1px solid rgba(17,24,39,0.08)" }}>{footer}</div>}
      </div>
    </div>
  );
}
