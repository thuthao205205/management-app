import Layout from "../components/layout/Layout";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getExpensesForMonthYear, getIncomesForMonthYear } from "../data/mockData";


const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const mockPieData = "Pie chart top 5 categories";


  const mockRecommendations = [
    "⚠️ Bạn đã chi nhiều cho ăn uống (30%)",
    "💡 Giảm mua sắm để tiết kiệm hơn",
    "✅ Thu nhập ổn định, tiếp tục duy trì"
  ];



  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, "0"));
  const years = ["2023", "2024", "2025"];

  const { totalIncomeLabel, totalExpenseLabel, balanceLabel, recentTransactions } = useMemo(() => {
    const incomes = getIncomesForMonthYear({ month: selectedMonth, year: selectedYear });
    const expenses = getExpensesForMonthYear({ month: selectedMonth, year: selectedYear });

    const sum = (arr) => arr.reduce((acc, it) => acc + Number(it.amount || 0), 0);
    const totalIncome = sum(incomes);
    const totalExpense = sum(expenses);
    const netBalance = totalIncome - totalExpense;

    const fmt = (n) => `${Number(n).toLocaleString("vi-VN")}đ`;
    const totalIncomeLabel = fmt(totalIncome);
    const totalExpenseLabel = fmt(totalExpense);
    const balanceLabel = fmt(netBalance);

    const tx = [...incomes.map((t) => ({ ...t, type: "income" })), ...expenses.map((t) => ({ ...t, type: "expense" }))];
    const recentTransactions = tx
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 6)
      .map((t) => ({
        icon: t.type === "income" ? "💰" : "💸",
        name: t.name,
        date: t.date ? t.date.split("-").slice(1).join("/") : "",
        amount: `${t.type === "income" ? "+" : "-"}${Number(t.amount || 0).toLocaleString("vi-VN")}đ`,
        type: t.type
      }));

    return { totalIncomeLabel, totalExpenseLabel, balanceLabel, recentTransactions };
  }, [selectedMonth, selectedYear]);


  return (
    <Layout>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#111827" }}>Dashboard</div>
          <div style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>
            Tự động cập nhật theo tháng/năm (mock)
          </div>
        </div>


        {/* Row 1: Summary Cards */}
        <div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
            <h2 style={{fontSize: "20px", fontWeight: "600", color: "#111827"}}>Tổng quan tháng {selectedMonth}/{selectedYear}</h2>
            <div style={{display: "flex", gap: "8px"}}>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                style={{padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px"}}
              >
                {months.map(m => <option key={m} value={Number(m)}>{m}</option>)}
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))} 
                style={{padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px"}}
              >
                {years.map(y => <option key={y} value={Number(y)}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <div style={{ background: "#22c55e", padding: "24px", color: "white", flex: "1", minWidth: "200px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "4px"}}>{totalIncomeLabel}</div>
              <div style={{fontSize: "14px", opacity: 0.9}}>Tổng thu tháng này</div>

            </div>
            <div style={{ background: "#ef4444", padding: "24px", color: "white", flex: "1", minWidth: "200px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "4px"}}>{totalExpenseLabel}</div>
              <div style={{fontSize: "14px", opacity: 0.9}}>Tổng chi tháng này</div>
            </div>
            <div style={{ background: "#3b82f6", padding: "24px", color: "white", flex: "1", minWidth: "200px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "4px"}}>{balanceLabel}</div>
              <div style={{fontSize: "14px", opacity: 0.9}}>Số dư</div>
            </div>


          </div>
        </div>

        {/* Row 2: Chart + Gợi ý */}
        <div style={{display: "flex", gap: "24px", flexWrap: "wrap"}}>
          <div style={{flex: "2", minWidth: "300px", background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)"}}>
            <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "16px"}}>Top 5 danh mục chi tiêu</h3>
            <div style={{height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", borderRadius: "8px", border: "2px dashed #cbd5e1"}}>
              Biểu đồ tròn (PieChart mock)
            </div>
          </div>
          <div style={{flex: "1", minWidth: "250px", background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)"}}>
            <h3 style={{fontSize: "18px", fontWeight: "600", marginBottom: "16px"}}>Gợi ý thông minh</h3>
            <ul style={{listStyle: "none", padding: 0}}>
              {mockRecommendations.map((rec, idx) => (
                <li key={idx} style={{marginBottom: "12px", padding: "12px", background: "#eff6ff", borderRadius: "8px", borderLeft: "3px solid #3b82f6"}}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 3: Giao dịch gần đây */}
        <div style={{background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", borderBottom: "1px solid #e5e7eb"}}>
            <h3 style={{fontSize: "18px", fontWeight: "600"}}>Giao dịch gần đây</h3>
            <Link to="/expenses" style={{padding: "8px 16px", background: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "6px", fontWeight: "500"}}>Xem tất cả</Link>
          </div>
          <div style={{maxHeight: "400px", overflowY: "auto"}}>
            {recentTransactions.slice(0, 6).map((trans, idx) => (

              <div key={idx} style={{display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid #f3f4f6", ":hover": {backgroundColor: "#f9fafb"}}}>
                <span style={{fontSize: "24px"}}>{trans.icon}</span>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: "500", color: "#111827"}}>{trans.name}</div>
                  <div style={{fontSize: "14px", color: "#6b7280"}}>{trans.date}</div>
                </div>
                <div style={{fontWeight: "bold", fontSize: "18px", color: trans.type === "income" ? "#059669" : "#dc2626"}}>
                  {trans.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

