import { useState } from "react";
import { categories } from "../../data/mockData";

export default function CategoryForm({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");

  const handleAdd = () => {
    onAdd({
      id: Date.now(),
      name,
      type
    });
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        width: "300px"
      }}>
        <h3>Thêm danh mục</h3>

        <input
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

       <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        >
        <option value="">Chọn danh mục</option>

        {categories
            .filter(c => c.type === "expense")
            .map(c => (
                <option key={c.id} value={c.id}>
                    {c.name}
            </option>
        ))}
        </select>

        <div style={{ marginTop: "10px" }}>
          <button onClick={onClose}>Đóng</button>
          <button onClick={handleAdd}>Thêm</button>
        </div>
      </div>
    </div>
  );
}