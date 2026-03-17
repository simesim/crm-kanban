import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addCommentThunk,
  deleteCardThunk,
  deleteCommentThunk,
  fetchCardDetailsThunk,
  updateCardInBoard,
  updateCardThunk,
} from "../../store/kanban/slice";

import {
  selectActiveCard,
  selectActiveComments,
  selectActiveError,
  selectActiveLoading,
} from "../../store/kanban/selectors";

import { selectRole, selectUser } from "../../store/auth/selectors";
import Spinner from "../../components/UI/Spinner";
import Button from "../../components/UI/Button";
import { toast } from "../../utils/toastBus";

export default function CardModal({ cardId, onClose }) {
  const dispatch = useDispatch();

  const role = useSelector(selectRole);
  const user = useSelector(selectUser);

  const card = useSelector(selectActiveCard);
  const comments = useSelector(selectActiveComments);
  const loading = useSelector(selectActiveLoading);
  const error = useSelector(selectActiveError);

  const [saving, setSaving] = useState(false);
  const [commentBody, setCommentBody] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    phone: "",
    email: "",
    age: "",
    course: "",
    source: "",
  });

  const commentsBoxRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCardDetailsThunk(cardId));
  }, [dispatch, cardId]);

  useEffect(() => {
    if (!card) return;

    setForm({
      title: card.title || "",
      description: card.description || "",
      phone: card.phone || "",
      email: card.email || "",
      age: card.age ?? "",
      course: card.course || "",
      source: card.source || "",
    });
  }, [card]);

  useEffect(() => {
    if (!commentsBoxRef.current) return;
    commentsBoxRef.current.scrollTop = commentsBoxRef.current.scrollHeight;
  }, [comments.length]);

  const canDeleteAnyComment = role === "LEAD";
  const canDeleteComment = (c) => canDeleteAnyComment || c.authorId === user?.id;
  const canDeleteCard = role === "LEAD";

  const header = useMemo(() => (card ? card.title || "Карточка" : "Карточка"), [card]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() ? form.description.trim() : null,
        phone: form.phone.trim() ? form.phone.trim() : null,
        email: form.email.trim() ? form.email.trim() : null,
        age: form.age === "" ? null : Number(form.age),
        course: form.course.trim() ? form.course.trim() : null,
        source: form.source.trim() ? form.source.trim() : null,
      };

      const res = await dispatch(updateCardThunk({ id: cardId, payload }));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(updateCardInBoard(res.payload));
        toast("Сохранено", "ok");
      } else {
        toast(res.payload || "Не удалось сохранить", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const delCard = async () => {
    if (!canDeleteCard) return;
    const ok = window.confirm("Удалить карточку? Это нельзя отменить.");
    if (!ok) return;

    const res = await dispatch(deleteCardThunk(cardId));
    if (res.meta.requestStatus === "fulfilled") {
      toast("Карточка удалена", "ok");
      onClose();
    } else {
      toast(res.payload || "Не удалось удалить", "error");
    }
  };

  const addComment = async () => {
    const t = commentBody.trim();
    if (!t) return;
    const res = await dispatch(addCommentThunk({ cardId, body: t, currentUser: user }));
    if (res.meta.requestStatus === "fulfilled") {
      setCommentBody("");
      toast("Комментарий добавлен", "ok");
    } else {
      toast(res.payload || "Не удалось добавить комментарий", "error");
    }
  };

  const delComment = async (id) => {
    const ok = window.confirm("Удалить комментарий?");
    if (!ok) return;
    const res = await dispatch(deleteCommentThunk(id));
    if (res.meta.requestStatus === "fulfilled") toast("Удалено", "ok");
    else toast(res.payload || "Не удалось удалить", "error");
  };

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.28)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 80,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 96vw)",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 16,
          background: "#fff",
          border: "1px solid rgba(17,24,39,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          padding: 14,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{header}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Сзади остаётся доска, спереди — данные карточки</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button variant="primary" onClick={save} disabled={saving || loading || !form.title.trim()}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
            {canDeleteCard && (
              <Button variant="danger" onClick={delCard} disabled={loading}>
                Удалить
              </Button>
            )}
            <Button onClick={onClose}>Закрыть</Button>
          </div>
        </div>

        {(loading || error) && (
          <div style={{ marginTop: 12 }}>
            {loading && <Spinner label="Загрузка карточки..." />}
            {error && <div style={{ marginTop: 8, color: "#ef4444" }}>{String(error)}</div>}
          </div>
        )}

        {!loading && card && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 380px", gap: 14 }}>
            <section style={{ border: "1px solid rgba(17,24,39,0.10)", borderRadius: 14, padding: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Данные карточки</div>

              <Field label="Название">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>

              <Field label="Описание">
                <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Телефон">
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Возраст">
                  <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </Field>
                <Field label="Курс">
                  <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
                </Field>
              </div>

              <Field label="Источник">
                <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </Field>
            </section>

            <section
              style={{
                border: "1px solid rgba(17,24,39,0.10)",
                borderRadius: 14,
                padding: 12,
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
                gap: 10,
                minHeight: 560,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>Комментарии</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{comments.length}</div>
              </div>

              <div ref={commentsBoxRef} style={{ overflow: "auto", display: "grid", gap: 10, paddingRight: 2 }}>
                {comments.length === 0 && <div style={{ color: "#6b7280" }}>Нет комментариев.</div>}

                {comments.map((c) => (
                  <div key={c.id} style={{ border: "1px solid rgba(17,24,39,0.10)", borderRadius: 14, padding: 10, background: "#f9fafb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {c.author?.email || "unknown"}
                        {c.createdAt ? ` • ${new Date(c.createdAt).toLocaleString()}` : ""}
                      </div>
                      {canDeleteComment(c) && (
                        <Button onClick={() => delComment(c.id)} style={{ padding: "6px 8px", color: "#ef4444" }}>
                          Удалить
                        </Button>
                      )}
                    </div>
                    <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{c.body}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <textarea
                  rows={3}
                  placeholder="Написать комментарий..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                />
                <Button variant="primary" disabled={!commentBody.trim()} onClick={addComment}>
                  Отправить
                </Button>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Подсказка: <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> — отправить
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      {children}
    </label>
  );
}
