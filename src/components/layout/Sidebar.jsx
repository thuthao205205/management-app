import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/expenses", label: "Chi tiêu", icon: "💸" },
    { path: "/income", label: "Thu nhập", icon: "💰" },
    { path: "/statistics", label: "Thống kê", icon: "📈" },
    { path: "/categories", label: "Danh mục", icon: "📂" },
    { path: "/budget", label: "Ngân sách", icon: "🎯" }
  ];

  return (
    <div style={{
      width: "240px",
      height: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* LOGO */}
      <h2 style={{ marginBottom: "30px", color: "white"}}>
        💰 Finance
      </h2>

      {/* MENU */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {menu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "white",
              background: isActive ? "#1d4ed8" : "transparent",
              transition: "0.2s"
            })}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

    </div>
  );
}