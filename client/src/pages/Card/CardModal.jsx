import { useEffect, useMemo, useState } from "react";
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

  const canDeleteAnyComment = role === "LEAD";
  const canDeleteComment = (c) => canDeleteAnyComment || c.authorId === user?.id;
  const canDeleteCard = role === "LEAD";

  const header = useMemo(() => {
    if (!card) return "Card";
    return card.title || "Card";
  }, [card]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        phone: form.phone || null,
        email: form.email || null,
        age: form.age === "" ? null : Number(form.age),
        course: form.course || null,
        source: form.source || null,
      };

      const res = await dispatch(updateCardThunk({ id: cardId, payload }));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(updateCardInBoard(res.payload));
        toast("Saved", "ok");
      } else {
        toast(res.payload || "Save failed", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const addComment = async () => {
    const t = commentBody.trim();
    if (!t) return;
    const res = await dispatch(addCommentThunk({ cardId, body: t, currentUser: user }));
    if (res.meta.requestStatus === "fulfilled") {
      setCommentBody("");
      toast("Comment added", "ok");
    } else {
      toast(res.payload || "Comment failed", "error");
    }
  };

  const delComment = async (id) => {
    const ok = window.confirm("Delete this comment?");
    if (!ok) return;
    const res = await dispatch(deleteCommentThunk(id));
    if (res.meta.requestStatus === "fulfilled") toast("Deleted", "ok");
    else toast(res.payload || "Delete failed", "error");
  };

  const delCard = async () => {
    const ok = window.confirm("Delete this card? This cannot be undone.");
    if (!ok) return;

    const res = await dispatch(deleteCardThunk(cardId));
    if (res.meta.requestStatus === "fulfilled") {
      toast("Card deleted", "ok");
      onClose();
    } else {
      toast(res.payload || "Delete failed", "error");
    }
  };

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 96vw)",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 18,
          border: "1px solid rgba(148,163,184,0.18)",
          background: "rgba(15,23,42,0.78)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
          backdropFilter: "blur(12px)",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{header}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Esc / click outside to close</div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={save} disabled={saving || loading || !form.title.trim()}>
              {saving ? "Saving..." : "Save"}
            </button>
            {canDeleteCard && (
              <button onClick={delCard} style={{ color: "#fb7185" }} disabled={loading}>
                Delete
              </button>
            )}
            <button onClick={onClose}>Close</button>
          </div>
        </div>

        {(loading || error) && (
          <div style={{ marginTop: 12 }}>
            {loading && <Spinner label="Loading card..." />}
            {error && <div style={{ marginTop: 8, color: "#fb7185" }}>{String(error)}</div>}
          </div>
        )}

        {!loading && card && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>
            <section style={{
              padding: 12,
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(17,24,39,0.75)",
            }}>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Card details</div>

              <Field label="Title">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>

              <Field label="Description">
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Phone">
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Age">
                  <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </Field>
                <Field label="Course">
                  <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
                </Field>
              </div>

              <Field label="Source">
                <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
              </Field>

              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
                Tip: use <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> to submit a comment.
              </div>
            </section>

            <section style={{
              padding: 12,
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(17,24,39,0.75)",
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              gap: 10,
              minHeight: 520,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>Comments</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{comments.length}</div>
              </div>

              <div style={{ overflow: "auto", display: "grid", gap: 10, paddingRight: 2 }}>
                {comments.length === 0 && <div style={{ color: "#94a3b8" }}>No comments yet.</div>}

                {comments.map((c) => (
                  <div key={c.id} style={{
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: 14,
                    padding: 10,
                    background: "rgba(255,255,255,0.03)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        {c.author?.email || "unknown"}
                        {c.createdAt ? ` • ${new Date(c.createdAt).toLocaleString()}` : ""}
                      </div>
                      {canDeleteComment(c) && (
                        <button onClick={() => delComment(c.id)} style={{ padding: "6px 8px", color: "#fb7185" }}>
                          Delete
                        </button>
                      )}
                    </div>
                    <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{c.body}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <textarea
                  rows={3}
                  placeholder="Write a comment..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                />
                <button disabled={!commentBody.trim()} onClick={addComment}>
                  Add comment
                </button>
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
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{label}</div>
      {children}
    </label>
  );
}
