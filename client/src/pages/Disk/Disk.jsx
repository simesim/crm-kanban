export default function Disk() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Диск</div>
      <div style={{ color: "#6b7280" }}>
        Заглушка. Здесь можно хранить ссылки на файлы/материалы компании.
      </div>
      <ul style={{ marginTop: 12, lineHeight: 1.9 }}>
        <li>по /assets/company-rules.pdf</li>
        <li>Ссылка на Google Drive</li>
        <li>Шаблоны отчётов</li>
      </ul>
    </div>
  );
}
