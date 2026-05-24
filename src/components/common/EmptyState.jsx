import React from "react";

export function EmptyState({
  title,
  description,
  buttonText,
  onClick,
  icon = "📭"
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px dashed #d1d5db",
        borderRadius: 16,
        padding: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        gap: 10
      }}
    >
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{ fontWeight: 800, color: "#111827", fontSize: 16 }}>{title}</div>
      {description ? <div style={{ color: "#6b7280", fontSize: 14 }}>{description}</div> : null}
      {buttonText && onClick ? (
        <button
          type="button"
          onClick={onClick}
          style={{
            marginTop: 6,
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #93c5fd",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {buttonText}
        </button>
      ) : null}
    </div>
  );
}

