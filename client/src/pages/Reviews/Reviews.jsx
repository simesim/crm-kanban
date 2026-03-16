export default function Reviews() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Отзывы</div>
      <div style={{ color: "#6b7280" }}>
        Заглушка. Можно подключить API и выводить отзывы родителей детей.
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              border: "1px solid rgba(17,24,39,0.10)",
              borderRadius: 14,
              padding: 14,
              background: "#fff",
              boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontWeight: 800 }}>Отзыв #{i}</div>
            <div style={{ marginTop: 6, color: "#6b7280" }}>
              "Спасибо за занятия! Очень понятное объяснение и приятный темп."
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
