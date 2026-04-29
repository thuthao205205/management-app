import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#1e293b",
      color: "white",
      padding: "20px"
    }}>
      <h2>💰 Finance</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" style={{ color: "white" }}>Dashboard</Link></li>
        <li><Link to="/expenses" style={{ color: "white" }}>Chi tiêu</Link></li>
        <li><Link to="/income" style={{ color: "white" }}>Thu nhập</Link></li>
        <li><Link to="/statistics" style={{ color: "white" }}>Thống kê</Link></li>
        <li><Link to="/categories" style={{ color: "white" }}>Danh mục</Link></li>
        <li><Link to="/budget" style={{ color: "white" }}>Ngân sách</Link></li>
      </ul>
    </div>
  );
}