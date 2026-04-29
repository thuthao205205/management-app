import Layout from "../components/layout/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1>Dashboard</h1>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ background: "#22c55e", padding: "20px", color: "white", flex: 1 }}>
          Tổng thu
        </div>

        <div style={{ background: "#ef4444", padding: "20px", color: "white", flex: 1 }}>
          Tổng chi
        </div>

        <div style={{ background: "#3b82f6", padding: "20px", color: "white", flex: 1 }}>
          Số dư
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        
        <div style={{ background: "white", padding: "20px", flex: 2 }}>
          <h3>Biểu đồ (sẽ làm sau)</h3>
        </div>

        <div style={{ background: "white", padding: "20px", flex: 1 }}>
          <h3>Gợi ý</h3>
          <p>⚠️ Bạn đã chi nhiều cho ăn uống</p>
        </div>

      </div>

      {/* Row 3 */}
      <div style={{ background: "white", padding: "20px" }}>
        <h3>Giao dịch gần đây</h3>

        <div>🍜 Ăn uống - 50k</div>
        <div>⛽ Xăng xe - 100k</div>
      </div>
    </Layout>
  );
}