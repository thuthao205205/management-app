import Layout from "../components/layout/Layout";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { expenseService } from "../services/expenseService";
import { incomeService } from "../services/incomeService";
import { alerts, categories } from "../data/mockData";


export default function Dashboard() {
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

  const years = [2024, 2025, 2026];

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

  const monthIncomes =
    incomeService.getByMonthYear(
      selectedMonth,
      selectedYear
    );

  const monthExpenses =
    expenseService.getByMonthYear(
      selectedMonth,
      selectedYear
    );

  const totalIncome = monthIncomes.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalExpense = monthExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const balance =
    totalIncome - totalExpense;

  const transactions = [
    ...monthIncomes.map((item) => ({
      ...item,
      type: "income",
    })),
    ...monthExpenses.map((item) => ({
      ...item,
      type: "expense",
    })),
  ];

  const recentTransactions =
    transactions
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 6);

  const categorySummary = {};

  monthExpenses.forEach((expense) => {
    categorySummary[expense.categoryId] =
      (categorySummary[
        expense.categoryId
      ] || 0) + expense.amount;
  });

  const topCategories =
    Object.entries(categorySummary)
      .map(
        ([categoryId, amount]) => ({
          category:
            categories.find(
              (c) =>
                c.id ===
                Number(categoryId)
            ),
          amount,
        })
      )
      .sort(
        (a, b) =>
          b.amount - a.amount
      )
      .slice(0, 5);

  return {
    totalIncome,
    totalExpense,
    balance,
    recentTransactions,
    topCategories,
  };
}, [selectedMonth, selectedYear]);

  return (
    <Layout>
      <div
        style={{
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            Tổng quan tài chính
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Theo dõi thu nhập, chi tiêu và ngân sách của bạn.
          </p>
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

            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  marginBottom: "10px",
                  padding: "12px",
                  background:
                    "#eff6ff",
                  borderRadius: "8px",
                  borderLeft:
                    "4px solid #3b82f6",
                }}
              >
                {alert.message}
              </div>
            ))}
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
                  "#3b82f6",
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