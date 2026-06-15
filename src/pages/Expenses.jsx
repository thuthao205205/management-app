import Layout from "../components/layout/Layout";
import { useMemo, useState, useEffect } from "react";
import TransactionList from "../components/transaction/TransactionList";
import TransactionForm from "../components/transaction/TransactionForm";
import { useAuth } from "../context/AuthContext";

import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from "../services/transactionService";

import {
  getCategories
} from "../services/categoryService";

export default function Expenses() {
  const { user } = useAuth();

  const [expense, setExpense] = useState([]);
  const [categories, setCategories] = useState([]);
  const now = new Date();

  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;

    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const transactionData =
        await getTransactions(user.uid);
      const categoryData =
        await getCategories(user.uid);
      setExpense(
        transactionData.filter(
          (item) => item.type === "expense"
        )
      );
      setCategories(
        categoryData.filter(
          (item) => item.type === "expense"
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const filteredExpenses = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();

    return expense.filter((item) => {
      const d = new Date(item.date || item.transactionDate);


      const expenseMonth =
        String(d.getMonth() + 1).padStart(2, "0");

      const expenseYear =
        String(d.getFullYear());

      const matchesMonth =
        !month ||
        expenseMonth === month;

      const matchesYear =
        !year ||
        expenseYear === year;

      const matchesCategory =
        !categoryId ||
        item.categoryId === categoryId;

      const matchesSearch =
        !s ||
        item.name
          ?.toLowerCase()
          .includes(s) ||
        item.note
          ?.toLowerCase()
          .includes(s);

      return (
        matchesMonth &&
        matchesYear &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    expense,
    month,
    year,
    categoryId,
    searchTerm
  ]);

  const totalAmount = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = async (newItem) => {
    try {
      const created =
        await addTransaction({
          ...newItem,
          uid: user.uid,
          type: "expense"
        });

      setExpense((prev) => [
        ...prev,
        created
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (
    updatedItem
  ) => {
    try {
      await updateTransaction(
        updatedItem.id,
        updatedItem
      );

      setExpense((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id
            ? updatedItem
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm("Xóa khoản chi này?")
    )
      return;

    try {
      await deleteTransaction(id);

      setExpense((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <Layout>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            Quản lý chi tiêu
          </h1>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="btn btn-primary"
            style={{ padding: "12px 24px", fontSize: "14px" }}
          >
            + Thêm chi tiêu
          </button>
        </div>


        {/* Filters row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", minWidth: "120px" }}
          >
            <option value="">Tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                Th {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", width: "100px" }}
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", minWidth: "140px" }}
          >
            <option value="">Danh mục</option>
            {categories
              .filter((c) => c.type === "expense")
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Tìm kiếm..."
            style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "6px", flex: 1, minWidth: "200px" }}
          />
        </div>

        {/* Total */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "16px 24px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#dc2626",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
          }}
        >
          💰 Tổng chi {month ? `Tháng ${month.padStart(2, "0")}` : "Hiện tại"}/{year}: <span style={{ fontSize: "24px" }}>{totalAmount.toLocaleString("vi-VN")}đ</span>
        </div>

        {/* List */}
        {loading ? ( 
          <p>Đang tải dữ liệu...</p>) : (
          <TransactionList
          expenses={filteredExpenses}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />)}

        {/* Modal */}
        {showForm && (
          <TransactionForm
            editingItem={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            categories={categories}
            type="expense"
          />
        )}
      </div>
    </Layout>
  );
}


