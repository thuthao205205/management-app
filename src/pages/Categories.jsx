import Layout from "../components/layout/Layout";
import { useMemo, useState, useEffect} from "react";
import CategoryItem from "../components/category/CategoryItem";
import CategoryForm from "../components/category/CategoryForm";
import { EmptyState } from "../components/common/EmptyState";
import { useAuth } from "../context/AuthContext";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  createDefaultCategories
} from "../services/categoryService";
import {
  collection,
  addDoc
} from "firebase/firestore";
export default function Categories() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState("expense");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    try {
      let data = await getCategories(user.uid);

      if (data.length === 0) {
        await createDefaultCategories(user.uid);
        data = await getCategories(user.uid);
      }

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleAdd = async (
    newItem
  ) => {
    try {
      const created =
        await addCategory({
          uid: user.uid,
          name: newItem.name,
          type: newItem.type,
          icon: newItem.icon
        });

      setCategories((prev) => [
        ...prev,
        created
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (
    updated
  ) => {
    try {
      await updateCategory(
        updated.id,
        {
          name: updated.name,
          icon: updated.icon
        }
      );

      setCategories((prev) =>
        prev.map((c) =>
          c.id === updated.id
            ? updated
            : c
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestDelete =
    async (categoryId) => {
      try {
        await deleteCategory(
          categoryId
        );

        setCategories((prev) =>
          prev.filter(
            (c) => c.id !== categoryId
          )
        );
      } catch (error) {
        console.error(error);
      }
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

