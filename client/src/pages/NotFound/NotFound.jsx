import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 640, margin: "70px auto", padding: 16 }}>
      <div style={{ fontWeight: 900, fontSize: 28, marginBottom: 8 }}>404</div>
      <div style={{ color: "#6b7280" }}>Страница не найдена.</div>
      <div style={{ marginTop: 14 }}>
        <Link to="/boards"><Button variant="primary">Перейти в CRM</Button></Link>
      </div>
    </div>
  );
}
