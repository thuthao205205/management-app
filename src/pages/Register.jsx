import AuthLayout from "../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthMock } from "../hooks/useAuthMock";


export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuthMock();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = async () => {
    // mock: đăng ký thành công => đăng nhập
    const safeEmail = email || "user@example.com";
    if (password && password2 && password !== password2) return;
    await signIn({ email: safeEmail, password });
    // show feedback immediately
    alert("Đăng ký thành công! Đang đăng nhập...");
    navigate("/", { replace: true });
  };

  return (
    <AuthLayout>
      <h3>Đăng ký</h3>

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
      <input
        placeholder="Nhập lại mật khẩu"
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button
        style={{ width: "100%", marginBottom: "10px" }}
        onClick={handleRegister}
      >
        Đăng ký
      </button>

      <p>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}

