import Layout from "../components/layout/Layout";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  hasBudget,
} from "../services/budgetService";

import {
  getCategories,
} from "../services/categoryService";

import {
  getTransactions,
} from "../services/transactionService";

export default function Budget() {
  const { user } = useAuth();

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [editingBudget, setEditingBudget] =
    useState(null);

  useEffect(() => {
    if (!user) return;

    loadData();
  }, [user]);
  const loadData = async () => {
    try {
      const [
        budgetData,
        categoryData,
        transactionData,
      ] = await Promise.all([
        getBudgets(user.uid),
        getCategories(user.uid),
        getTransactions(user.uid),
      ]);

      setBudgets(budgetData);

      setCategories(
        categoryData.filter(
          (c) => c.type === "expense"
        )
      );

      setTransactions(transactionData);
    } catch (error) {
      console.error(error);
    }
  };

  const currentBudgets = useMemo(() => {
    return budgets.filter(
      (b) =>
        Number(b.month) === Number(month) &&
        Number(b.year) === Number(year)
    );
  }, [budgets, month, year]);

  const getSpentAmount = (categoryId) => {
    return transactions
      .filter((t) => {
        if (t.type !== "expense")
          return false;

        const date = new Date(
          t.transactionDate
        );

        return (
          String(t.categoryId) ===
            String(categoryId) &&
          date.getMonth() + 1 === month &&
          date.getFullYear() === year
        );
      })
      .reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0
      );
  };

const handleSave = async () => {
  if (!selectedCategory) {
    alert("Vui lòng chọn danh mục.");
    return;
  }

  if (!amount) {
    alert("Vui lòng nhập số tiền ngân sách.");
    return;
  }

  try {
    if (editingBudget) {
      await updateBudget(editingBudget.id, {
        categoryId: selectedCategory,
        amount: Number(amount),
      });

      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editingBudget.id
            ? {
                ...b,
                categoryId: selectedCategory,
                amount: Number(amount),
              }
            : b
        )
      );
    } else {
      const exists = await hasBudget(
        user.uid,
        selectedCategory,
        month,
        year
      );

      if (exists) {
        alert("Danh mục này đã có ngân sách.");
        return;
      }

      const created = await addBudget({
        uid: user.uid,
        categoryId: selectedCategory,
        month,
        year,
        amount: Number(amount),
      });

      setBudgets((prev) => [...prev, created]);
    }

    resetForm();
  } catch (error) {
    console.error(error);
    alert("Có lỗi xảy ra. Vui lòng thử lại.");
  }
};

  const handleDelete =
    async (budgetId) => {
      if (
        !window.confirm(
          "Xóa ngân sách này?"
        )
      )
        return;

      try {
        await deleteBudget(
          budgetId
        );

        setBudgets((prev) =>
          prev.filter(
            (b) =>
              b.id !== budgetId
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setSelectedCategory(
      budget.categoryId
    );
    setAmount(
      budget.amount.toString()
    );
  };

  const resetForm = () => {
    setEditingBudget(null);
    setSelectedCategory("");
    setAmount("");
  };
  const availableCategories = categories.filter((cat) => {
  // Khi đang sửa thì vẫn cho hiển thị danh mục hiện tại
  if (
    editingBudget &&
    String(cat.id) === String(editingBudget.categoryId)
  ) {
    return true;
  }

  return !currentBudgets.some(
    (budget) =>
      String(budget.categoryId) === String(cat.id)
  );
});
  
  return (
    <Layout>
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 24 }}>
          Quản lý ngân sách
        </h1>


        {/* Filter */}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <select
            value={month}
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", minWidth: "120px" }}

            onChange={(e) =>
              setMonth(
                Number(
                  e.target.value
                )
              )
            }
          >
            {Array.from(
              { length: 12 },
              (_, i) => (
                <option
                  key={i + 1}
                  value={i + 1}
                >
                  Tháng {i + 1}
                </option>
              )
            )}
          </select>

          <input
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", minWidth: "120px" }}
            type="number"
            value={year}
            onChange={(e) =>
              setYear(
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        {/* Form */}

        <div className="card" style={{ marginBottom: 24 }}>

          <h3>
            {editingBudget
              ? "Sửa ngân sách"
              : "Thêm ngân sách"}
          </h3>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 12,
            }}
          >
            <select
              className="field"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
            >

              <option value="">
                Chọn danh mục
              </option>

              {availableCategories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <input
              className="field"
              type="number"
              placeholder="Số tiền"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />


            <button
              className="btn btn-primary"
              onClick={
                handleSave
              }
            >

              {editingBudget
                ? "Cập nhật"
                : "Thêm"}
            </button>

            {editingBudget && (
              <button
                className="btn btn-secondary"
                onClick={
                  resetForm
                }
              >

                Hủy
              </button>
            )}
          </div>
        </div>

        {/* Budget List */}

        {currentBudgets.map((budget) => {
          const category = categories.find(
            (c) =>
              String(c.id) ===
              String(budget.categoryId)
          );

          const spent = getSpentAmount(
            budget.categoryId
          );

          const realPercent =
            budget.amount > 0
              ? (spent / budget.amount) * 100
              : 0;

          const progressPercent =
            Math.min(realPercent, 100);


            return (
              <div key={budget.id} className="card" style={{ marginBottom: 16 }}>

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <strong>
                    {
                      category?.icon
                    }{" "}
                    {
                      category?.name
                    }
                  </strong>

                  <div>
                    <button
                      onClick={() =>
                        handleEdit(
                          budget
                        )
                      }
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          budget.id
                        )
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  {spent.toLocaleString(
                    "vi-VN"
                  )}
                  đ /{" "}
                  {budget.amount.toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </div>

                <div
                  style={{
                    marginTop: 8,
                    height: 10,
                    background:
                      "#e5e7eb",
                    borderRadius: 999,
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height:
                        "100%",
                      background:
                        realPercent >=
                        100
                          ? "#ef4444"
                          : "#22c55e",
                      borderRadius:
                        999,
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                  }}
                >
                  {realPercent.toFixed(1)}
                  % đã sử dụng
                  {spent >
                    budget.amount && (
                    <span
                      style={{
                        color:
                          "#ef4444",
                        marginLeft: 8,
                        fontWeight:
                          "bold",
                      }}
                    >
                      ⚠ Vượt ngân
                      sách
                    </span>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </Layout>
  );
};