"use client";

interface DeleteConfirmProps {
  title: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

export default function DeleteConfirm({ title, itemName, onConfirm, onCancel, loading, error }: DeleteConfirmProps) {
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--text)" }}>{itemName}</strong>? This action cannot be undone.
        </p>
        {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button
            className="btn"
            style={{ background: "var(--red)", color: "#fff", borderColor: "var(--red)" }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
