import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  fetchBoardThunk,
  createColumnThunk,
  updateColumnThunk,
  deleteColumnThunk,
  reorderColumnsThunk,
  reorderColumnsLocal,
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
import { addBoardMemberApi } from "../../service/boards";
import Spinner from "../../components/UI/Spinner";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { toast } from "../../utils/toastBus";
import CardModal from "../Card/CardModal";

function matchesCard(card, qRaw) {
  const q = (qRaw || "").trim().toLowerCase();
  if (!q) return true;
  const hay = [
    card.title,
    card.description,
    card.phone,
    card.email,
    card.course,
    card.source,
  ]
    .filter(Boolean)
    .join(" | ")
    .toLowerCase();
  return hay.includes(q);
}

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
  const [search, setSearch] = useState("");

  const [memberUserId, setMemberUserId] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    dispatch(fetchBoardThunk(boardId));
  }, [dispatch, boardId]);

  const header = useMemo(() => (board ? board.title : "Доска"), [board]);

  const onAddColumn = async () => {
    if (!isLead) return;
    const t = newColTitle.trim();
    if (!t) return;
    const res = await dispatch(createColumnThunk({ boardId, title: t }));
    if (res.meta.requestStatus === "fulfilled") {
      setNewColTitle("");
      toast("Колонка добавлена", "ok");
    } else {
      toast(res.payload || "Не удалось добавить колонку", "error");
    }
  };

  const onAddMember = async () => {
    if (!isLead) return;
    const id = memberUserId.trim();
    if (!id) return;

    setAddingMember(true);
    try {
      await addBoardMemberApi(boardId, id);
      toast("Участник добавлен", "ok");
      setMemberUserId("");
    } catch (e) {
      toast(e?.response?.data?.message || e?.message || "Не удалось добавить участника", "error");
    } finally {
      setAddingMember(false);
    }
  };

  const moveColumnByButtons = async (fromIndex, toIndex) => {
    if (!isLead) return;
    if (toIndex < 0 || toIndex >= columns.length) return;

    const next = [...columns];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    dispatch(reorderColumnsLocal({ fromIndex, toIndex }));

    const res = await dispatch(reorderColumnsThunk({ boardId, orderedIds: next.map((c) => c.id) }));
    if (res.meta.requestStatus !== "fulfilled") {
      toast(res.payload || "Не удалось сохранить порядок (перезагрузка)", "error");
      dispatch(fetchBoardThunk(boardId));
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

    const res = await dispatch(moveCardThunk({ id: draggableId, toColumnId: destination.droppableId, toIndex: destination.index }));
    if (res.meta.requestStatus !== "fulfilled") {
      toast(res.payload || "Перенос не сохранился (перезагрузка)", "error");
      dispatch(fetchBoardThunk(boardId));
    }
  };

  if (loading && !board) return <Spinner label="Загрузка доски..." />;

  if (error && !board) {
    return (
      <div>
        <div style={{ color: "#ef4444", fontWeight: 900 }}>Не удалось загрузить доску</div>
        <div style={{ marginTop: 8, color: "#6b7280" }}>{String(error)}</div>
        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <Button onClick={() => dispatch(fetchBoardThunk(boardId))}>Повторить</Button>
          <Button variant="primary" onClick={() => navigate("/boards")}>Назад</Button>
        </div>
      </div>
    );
  }

  const searching = !!search.trim();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>{header}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {searching ? "Режим поиска: drag отключён" : "Перетаскиваем карточки как в Trello"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
          <div style={{ width: 240 }}>
            <Input label="Поиск" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="title / phone / email" />
          </div>

          {isLead && (
            <>
              <div style={{ width: 220 }}>
                <Input label="Новая колонка" value={newColTitle} onChange={(e) => setNewColTitle(e.target.value)} placeholder="To do" />
              </div>
              <Button variant="primary" disabled={!newColTitle.trim()} onClick={onAddColumn}>Добавить</Button>

              <div style={{ width: 220 }}>
                <Input label="Добавить участника (userId)" value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)} placeholder="cuid..." />
              </div>
              <Button disabled={addingMember || !memberUserId.trim()} onClick={onAddMember}>
                {addingMember ? "..." : "Invite"}
              </Button>
            </>
          )}

          <Button onClick={() => navigate("/boards")}>Доски</Button>
        </div>
      </div>

      {loading && board && (
        <div style={{ marginTop: 10 }}>
          <Spinner label="Синхронизация..." />
        </div>
      )}
      {error && board && <div style={{ marginTop: 10, color: "#ef4444" }}>{String(error)}</div>}

      <div style={{ marginTop: 14, overflowX: "auto", paddingBottom: 10 }}>
        <DragDropContext onDragEnd={searching ? () => {} : onDragEnd}>
          <div style={{ display: "flex", gap: 14, minHeight: 160 }}>
            {(columns || []).map((col, colIndex) => (
              <Column
                key={col.id}
                column={col}
                index={colIndex}
                isLead={isLead}
                searching={searching}
                search={search}
                cards={cardsByColumn[col.id] || []}
                onMoveLeft={() => moveColumnByButtons(colIndex, colIndex - 1)}
                onMoveRight={() => moveColumnByButtons(colIndex, colIndex + 1)}
                onRename={(title) => dispatch(updateColumnThunk({ id: col.id, title }))}
                onDelete={() => dispatch(deleteColumnThunk(col.id))}
                onAddCard={(title) => dispatch(createCardThunk({ columnId: col.id, payload: { title } }))}
                onOpenCard={(id) => dispatch(openCard(id))}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {activeCardId && <CardModal cardId={activeCardId} onClose={() => dispatch(closeCard())} />}
    </div>
  );
}

function Column({
  column,
  index,
  isLead,
  searching,
  search,
  cards,
  onMoveLeft,
  onMoveRight,
  onRename,
  onDelete,
  onAddCard,
  onOpenCard,
}) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  useEffect(() => setTitle(column.title), [column.title]);

  const visibleCards = useMemo(() => {
    if (!searching) return cards;
    return (cards || []).filter((c) => matchesCard(c, search));
  }, [cards, searching, search]);

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
      toast(res.payload || "Не удалось переименовать", "error");
      return;
    }
    setEditing(false);
    toast("Название изменено", "ok");
  };

  const del = () => {
    if (!isLead) return;
    const ok = window.confirm("Удалить колонку? Сервер удалит только пустую колонку.");
    if (!ok) return;
    Promise.resolve(onDelete()).then((res) => {
      if (res?.meta?.requestStatus === "rejected") toast(res.payload || "Не удалось удалить", "error");
      else toast("Колонка удалена", "ok");
    });
  };

  return (
    <div
      style={{
        minWidth: 320,
        maxWidth: 340,
        background: "#fff",
        border: "1px solid rgba(17,24,39,0.10)",
        borderRadius: 14,
        padding: 12,
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
        {!editing ? (
          <button
            onDoubleClick={() => isLead && setEditing(true)}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              textAlign: "left",
              cursor: "default",
              fontWeight: 900,
              fontSize: 16,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={isLead ? "Двойной клик — переименовать" : ""}
          >
            {column.title}
            <span style={{ marginLeft: 8, color: "#6b7280", fontWeight: 700, fontSize: 12 }}>
              ({visibleCards.length}{searching ? `/${cards.length}` : ""})
            </span>
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <Button variant="primary" onClick={saveTitle}>Ок</Button>
            <Button onClick={() => setEditing(false)}>X</Button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isLead && (
            <>
              <Button onClick={onMoveLeft} title="Влево" style={{ padding: "8px 10px" }}>←</Button>
              <Button onClick={onMoveRight} title="Вправо" style={{ padding: "8px 10px" }}>→</Button>
              <Button onClick={del} title="Удалить" style={{ padding: "8px 10px", color: "#ef4444" }}>✕</Button>
            </>
          )}
          <Button onClick={() => setAdding((v) => !v)} title="Добавить карточку" style={{ padding: "8px 10px" }}>+</Button>
        </div>
      </div>

      {adding && (
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Название карточки" />
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary" disabled={!newTitle.trim()} onClick={add}>Добавить</Button>
            <Button onClick={() => setAdding(false)}>Отмена</Button>
          </div>
        </div>
      )}

      <Droppable droppableId={column.id} isDropDisabled={searching}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: "grid",
              gap: 10,
              minHeight: 40,
              padding: 2,
              borderRadius: 12,
              background: snapshot.isDraggingOver ? "rgba(37,99,235,0.06)" : "transparent",
              transition: "background 120ms ease",
            }}
          >
            {visibleCards.map((card, idx) => (
              <Draggable key={card.id} draggableId={card.id} index={idx} isDragDisabled={searching}>
                {(p, s) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    onClick={() => onOpenCard(card.id)}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(17,24,39,0.10)",
                      background: "#fff",
                      boxShadow: s.isDragging ? "0 16px 40px rgba(0,0,0,0.12)" : "0 10px 20px rgba(0,0,0,0.06)",
                      cursor: searching ? "default" : "grab",
                      ...p.draggableProps.style,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{card.title}</div>
                    <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {card.phone && <Tag text={card.phone} />}
                      {card.email && <Tag text={card.email} />}
                      {card.course && <Tag text={card.course} />}
                    </div>
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
        background: "#f9fafb",
      }}
    >
      {text}
    </span>
  );
}
