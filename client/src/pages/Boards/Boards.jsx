import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchBoardsThunk, createBoardThunk } from "../../store/boards/slice";
import { selectRole } from "../../store/auth/selectors";
import Spinner from "../../components/UI/Spinner";
import { toast } from "../../utils/toastBus";

export default function Boards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector(selectRole);
  const { items, loading, error } = useSelector((s) => s.boards);

  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchBoardsThunk());
  }, [dispatch]);

  const canCreate = role === "LEAD";

  const create = async () => {
    const t = title.trim();
    if (!t) return;
    const res = await dispatch(createBoardThunk(t));
    if (res.meta.requestStatus === "fulfilled") {
      toast("Board created", "ok");
      setTitle("");
    } else {
      toast(res.payload || "Create failed", "error");
    }
  };

  const emptyText = useMemo(() => {
    if (loading) return "";
    if (items?.length) return "";
    return canCreate
      ? "No boards yet. Create your first board."
      : "No boards available for your account.";
  }, [items, loading, canCreate]);

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>Boards</div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>Select a board to open the Kanban view.</div>
        </div>

        {canCreate && (
          <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
            <div style={{ width: 280 }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>New board title</div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="CRM Доска" />
            </div>
            <button disabled={!title.trim()} onClick={create}>
              Create
            </button>
          </div>
        )}
      </div>

      {loading && <Spinner label="Loading boards..." />}
      {error && <div style={{ color: "#fb7185", marginTop: 10 }}>{String(error)}</div>}

      {emptyText && <div style={{ color: "#94a3b8", marginTop: 14 }}>{emptyText}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 14 }}>
        {(items || []).map((b) => (
          <button
            key={b.id}
            onClick={() => navigate(`/boards/${b.id}`)}
            style={{
              textAlign: "left",
              padding: 14,
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.55)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{b.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{b.id}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
