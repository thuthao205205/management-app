export default function CategoryItem({
  item,
  onEdit,
  onDelete,
  disableDelete,
  deleteDisabledReason
}) {
  const { icon, name, isDefault, transactionCount } = item || {};

  return (
    <div
      style={{
        background: "white",
        padding: "14px 16px",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "rgba(59,130,246,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20
        }}
        aria-hidden
      >
        {icon || "📌"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800, color: "#111827" }}>{name}</div>
          {isDefault ? (
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(16,185,129,0.10)",
                color: "#059669"
              }}
            >
              Mặc định
            </span>
          ) : null}
        </div>

        <div style={{ marginTop: 4, color: "#6b7280", fontSize: 14 }}>
          {typeof transactionCount === "number" ? `${transactionCount} giao dịch` : ""}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={onEdit}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #93c5fd",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          Sửa
        </button>

        {isDefault ? null : (
          <button
            type="button"
            disabled={disableDelete}
            title={disableDelete ? deleteDisabledReason : ""}
            onClick={onDelete}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #fca5a5",
              background: disableDelete ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.12)",
              color: disableDelete ? "#ef4444" : "#dc2626",
              fontWeight: 800,
              cursor: disableDelete ? "not-allowed" : "pointer",
              opacity: disableDelete ? 0.8 : 1
            }}
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
}

