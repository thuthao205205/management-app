import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const menu = [
    { path: "/dashboard", label: "Tổng quan", icon: "📊" },
    { path: "/expenses", label: "Chi tiêu", icon: "💸" },
    { path: "/income", label: "Thu nhập", icon: "💰" },
    { path: "/statistics", label: "Báo cáo", icon: "📈" },
    { path: "/categories", label: "Danh mục", icon: "📂" },
    { path: "/budget", label: "Ngân sách", icon: "🎯" },
    { path: "/profile", label: "Hồ sơ & Cài đặt", icon: "👤" },
  ];

  const { user } = useAuth();

  const footerUser = {
    name: user?.name || "Alex Nguyen",
    avatar: user?.photoURL || "https://i.pravatar.cc/80?img=12",
    plan: "Pro Plan",
  };

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: "#0f172a",
        color: "#e2e8f0",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(59,130,246,0.18)",
              border: "1px solid rgba(59,130,246,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            💰
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.1, color: "#f8fafc" }}>
              WealthSync
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>
              Wealth Management
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                textDecoration: "none",
                color: isActive ? "#eff6ff" : "#cbd5e1",
                background: isActive ? "rgba(29,78,216,0.85)" : "transparent",
                border: isActive ? "1px solid rgba(59,130,246,0.55)" : "1px solid transparent",
                transition: "0.2s",
                fontWeight: 800,
              })}
            >
              <span style={{ width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div style={{ paddingTop: 14 }}>
        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(2,6,23,0.35)",
            padding: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={footerUser.avatar}
              alt="avatar"
              style={{ width: 36, height: 36, borderRadius: 999, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 13, color: "#e2e8f0" }}>{footerUser.name}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                {footerUser.plan}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

