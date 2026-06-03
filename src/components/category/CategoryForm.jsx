import { useEffect, useMemo, useState } from "react";

const ICONS = [
  "🍜",
  "🚗",
  "🛍️",
  "🎮",
  "📚",
  "🏥",
  "💡",
  "✈️",
  "🏠",
  "💰",
  "📦",
  "🎁",
  "☕️",
  "🍔",
  "🍕",
  "🧾",
  "🧘",
  "🏃",
  "🪴",
  "🧳",
  "🎓",
  "🧹",
  "📌",
  "🧮",
  "🖥️"
];

export default function CategoryForm({
  type,
  initialCategory,
  onClose,
  onAdd,
  onUpdate,
  existingCategories
}) {
  const isEditMode = !!initialCategory;

  const [formType, setFormType] = useState(type || "expense");
  const [name, setName] = useState(initialCategory?.name || "");
  const [icon, setIcon] = useState(initialCategory?.icon || ICONS[0]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    // Keep only non-edit sync (avoid lint complaints by computing initial state from props).
  }, [type, isEditMode]);



  const suggestions = useMemo(() => ICONS, []);

  const duplicateExists = useMemo(() => {
    if (!existingCategories) return false;
    const normalized = name.trim().toLowerCase();
    if (!normalized) return false;

    return existingCategories.some((c) => {
      if (isEditMode && c.id === initialCategory?.id) return false;
      return c.type === formType && (c.name || "").trim().toLowerCase() === normalized;
    });
  }, [existingCategories, formType, isEditMode, initialCategory?.id, name]);

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (duplicateExists) return false;
    if (!icon) return false;
    return true;
  }, [name, duplicateExists, icon]);

  const title = isEditMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới";

  const handleSave = () => {
    setTouched(true);
    if (!isValid) return;

    const payload = {
      id: initialCategory?.id,
      name: name.trim(),
      type: formType,
      icon,
      isDefault: initialCategory?.isDefault ?? false,
      transactionCount: initialCategory?.transactionCount ?? 0
    };

    if (isEditMode) onUpdate(payload);
    else onAdd(payload);

    onClose();
  };

  const deleteHint = duplicateExists ? "Đã có danh mục cùng tên cho loại này." : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
      }}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(720px, calc(100vw - 28px))",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 900
            }}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>
          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Chọn loại */}
            <div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Chọn loại</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { key: "expense", label: "Chi tiêu" },
                  { key: "income", label: "Thu nhập" }
                ].map((t) => {
                  const selected = formType === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      disabled={isEditMode}
                      onClick={() => setFormType(t.key)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 999,
                        border: selected ? "1px solid #22c55e" : "1px solid #e5e7eb",
                        background: selected ? "rgba(34,197,94,0.10)" : "#fff",
                        color: selected ? "#16a34a" : "#111827",
                        fontWeight: 900,
                        cursor: isEditMode ? "not-allowed" : "pointer",
                        opacity: isEditMode ? 0.65 : 1
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tên danh mục */}
            <div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Tên danh mục</div>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                placeholder="VD: Ăn uống, Di chuyển..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: `1px solid ${
                    touched && (!name.trim() || duplicateExists) ? "#fca5a5" : "#e5e7eb"
                  }`,
                  outline: "none"
                }}
              />
              {touched && (!name.trim() || duplicateExists) ? (
                <div style={{ marginTop: 6, color: "#dc2626", fontSize: 13, fontWeight: 700 }}>
                  {!name.trim() ? "Tên danh mục không được để trống." : deleteHint}
                </div>
              ) : null}
            </div>

            {/* Chọn icon */}
            <div>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Chọn icon</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {suggestions.map((emo) => {
                  const selected = icon === emo;
                  return (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setIcon(emo)}
                      style={{
                        height: 44,
                        borderRadius: 12,
                        border: selected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                        background: selected ? "rgba(59,130,246,0.08)" : "#fff",
                        cursor: "pointer",
                        fontSize: 20
                      }}
                      aria-label={`Chọn ${emo}`}
                    >
                      {emo}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview + actions side uses right column */}
          </div>

          {/* Preview */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Preview</div>
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: 16,
                padding: 14,
                background: "#f8fafc"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(59,130,246,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22
                  }}
                >
                  {icon}
                </div>
                <div style={{ fontWeight: 900, color: "#111827" }}>{name.trim() || "Tên danh mục"}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 900
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!isValid}
                onClick={handleSave}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #22c55e",
                  background: isValid ? "#22c55e" : "rgba(34,197,94,0.35)",
                  color: "#fff",
                  cursor: isValid ? "pointer" : "not-allowed",
                  fontWeight: 900
                }}
              >
                Lưu danh mục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

