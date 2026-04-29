import Layout from "../components/layout/Layout";
import { useState } from "react";
import ExpenseItem from "../components/expense/ExpenseItem";
import ExpenseForm from "../components/expense/ExpenseForm";

export default function Expenses() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Ăn uống", amount: 50000, date: "2026-04-20" },
    { id: 2, name: "Xăng xe", amount: 100000, date: "2026-04-19" }
  ]);

  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <h1>Quản lý chi tiêu</h1>

      {/* Header */}
      <button onClick={() => setShowForm(true)}>
        + Thêm chi tiêu
      </button>

      {/* Filter (UI trước) */}
      <div style={{ margin: "20px 0" }}>
        <input placeholder="Tìm kiếm..." />
      </div>

      {/* List */}
      {expenses.map((item) => (
        <ExpenseItem key={item.id} item={item} />
      ))}

      {/* Modal */}
      {showForm && (
        <ExpenseForm onClose={() => setShowForm(false)} />
      )}
    </Layout>
  );
}