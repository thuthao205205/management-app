import AuthLayout from "../components/layout/AuthLayout";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <AuthLayout>
      <h3>Đăng nhập</h3>

      <input placeholder="Email" style={{ width: "100%", marginBottom: "10px" }} />
      <input placeholder="Mật khẩu" type="password" style={{ width: "100%", marginBottom: "10px" }} />

      <button style={{ width: "100%", marginBottom: "10px" }}>
        Đăng nhập
      </button>

      <button style={{ width: "100%", background: "#db4437", color: "white" }}>
        Đăng nhập với Google
      </button>

      <p style={{ marginTop: "10px" }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </AuthLayout>
  );
}