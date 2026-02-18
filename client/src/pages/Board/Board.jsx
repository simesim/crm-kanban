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
  createCardThunk,
  moveCardLocal,
  moveCardThunk,
  reorderColumnsLocal,
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
import CardModal from "../Card/CardModal";
import { toast } from "../../utils/toastBus";

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

  const onAddColumn = async () => {
    if (!isLead) return;
    const t = newColTitle.trim();
    if (!t) return;
    const res = await dispatch(createColumnThunk({ boardId, title: t }));
    if (res.meta.requestStatus === "fulfilled") {
      setNewColTitle("");
      toast("Column added", "ok");
    } else {
      toast(res.payload || "Failed to add column", "error");
    }
  };

  const onAddMember = async () => {
    if (!isLead) return;
    const id = memberUserId.trim();
    if (!id) return;

    setAddingMember(true);
    try {
      await addBoardMemberApi(boardId, id);
      toast("Member added", "ok");
      setMemberUserId("");
    } catch (e) {
      toast(e?.response?.data?.message || e?.message || "Failed to add member", "error");
    } finally {
      setAddingMember(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Column reorder (LEAD)
    if (type === "COLUMN") {
      if (!isLead) return;

      const next = [...(columns || [])];
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);

      dispatch(reorderColumnsLocal({ fromIndex: source.index, toIndex: destination.index }));

      const res = await dispatch(reorderColumnsThunk({ boardId, orderedIds: next.map((c) => c.id) }));
      if (res.meta.requestStatus !== "fulfilled") {
        toast(res.payload || "Reorder failed (reloading board)", "error");
        dispatch(fetchBoardThunk(boardId));
      }
      return;
    }

    // Card move
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
      toast(res.payload || "Move failed (reloading board)", "error");
      dispatch(fetchBoardThunk(boardId));
    }
  };

  const header = useMemo(() => (board ? board.title : "Board"), [board]);
  const searching = !!search.trim();

  if (loading && !board) {
    return <Spinner label="Loading board..." />;
  }

  if (error && !board) {
    return (
      <div>
        <div style={{ color: "#fb7185", fontWeight: 800 }}>Failed to load board</div>
        <div style={{ color: "#94a3b8", marginTop: 8 }}>{String(error)}</div>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => dispatch(fetchBoardThunk(boardId))}>Retry</button>
          <button style={{ marginLeft: 10 }} onClick={() => navigate("/boards")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>{header}</div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>
            {searching ? "Search mode: drag is disabled." : "Click a card to open details. Drag to move."}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
          <div style={{ width: 240 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Search</div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="title / phone / email" />
          </div>

          {isLead && (
            <>
              <div style={{ width: 220 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>New column</div>
                <input value={newColTitle} onChange={(e) => setNewColTitle(e.target.value)} placeholder="To do" />
              </div>
              <button disabled={!newColTitle.trim()} onClick={onAddColumn}>
                Add
              </button>

              <div style={{ width: 220 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Add member (userId)</div>
                <input value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)} placeholder="cuid..." />
              </div>
              <button disabled={addingMember || !memberUserId.trim()} onClick={onAddMember}>
                {addingMember ? "..." : "Invite"}
              </button>
            </>
          )}

          <button onClick={() => navigate("/boards")}>Boards</button>
        </div>
      </div>

      {loading && board && (
        <div style={{ marginBottom: 10 }}>
          <Spinner label="Syncing..." />
        </div>
      )}
      {error && board && <div style={{ color: "#fb7185", marginBottom: 10 }}>{String(error)}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 10 }}
            >
              {(columns || []).map((col, colIndex) => (
                <Draggable key={col.id} draggableId={col.id} index={colIndex} isDragDisabled={!isLead || searching}>
                  {(p) => (
                    <div ref={p.innerRef} {...p.draggableProps} style={{ ...p.draggableProps.style }}>
                      <Column
                        column={col}
                        cards={cardsByColumn[col.id] || []}
                        searching={searching}
                        search={search}
                        isLead={isLead}
                        columnDragHandleProps={p.dragHandleProps}
                        onOpenCard={(id) => dispatch(openCard(id))}
                        onAddCard={(title) => dispatch(createCardThunk({ columnId: col.id, payload: { title } }))}
                        onRename={(title) => dispatch(updateColumnThunk({ id: col.id, title }))}
                        onDelete={() => dispatch(deleteColumnThunk(col.id))}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {activeCardId && <CardModal cardId={activeCardId} onClose={() => dispatch(closeCard())} />}
    </div>
  );
}

function Column({
  column,
  cards,
  searching,
  search,
  isLead,
  columnDragHandleProps,
  onOpenCard,
  onAddCard,
  onRename,
  onDelete,
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
      toast(res.payload || "Create card failed", "error");
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
      toast(res.payload || "Rename failed", "error");
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
        border: "1px solid rgba(148,163,184,0.18)",
        background: "rgba(15,23,42,0.52)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        padding: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        {!editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              {...(isLead ? columnDragHandleProps : {})}
              title={isLead ? "Drag to reorder columns" : ""}
              style={{
                width: 22,
                height: 22,
                borderRadius: 8,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(148,163,184,0.18)",
                color: "#94a3b8",
                cursor: isLead && !searching ? "grab" : "default",
                userSelect: "none",
              }}
            >
              ⋮⋮
            </div>

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
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
              title={isLead ? "Double-click to rename" : ""}
            >
              {column.title}
              <span style={{ color: "#94a3b8", fontWeight: 600, marginLeft: 8, fontSize: 12 }}>
                ({visibleCards.length}{searching ? `/${cards.length}` : ""})
              </span>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <button onClick={saveTitle}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setAdding((v) => !v)} title="Add card">
            +
          </button>
          {isLead && (
            <button
              onClick={() => {
                const ok = window.confirm("Delete this column? (Only works if the column is empty)");
                if (!ok) return;
                Promise.resolve(onDelete()).then((res) => {
                  if (res?.meta?.requestStatus === "rejected") {
                    toast(res.payload || "Delete failed", "error");
                  } else {
                    toast("Column deleted", "ok");
                  }
                });
              }}
              title="Delete column"
              style={{ color: "#fb7185" }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {adding && (
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Card title" />
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={!newTitle.trim()} onClick={add}>
              Add card
            </button>
            <button onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <Droppable droppableId={column.id} type="CARD" isDropDisabled={searching}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "grid", gap: 10, minHeight: 20 }}>
            {visibleCards.map((card, idx) => (
              <Draggable key={card.id} draggableId={card.id} index={idx} isDragDisabled={searching}>
                {(p) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    onClick={() => onOpenCard(card.id)}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(17,24,39,0.92)",
                      cursor: "pointer",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.22)",
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
        color: "#94a3b8",
        border: "1px solid rgba(148,163,184,0.18)",
        padding: "2px 8px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      {text}
    </span>
  );
}
