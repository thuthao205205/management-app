import Layout from "../components/layout/Layout";
import { useState } from "react";
import CategoryItem from "../components/category/CategoryItem";
import CategoryForm from "../components/category/CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Ăn uống", type: "expense" },
    { id: 2, name: "Xăng xe", type: "expense" },
    { id: 3, name: "Lương", type: "income" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("expense");

  const filtered = categories.filter(c => c.type === tab);

  return (
    <Layout>
      <h1>Danh mục</h1>

      {/* Tabs */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setTab("expense")}>Chi tiêu</button>
        <button onClick={() => setTab("income")}>Thu nhập</button>
      </div>

      {/* Add button */}
      <button onClick={() => setShowForm(true)}>
        + Thêm danh mục
      </button>

      {/* List */}
      <div style={{ marginTop: "20px" }}>
        {filtered.map((item) => (
          <CategoryItem key={item.id} item={item} />
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <CategoryForm
          onClose={() => setShowForm(false)}
          onAdd={(newItem) => setCategories([...categories, newItem])}
        />
      )}
    </Layout>
  );
}