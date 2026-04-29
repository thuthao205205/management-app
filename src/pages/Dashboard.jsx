import Layout from "../components/layout/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Hardcoded data for UI demo
  const mockSummary = {
    thu: "10,000,000đ",
    chi: "7,000,000đ",
    du: "3,000,000đ"
  };

  const mockPieData = "Pie chart top 5 categories";

  const mockRecommendations = [
    "⚠️ Bạn đã chi nhiều cho ăn uống (30%)",
    "💡 Giảm mua sắm để tiết kiệm hơn",
    "✅ Thu nhập ổn định, tiếp tục duy trì"
  ];

  const mockRecentTransactions = [
    { icon: "🍜", name: "Ăn quán", date: "15/11", amount: "-150,000đ", type: "expense" },
    { icon: "💰", name: "Lương tháng 11", date: "01/11", amount: "+5,000,000đ", type: "income" },
    { icon: "⛽", name: "Xăng xe", date: "14/11", amount: "-200,000đ", type: "expense" },
    { icon: "🛒", name: "Mua sắm Shopee", date: "13/11", amount: "-450,000đ", type: "expense" },
    { icon: "💸", name: "Thuê nhà", date: "10/11", amount: "-2,000,000đ", type: "expense" },
    { icon: "📚", name: "Freelance", date: "12/11", amount: "+1,200,000đ", type: "income" }
  ];

  const months = Array.from({length: 12}, (_, i) => `${i+1}`.padStart(2, '0'));
  const years = ["2023", "2024", "2025"];

  return (
    <Layout>
      <div style={{padding: "24px", maxWidth: "1200px", margin: "0 auto"}}>
        <h1 style={{fontSize: "28px", fontWeight: "bold", marginBottom: "24px", color: "#111827"}}>Dashboard</h1>

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
              <div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "4px"}}>{mockSummary.thu}</div>
              <div style={{fontSize: "14px", opacity: 0.9}}>Tổng thu tháng này</div>
            </div>
            <div style={{ background: "#ef4444", padding: "24px", color: "white", flex: "1", minWidth: "200px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "4px"}}>{mockSummary.chi}</div>
              <div style={{fontSize: "14px", opacity: 0.9}}>Tổng chi tháng này</div>
            </div>
            <div style={{ background: "#3b82f6", padding: "24px", color: "white", flex: "1", minWidth: "200px", borderRadius: "12px", textAlign: "center" }}>
              <div style={{fontSize: "24px", fontWeight: "bold", marginBottom: "4px"}}>{mockSummary.du}</div>
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
            {mockRecentTransactions.slice(0, 6).map((trans, idx) => (
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

