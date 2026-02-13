import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchBoardsThunk, createBoardThunk } from "../../store/boards/thunks";
import {
  selectBoards,
  selectBoardsLoading,
  selectBoardsError,
} from "../../store/boards/selectors";

export default function Boards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectBoards);
  const loading = useSelector(selectBoardsLoading);
  const error = useSelector(selectBoardsError);

  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchBoardsThunk());
  }, [dispatch]);

  const create = async () => {
    const t = title.trim();
    if (!t) return;
    await dispatch(createBoardThunk(t));
    setTitle("");
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: 12 }}>Boards</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={create}>Create</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {!loading && items.length === 0 && <div>No boards yet.</div>}

      <div style={{ display: "grid", gap: 8 }}>
        {items.map((b) => (
          <div
            key={b.id}
            onClick={() => navigate(`/boards/${b.id}`)}
            style={{
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 600 }}>{b.title}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{b.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
