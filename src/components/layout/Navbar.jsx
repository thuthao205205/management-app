import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "64px",
        background: "#fff",
        borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        gap: 16,
        marginLeft: "10px",
      }}
    >
      {/* Page title + date */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
        <div style={{ paddingRight: 16, borderRight: "1px solid rgba(148, 163, 184, 0.25)" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", lineHeight: 1.1 }}>
            Trang
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b" }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>📅</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {(() => {
              const d = new Date();
              return d.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            })()}
          </span>
        </div>
      </div>

      {/* System utilities */}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(37, 99, 235, 0.5)",
              background: "#2563eb",
              cursor: "pointer",
              fontWeight: 800,
              color: "#fff",
              boxShadow: "0 6px 18px rgba(37, 99, 235, 0.25)",

            }}
            aria-label="Logout"
          >
            Đăng xuất
          </button>
        )}
      </div>
    </div>
  );
}



