import { lessons, week } from "./sampleLessons";

export default function Lessons() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Ведомость занятий</div>
      <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 12 }}>
        Что-то примерно такое по стилю ;)
      </div>

      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 260px)", gap: 14, minWidth: 7 * 260 }}>
          {week.map((d) => (
            <DayColumn key={d.key} day={d} items={lessons[d.key] || []} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
        Карточки занятий — пример. Если нужны картинки, то под них заложена папка.
      </div>
    </div>
  );
}

function DayColumn({ day, items }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>{day.label}</div>
      <div style={{ display: "grid", gap: 12 }}>
        {items.length === 0 && <div style={{ color: "#9ca3af", fontSize: 12 }}>Нет занятий</div>}
        {items.map((x, i) => (
          <div
            key={i}
            style={{
              border: "2px solid rgba(37,99,235,0.7)",
              borderRadius: 14,
              padding: 12,
              background: "#fff",
            }}
          >
            <div style={{ fontStyle: "italic", color: "#6b7280", marginBottom: 6 }}>{x.mode}</div>
            <div style={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>{x.title}</div>
            <div style={{ marginTop: 6, fontSize: 16 }}>{x.student}</div>
            <div style={{ marginTop: 10, fontSize: 14, color: "#111827" }}>{x.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
