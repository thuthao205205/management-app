import Layout from "../components/layout/Layout";
import { useMemo, useState } from "react";
import CategoryItem from "../components/category/CategoryItem";
import CategoryForm from "../components/category/CategoryForm";
import { EmptyState } from "../components/common/EmptyState";
import { categories as mockCategories } from "../data/mockData";

export default function Categories() {
  const [categories, setCategories] = useState(
    mockCategories.map((c) => ({
      ...c,
      transactionCount: c.isDefault ? (c.id % 2 === 0 ? 0 : 18) : 0
    }))
  );
  const [tab, setTab] = useState("expense");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const filtered = useMemo(() => {
    return categories.filter((c) => c.type === tab);
  }, [categories, tab]);

  const customFiltered = useMemo(() => {
    return filtered; // hiển thị cả mặc định và tùy chỉnh; nút Xóa xử lý theo isDefault
  }, [filtered]);


  const openAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = (newItem) => {
    setCategories((prev) => [...prev, newItem]);
  };

  const handleUpdate = (updated) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleRequestDelete = (categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  return (
    <Layout>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 2 }}>Quản lý danh mục</div>
            <div style={{ color: "#6b7280", fontSize: 14 }}>Tùy chỉnh phân loại thu nhập và chi tiêu</div>
          </div>

          <button
            type="button"
            onClick={openAdd}
            style={{
              padding: "10px 16px",
              border: "1px solid #93c5fd",
              background: "#eff6ff",
              color: "#1d4ed8",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            + Thêm danh mục
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, borderBottom: "1px solid #e5e7eb", marginBottom: 14 }}>
          {[
            { key: "expense", label: "Chi tiêu" },
            { key: "income", label: "Thu nhập" }
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                padding: "12px 4px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 800,
                color: tab === t.key ? "#0f172a" : "#6b7280",
                borderBottom: tab === t.key ? "3px solid #22c55e" : "3px solid transparent"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Danh sách danh mục */}
        <div style={{ marginTop: 18 }}>
          {customFiltered.length === 0 ? (
            <EmptyState
              title="Chưa có danh mục nào"
              buttonText="Tạo danh mục đầu tiên"
              onClick={openAdd}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {customFiltered.map((item) => {
                const canDelete = !item.isDefault && item.transactionCount === 0;
                return (
                  <CategoryItem
                    key={item.id}
                    item={item}
                    onEdit={() => openEdit(item)}
                    onDelete={() => {
                      if (!canDelete) return;
                      const ok = confirm(`Xóa danh mục ${item.name}? Thao tác này không thể hoàn tác.`);
                      if (ok) handleRequestDelete(item.id);
                    }}
                    disableDelete={!canDelete}
                    deleteDisabledReason={!canDelete ? `Còn ${item.transactionCount} giao dịch đang dùng` : ""}
                  />
                );
              })}
            </div>
          )}
        </div>


        {isModalOpen && (
          <CategoryForm
            type={tab}
            initialCategory={editingCategory}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            existingCategories={categories}
          />
        )}
      </div>
    </Layout>
  );
}

