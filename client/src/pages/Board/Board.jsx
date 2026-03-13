import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  fetchBoardThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
  createCardThunk,
  moveCardLocal,
  moveCardThunk,
  openCard,
  closeCard,
} from "../../store/kanban/slice";

import {
  selectBoard,
  selectColumns,
  selectCardsByColumn,
  selectKanbanLoading,
  selectKanbanError,
  selectActiveCardId,
} from "../../store/kanban/selectors";

import { selectRole } from "../../store/auth/selectors";
import Spinner from "../../components/UI/Spinner";
import CardModal from "../Card/CardModal";
import { toast } from "../../utils/toastBus";

export default function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = useSelector(selectRole);
  const isLead = role === "LEAD";

  const board = useSelector(selectBoard);
  const columns = useSelector(selectColumns);
  const cardsByColumn = useSelector(selectCardsByColumn);
  const loading = useSelector(selectKanbanLoading);
  const error = useSelector(selectKanbanError);
  const activeCardId = useSelector(selectActiveCardId);

  const [newColTitle, setNewColTitle] = useState("");

  useEffect(() => {
    dispatch(fetchBoardThunk(boardId));
  }, [dispatch, boardId]);

  const onAddColumn = async () => {
    if (!isLead) return;
    const t = newColTitle.trim();
    if (!t) return;
    const res = await dispatch(createColumnThunk({ boardId, title: t }));
    if (res.meta.requestStatus === "fulfilled") {
      setNewColTitle("");
      toast("Столбец добавлен", "ok");
    } else {
      toast(res.payload || "Не удалось добавить столбец", "error");
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    dispatch(
      moveCardLocal({
        cardId: draggableId,
        fromColumnId: source.droppableId,
        toColumnId: destination.droppableId,
        toIndex: destination.index,
      })
    );

    const res = await dispatch(
      moveCardThunk({
        id: draggableId,
        toColumnId: destination.droppableId,
        toIndex: destination.index,
      })
    );

    if (res.meta.requestStatus !== "fulfilled") {
      toast(res.payload || "Не удалось перенести карточку", "error");
      dispatch(fetchBoardThunk(boardId));
    }
  };

  const header = useMemo(() => (board ? board.title : "Доска"), [board]);

  if (loading && !board) return <Spinner label="Загрузка доски..." />;

  if (error && !board) {
    return (
      <div>
        <div style={{ color: "#ef4444", fontWeight: 800 }}>Не удалось загрузить доску</div>
        <div style={{ color: "#6b7280", marginTop: 8 }}>{String(error)}</div>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => dispatch(fetchBoardThunk(boardId))}>Повторить</button>
          <button style={{ marginLeft: 10 }} onClick={() => navigate("/boards")}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>{header}</div>
          <div style={{ color: "#6b7280", fontSize: 12 }}>
            Столбцы и карточки как в Trello. Клик по карточке — подробности и комментарии.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
          {isLead && (
            <>
              <div style={{ width: 220 }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Новый столбец</div>
                <input value={newColTitle} onChange={(e) => setNewColTitle(e.target.value)} placeholder="Новый столбец" />
              </div>
              <button disabled={!newColTitle.trim()} onClick={onAddColumn}>
                Добавить
              </button>
            </>
          )}

          <button onClick={() => navigate("/boards")}>К доскам</button>
        </div>
      </div>

      {loading && board && (
        <div style={{ marginBottom: 10 }}>
          <Spinner label="Обновление..." />
        </div>
      )}
      {error && board && <div style={{ color: "#ef4444", marginBottom: 10 }}>{String(error)}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10 }}>
          {(columns || []).map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsByColumn[col.id] || []}
              isLead={isLead}
              onOpenCard={(id) => dispatch(openCard(id))}
              onAddCard={(title) => dispatch(createCardThunk({ columnId: col.id, payload: { title } }))}
              onRename={(title) => dispatch(updateColumnThunk({ id: col.id, title }))}
              onDelete={() => dispatch(deleteColumnThunk(col.id))}
            />
          ))}
        </div>
      </DragDropContext>

      {activeCardId && <CardModal cardId={activeCardId} onClose={() => dispatch(closeCard())} />}
    </div>
  );
}

function Column({ column, cards, isLead, onOpenCard, onAddCard, onRename, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  useEffect(() => setTitle(column.title), [column.title]);

  const add = async () => {
    const t = newTitle.trim();
    if (!t) return;
    const res = await onAddCard(t);
    if (res?.meta?.requestStatus === "rejected") {
      toast(res.payload || "Не удалось создать карточку", "error");
      return;
    }
    setNewTitle("");
    setAdding(false);
  };

  const saveTitle = async () => {
    if (!isLead) return;
    const t = title.trim();
    if (!t) return;
    const res = await onRename(t);
    if (res?.meta?.requestStatus === "rejected") {
      toast(res.payload || "Не удалось переименовать столбец", "error");
      return;
    }
    setEditing(false);
  };

  return (
    <div
      style={{
        minWidth: 300,
        maxWidth: 320,
        borderRadius: 16,
        border: "1px solid rgba(17,24,39,0.10)",
        background: "#fff",
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
        padding: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        {!editing ? (
          <button
            onDoubleClick={() => {
              if (isLead) setEditing(true);
            }}
            style={{
              textAlign: "left",
              padding: 0,
              border: "none",
              background: "transparent",
              fontWeight: 900,
              fontSize: 14,
              cursor: "default",
            }}
            title={isLead ? "Двойной клик — переименовать" : ""}
          >
            {column.title}
            <span style={{ color: "#6b7280", fontWeight: 600, marginLeft: 8, fontSize: 12 }}>({cards.length})</span>
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <button onClick={saveTitle}>OK</button>
            <button onClick={() => setEditing(false)}>✕</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setAdding((v) => !v)} title="Добавить карточку">
            +
          </button>
          {isLead && (
            <button
              onClick={() => {
                const ok = window.confirm("Удалить столбец? Если в нем есть карточки, сервер не даст это сделать.");
                if (!ok) return;
                Promise.resolve(onDelete()).then((res) => {
                  if (res?.meta?.requestStatus === "rejected") {
                    toast(res.payload || "Не удалось удалить столбец", "error");
                  } else {
                    toast("Столбец удалён", "ok");
                  }
                });
              }}
              title="Удалить столбец"
              style={{ color: "#ef4444" }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {adding && (
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Название карточки" />
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={!newTitle.trim()} onClick={add}>
              Добавить
            </button>
            <button onClick={() => setAdding(false)}>Отмена</button>
          </div>
        </div>
      )}

      <Droppable droppableId={column.id} type="CARD">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "grid", gap: 10, minHeight: 20 }}>
            {cards.map((card, idx) => (
              <Draggable key={card.id} draggableId={card.id} index={idx}>
                {(p) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    onClick={() => onOpenCard(card.id)}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(17,24,39,0.10)",
                      background: "#f9fafb",
                      cursor: "pointer",
                      ...p.draggableProps.style,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{card.title}</div>
                    {(card.phone || card.email || card.course) && (
                      <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {card.phone && <Tag text={card.phone} />}
                        {card.email && <Tag text={card.email} />}
                        {card.course && <Tag text={card.course} />}
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function Tag({ text }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#6b7280",
        border: "1px solid rgba(17,24,39,0.10)",
        padding: "2px 8px",
        borderRadius: 999,
        background: "#fff",
      }}
    >
      {text}
    </span>
  );
}
