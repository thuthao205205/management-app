import AuthLayout from "../components/layout/AuthLayout";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <AuthLayout>
      <h3>Đăng ký</h3>

      <input placeholder="Email" style={{ width: "100%", marginBottom: "10px" }} />
      <input placeholder="Mật khẩu" type="password" style={{ width: "100%", marginBottom: "10px" }} />
      <input placeholder="Nhập lại mật khẩu" type="password" style={{ width: "100%", marginBottom: "10px" }} />

      <button style={{ width: "100%", marginBottom: "10px" }}>
        Đăng ký
      </button>

      <p>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}