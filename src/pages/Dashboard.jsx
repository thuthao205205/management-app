import Layout from "../components/layout/Layout";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { getTransactions } from "../services/transactionService";
import { getCategories, createDefaultCategories } from "../services/categoryService";
import { getBudgets } from "../services/budgetService";
import { generateRecommendations } from "../services/recommendationService";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const [transactionData, categoryData, budgetData] = 
      await Promise.all([
        getTransactions(user.uid),
        getCategories(user.uid),
        getBudgets(user.uid)
      ]);

      // Ensure default categories exist for new users
      if (categoryData.length === 0) {
        await createDefaultCategories(user.uid);
      }

      const finalCategories =
        categoryData.length === 0
          ? await getCategories(user.uid)
          : categoryData;

      setTransactions(transactionData);
      setCategories(finalCategories);
      setBudgets(budgetData);
    };

    loadData();
  }, [user]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const months = Array.from(
    { length: 12 },
    (_, i) => i + 1
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 5 },
    (_, i) => currentYear - 2 + i
  );

  const formatMoney = (amount) => {
    return amount.toLocaleString("vi-VN") + " đ";
  };
  const {
    totalIncome,
    totalExpense,
    balance,
    recentTransactions,
    topCategories,
  } = useMemo(() => {
    const monthIncomes = transactions.filter((item) => {
      if (item.type !== "income") return false;

      const date = new Date(item.transactionDate);
      if (Number.isNaN(date.getTime())) return false;

      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  const monthExpenses = transactions.filter((item) => {
    if (item.type !== "expense") return false;

    const date = new Date(item.transactionDate);
    if (Number.isNaN(date.getTime())) return false;

    return (
      date.getMonth() + 1 === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });

  const totalIncome = monthIncomes.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalExpense = monthExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const balance = totalIncome - totalExpense;

  // Avoid TDZ: don't redeclare `transactions` inside this memo.
  const monthTransactions = [
    ...monthIncomes.map((item) => ({
      ...item,
      type: "income",
    })),
    ...monthExpenses.map((item) => ({
      ...item,
      type: "expense",
    })),
  ];

  const recentTransactions = monthTransactions
    .sort((a, b) => {
      const da = new Date(a.transactionDate).getTime();
      const db = new Date(b.transactionDate).getTime();
      return db - da;
    })
    .slice(0, 6);

  const categorySummary = {};
  monthExpenses.forEach((expense) => {
    categorySummary[expense.categoryId] =
      (categorySummary[expense.categoryId] || 0) + expense.amount;
  });

  const topCategories = Object.entries(categorySummary)
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => String(c.id) === String(categoryId));
      return { category, amount };
    })
    .filter((x) => x.category)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome,
    totalExpense,
    balance,
    recentTransactions,
    topCategories,
  };
}, [transactions, categories, selectedMonth, selectedYear]);
const currentMonthIncome = totalIncome;
const currentMonthExpense = totalExpense;
const lastMonthData = useMemo(() => {
  let month = selectedMonth - 1;
  let year = selectedYear;

  if (month === 0) {
    month = 12;
    year--;
  }

  const lastMonthTransactions =
    transactions.filter((t) => {
      const d = new Date(
        t.transactionDate
      );

      return (
        d.getMonth() + 1 === month &&
        d.getFullYear() === year
      );
    });

  const income =
    lastMonthTransactions
      .filter(
        (t) => t.type === "income"
      )
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      );

  const expense =
    lastMonthTransactions
      .filter(
        (t) => t.type === "expense"
      )
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      );

  return {
    income,
    expense
  };
}, [
  transactions,
  selectedMonth,
  selectedYear
]);

  const report = useMemo(() => {
    const savingRate =
      totalIncome > 0
        ? (balance / totalIncome) * 100
        : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      savingRate,
    };
  }, [totalIncome, totalExpense, balance]);
  const categoryStats = useMemo(() => {
    return topCategories.map(
      ({ category, amount }) => ({
        name: category.name,
        amount,
        percent:
          totalExpense > 0
            ? (amount / totalExpense) * 100
            : 0,
      })
    );
  }, [topCategories, totalExpense]);
  const currentBudgets = budgets.filter(
    (b) =>
      b.month === selectedMonth &&
      b.year === selectedYear
  );
  const budgetStats = useMemo(() => {
    return currentBudgets.map((budget) => {
      const spent = transactions
        .filter((t) => {
          const d = new Date(
            t.transactionDate
          );

          return (
            t.type === "expense" &&
            t.categoryId === budget.categoryId &&
            d.getMonth() + 1 === budget.month &&
            d.getFullYear() === budget.year
          );
        })
        .reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

      const category = categories.find(
        (c) => c.id === budget.categoryId
      );

      return {
        ...budget,
        spent,
        categoryName:
          category?.name || "",
        usageRate:
          budget.amount > 0
            ? (spent / budget.amount) * 100
            : 0,
      };
    });
  }, [currentBudgets, transactions, categories]);
  
  const recommendations = useMemo(
    () =>
      generateRecommendations({
        budgets: budgetStats,
        report,
        categoryStats,
      }),
    [budgetStats, report, categoryStats, currentMonthIncome, currentMonthExpense, lastMonthData]
  );

  return (
    <Layout>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 className="page-title">Tổng quan tài chính</h1>
          <p className="page-subtitle">Theo dõi thu nhập, chi tiêu và ngân sách của bạn.</p>
        </div>


        {/* Bộ chọn tháng năm */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <select
            style={{
              textDecoration:
                  "none",
              color: "black",
              background:
                  "#eee",
                padding:
                  "8px 16px",
                borderRadius:
                  "6px",
            }}
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                Number(e.target.value)
              )
            }
          >
            {months.map((month) => (
              <option
                key={month}
                value={month}
              >
                Tháng {month}
              </option>
            ))}
          </select>

          <select
            style={{
              textDecoration:"none",
              color: "black",
              background:
                  "#eee",
                padding:
                  "8px 16px",
                borderRadius:
                  "6px",
            }}
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                Number(e.target.value)
              )
            }
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#22c55e",
              color: "white",
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            <h3>Tổng thu</h3>
            <h2>{formatMoney(totalIncome)}</h2>
          </div>

          <div
            style={{
              background: "#ef4444",
              color: "white",
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            <h3>Tổng chi</h3>
            <h2>{formatMoney(totalExpense)}</h2>
          </div>

          <div
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "24px",
              borderRadius: "12px",
            }}
          >
            <h3>Số dư</h3>
            <h2>{formatMoney(balance)}</h2>
          </div>
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Top Categories */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
              }}
            >
              Top 5 danh mục chi tiêu
            </h3>

            {topCategories.length === 0 ? (
              <p>
                Chưa có dữ liệu chi tiêu
              </p>
            ) : (
              topCategories.map((item) => (
                <div
                  key={item.category.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    padding: "10px 0",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <span>
                    {item.category.icon}{" "}
                    {item.category.name}
                  </span>

                  <strong>
                    {formatMoney(item.amount)}
                  </strong>
                </div>
              ))
            )}
          </div>

          {/* Alerts */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
              }}
            >
              Gợi ý thông minh
            </h3>
            {recommendations.length === 0 ? (
              <p
                style={{
                  color: "#6b7280",
                }}
              >
                Chưa có gợi ý nào.
              </p>
            ) : (
              recommendations.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      background:
                        item.type ===
                        "danger"
                          ? "#fef2f2"
                          : item.type ===
                            "warning"
                          ? "#fffbeb"
                          : item.type ===
                            "success"
                          ? "#f0fdf4"
                          : "#eff6ff",
                      border:
                        item.type ===
                        "danger"
                          ? "1px solid #fecaca"
                          : item.type ===
                            "warning"
                          ? "1px solid #fde68a"
                          : item.type ===
                            "success"
                          ? "1px solid #bbf7d0"
                          : "1px solid #bfdbfe",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        color: "#4b5563",
                      }}
                    >
                      {item.message}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "20px",
              borderBottom:
                "1px solid #eee",
            }}
          >
            <h3>
              Giao dịch gần đây
            </h3>

            <Link
              to="/expenses"
              style={{
                textDecoration:
                  "none",
                color: "white",
                background:
                  "#2563eb",
                padding:
                  "8px 16px",
                borderRadius:
                  "6px",
              }}
            >
              Xem tất cả
            </Link>
          </div>

          {recentTransactions.length ===
          0 ? (
            <p
              style={{
                padding: "20px",
              }}
            >
              Chưa có giao dịch.
            </p>
          ) : (
            recentTransactions.map(
              (transaction) => (
                <div
                  key={
                    transaction.id
                  }
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding:
                      "16px 20px",
                    borderBottom:
                      "1px solid #f3f4f6",
                  }}
                >
                  <div>
                    <div>
                      {transaction.type ===
                      "income"
                        ? "💰"
                        : "💸"}{" "}
                      {
                        transaction.name
                      }
                    </div>

                    <small
                      style={{
                        color:
                          "#6b7280",
                      }}
                    >
                      {
                        transaction.date
                      }
                    </small>
                  </div>

                  <div
                    style={{
                      fontWeight:
                        "bold",
                      color:
                        transaction.type ===
                        "income"
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >
                    {transaction.type ===
                    "income"
                      ? "+"
                      : "-"}
                    {formatMoney(
                      transaction.amount
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </Layout>
  );
}