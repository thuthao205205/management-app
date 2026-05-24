import AuthLayout from "../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // mock: chỉ cần email
    await signIn({ email: email || "user@example.com", password });
    //alert("Đăng nhập thành công!");
    navigate("/", { replace: true });
  };

  return (
    <AuthLayout>
      <h3>Đăng nhập</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input
        placeholder="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={handleLogin}
      >
        Đăng nhập
      </button>

      <button
        style={{ width: "100%", background: "#db4437", color: "white" }}
        onClick={() => handleLogin()}
      >
        Đăng nhập với Google
      </button>

      <p style={{ marginTop: "10px" }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>

    </AuthLayout>
  );
}

