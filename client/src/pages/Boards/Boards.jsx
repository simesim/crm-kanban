import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchBoardsThunk, createBoardThunk } from "../../store/boards/slice";
import { selectRole } from "../../store/auth/selectors";
import Spinner from "../../components/UI/Spinner";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Modal from "../../components/UI/Modal";
import { toast } from "../../utils/toastBus";

export default function Boards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector(selectRole);
  const isLead = role === "LEAD";
  const { items, loading, error } = useSelector((s) => s.boards);

  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchBoardsThunk());
  }, [dispatch]);

  const create = async () => {
    const t = title.trim();
    if (!t) return;
    const res = await dispatch(createBoardThunk(t));
    if (res.meta.requestStatus === "fulfilled") {
      toast("Доска создана", "ok");
      setTitle("");
      setOpenCreate(false);
    } else {
      toast(res.payload || "Не удалось создать", "error");
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>Доски</div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Открой доску, чтобы работать с колонками и карточками.</div>
        </div>

        {isLead && (
          <Button variant="primary" onClick={() => setOpenCreate(true)}>
            + Создать доску
          </Button>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        {loading && <Spinner label="Загрузка досок..." />}
        {error && <div style={{ marginTop: 10, color: "#ef4444" }}>{String(error)}</div>}

        {!loading && (items || []).length === 0 && (
          <div style={{ marginTop: 12, color: "#6b7280" }}>
            {isLead ? "Пока нет досок. Создай первую." : "Для вашего аккаунта нет доступных досок."}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 14 }}>
          {(items || []).map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/boards/${b.id}`)}
              style={{
                textAlign: "left",
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(17,24,39,0.10)",
                background: "#fff",
                boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{b.id}</div>
            </button>
          ))}
        </div>
      </div>

      {openCreate && (
        <Modal
          title="Создать доску"
          onClose={() => setOpenCreate(false)}
          footer={
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button onClick={() => setOpenCreate(false)}>Отмена</Button>
              <Button variant="primary" disabled={!title.trim()} onClick={create}>
                Создать
              </Button>
            </div>
          }
        >
          <Input label="Название" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CRM Доска" />
        </Modal>
      )}
    </div>
  );
}
