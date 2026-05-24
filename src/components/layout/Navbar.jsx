import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        height: "60px",
        background: "white",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px"
      }}
    >
      <h3>Dashboard</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span>{user ? `👤 ${user.name}` : "👤 User"}</span>
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer"
            }}
          >
            Đăng xuất
          </button>
        )}
      </div>
    </div>
  );
}

