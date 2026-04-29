import { useState } from "react";

export default function ExpenseForm({ onClose }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

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
        <h3>Thêm chi tiêu</h3>

        <input
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Số tiền"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div style={{ marginTop: "10px" }}>
          <button onClick={onClose}>Đóng</button>
          <button>Lưu</button>
        </div>
      </div>
    </div>
  );
}