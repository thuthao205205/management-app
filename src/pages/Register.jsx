import AuthLayout from "../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const isValid =
    email.trim() &&
    password.length >= 6 &&
    password === password2;

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Vui lòng nhập tên người dùng");
      return;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== password2) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");

    try {
      await register({
        username: name,
        email,
        password
      });

      navigate("/dashboard", {
        replace: true
      });

    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email đã được sử dụng");
      } else if (err.code === "auth/invalid-email") {
        setError("Email không hợp lệ");
      } else {
        setError("Đăng ký thất bại");
      }
    }
  };

  return (
    <AuthLayout>
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: "#111827"
          }}
        >
          Tạo tài khoản
        </h2>

        <p
          style={{
            marginTop: 8,
            color: "#6b7280",
            fontSize: 14
          }}
        >
          Bắt đầu quản lý tài chính cá nhân của bạn
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          type="name"
          name="name"
          autoComplete="name"
          placeholder="Tên đăng nhập"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleRegister}
          disabled={!isValid}
          style={{
            height: 46,
            border: "none",
            borderRadius: 12,
            background: isValid ? "#2563eb" : "#93c5fd",
            color: "#fff",
            fontWeight: 700,
            cursor: isValid ? "pointer" : "not-allowed"
          }}
        >
          Đăng ký
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          fontSize: 14,
          color: "#6b7280"
        }}
      >
        Đã có tài khoản?{" "}
        <Link
          to="/"
          style={{
            color: "#2563eb",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}

const inputStyle = {
  width: "100%",
  height: 46,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 14
};