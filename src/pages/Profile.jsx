import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/authService";

function abbreviateName(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  const first = parts[0]?.[0] || "?";
  const second = parts.length > 1 ? parts[1]?.[0] : (parts[0]?.[1] || "?");
  return (first + second).toUpperCase();
}

function isValidPassword(pw) {
  return typeof pw === "string" && pw.length >= 6;
}

function passwordStrength(pw) {
  if (!pw) return { label: "Yếu", color: "#ef4444" };
  if (pw.length < 6) return { label: "Yếu", color: "#ef4444" };
  const hasNumber = /\d/.test(pw);
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const score = [hasNumber, hasLetter, hasSymbol].filter(Boolean).length;
  if (pw.length >= 10 && score >= 2) return { label: "Mạnh", color: "#22c55e" };
  if (score >= 2) return { label: "Trung bình", color: "#f59e0b" };
  return { label: "Yếu", color: "#ef4444" };
}

function formatDateByPattern(date, pattern) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  if (pattern === "DD/MM/YYYY") return `${dd}/${mm}/${yyyy}`;
  return `${mm}/${dd}/${yyyy}`;
}

export default function Profile() {
  const { user: authUser, logout, loading } = useAuth();
  if (loading) {
    return (
      <Layout>
        <div>Đang tải...</div>
      </Layout>
    );
  }
  console.log(authUser);
  const baseUser = useMemo(() => ({
    name: authUser?.username || "",
    email: authUser?.email || "",
    memberSince: "",
    photoURL: authUser?.photoURL || ""
  }), [authUser]);

  const [displayName, setDisplayName] = useState(baseUser.name);
  const [photoURL, setPhotoURL] = useState(baseUser.photoURL);

  const [savedName, setSavedName] = useState(baseUser.name);
  const [savedPhotoURL, setSavedPhotoURL] = useState(baseUser.photoURL);

  useEffect(() => {
    if (authUser) {
      setDisplayName(authUser.username || "");
      setSavedName(authUser.username || "");

      setPhotoURL(authUser.photoURL || "");
      setSavedPhotoURL(authUser.photoURL || "");
    }
  }, [authUser]);

  const nameChanged = displayName.trim() !== savedName;
  const avatarChanged = (photoURL || "") !== (savedPhotoURL || "");
  const infoDirty = nameChanged || avatarChanged;

  // Bảo mật (ẩn nếu user đăng nhập Google)
  const isGoogleUser = Boolean(authUser?.providerId === "google.com");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = passwordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = Boolean(confirmPassword) && !passwordsMatch;

  const canChangePassword = !isGoogleUser &&
    currentPassword.length > 0 &&
    isValidPassword(newPassword) &&
    passwordsMatch;

  const onSaveInfo = async () => {
    try {
      await updateUserProfile({
        displayName,
        photoURL
      });

      setSavedName(displayName);
      setSavedPhotoURL(photoURL);

      alert("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  const fileInputRef = useRef(null);

  const onPickAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Demo: dùng URL.createObjectURL để preview (không upload Firebase Storage do dự án hiện tại đang dùng mockAuth)
    // Nếu có Firebase Storage thật, thay bằng: uploadBytes -> getDownloadURL -> setPhotoURL(url)
    const localUrl = URL.createObjectURL(file);
    setPhotoURL(localUrl);
  };

  // Tùy chọn hiển thị
  const [currency, setCurrency] = useState("VNĐ");
  const [monthStartDay, setMonthStartDay] = useState(1);
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [savedCurrency, setSavedCurrency] = useState("VNĐ");
  const [savedMonthStartDay, setSavedMonthStartDay] = useState(1);
  const [savedDateFormat, setSavedDateFormat] = useState("DD/MM/YYYY");

  const optionsDirty =
    currency !== savedCurrency ||
    monthStartDay !== savedMonthStartDay ||
    dateFormat !== savedDateFormat;

  const onSaveOptions = () => {
    if (!optionsDirty) return;
    setSavedCurrency(currency);
    setSavedMonthStartDay(monthStartDay);
    setSavedDateFormat(dateFormat);
    // Demo: không propagate ra toàn app
  };

  // Xuất dữ liệu / xóa tài khoản (demo)
  const onExportData = () => {
    // Demo: tạo JSON CSV giả từ mock
    const payload = {
      exportedAt: new Date().toISOString(),
      user: {
        name: savedName,
        email: baseUser.email,
      },
      notes: "Demo export. Tích hợp Firestore/CSV thực tế cần bổ sung mapping dữ liệu thu/chi.",
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "profile-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const canDelete = deleteConfirmEmail.trim().toLowerCase() === (baseUser.email || "").toLowerCase();

  const onDeleteAccount = async () => {
    if (!canDelete) return;
    // Demo: chỉ logout
    setDeleteDialogOpen(false);
    setDeleteConfirmEmail("");
    await logout();
  };

  // Sidebar/Topbar title theo yêu cầu
  return (
    <Layout>
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 className="page-title" style={{ fontSize: 24, marginBottom: 24 }}>
          Hồ sơ & Cài đặt
        </h1>

        {/* Card base style */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 2. Thông tin cá nhân */}
          <section
            style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: photoURL ? "transparent" : "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ color: "#1d4ed8", fontWeight: 800, fontSize: 18 }}>
                        {abbreviateName(displayName)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      marginTop: 10,
                      background: "#f1f5f9",
                      color: "#0f172a",
                      border: "1px solid #e2e8f0",
                      padding: "6px 10px",
                      borderRadius: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Đổi ảnh
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={onPickAvatar}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                    Thông tin cá nhân
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                    Cập nhật tên hiển thị, ảnh đại diện.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>Tên hiển thị</span>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    type="text"
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: 14,
                    }}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>Email</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                      value={baseUser.email}
                      disabled
                      title="Email không thể thay đổi"
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: 14,
                        background: "#f3f4f6",
                        color: "#6b7280",
                        cursor: "not-allowed",
                      }}
                    />
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Email không thể thay đổi.
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={onSaveInfo}
                disabled={!infoDirty}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  cursor: infoDirty ? "pointer" : "not-allowed",
                  background: infoDirty ? "#3b82f6" : "#93c5fd",
                  color: "white",
                  opacity: infoDirty ? 1 : 0.7,
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </section>

          {/* 3. Bảo mật */}
          <section
            style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Bảo mật
            </h2>

            {isGoogleUser ? (
              <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: "#fef3c7", color: "#92400e" }}>
                Tài khoản đăng nhập qua Google không có mật khẩu.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>Mật khẩu hiện tại</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type={showCurrent ? "text" : "password"}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: 14,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((s) => !s)}
                      style={{
                        padding: "0 12px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#f8fafc",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      aria-label="toggle current password"
                    >
                      {showCurrent ? "🙈" : "👁️"}
                    </button>
                  </div>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>Mật khẩu mới</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={showNew ? "text" : "password"}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: 14,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      style={{
                        padding: "0 12px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#f8fafc",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      aria-label="toggle new password"
                    >
                      {showNew ? "🙈" : "👁️"}
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      borderRadius: 12,
                      background: "#f1f5f9",
                      padding: 10,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>
                      Độ mạnh mật khẩu: <span style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        height: 8,
                        borderRadius: 999,
                        background: "#e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: newPassword
                            ? strength.label === "Mạnh"
                              ? "100%"
                              : strength.label === "Trung bình"
                                ? "70%"
                                : "35%"
                            : "0%",
                          background: strength.color,
                          transition: "width 0.2s",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Tối thiểu 6 ký tự.</div>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>Xác nhận mật khẩu mới</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirm ? "text" : "password"}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        outline: "none",
                        fontSize: 14,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      style={{
                        padding: "0 12px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#f8fafc",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      aria-label="toggle confirm password"
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 800 }}>
                      Mật khẩu không khớp.
                    </div>
                  )}
                </label>

                <button
                  type="button"
                  disabled={!canChangePassword}
                  style={{
                    marginTop: 6,
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    fontWeight: 800,
                    cursor: canChangePassword ? "pointer" : "not-allowed",
                    background: canChangePassword ? "#3b82f6" : "#93c5fd",
                    color: "white",
                    opacity: canChangePassword ? 1 : 0.7,
                  }}
                  onClick={() => {
                    // Demo: không tích hợp Firebase updatePassword
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Đổi mật khẩu
                </button>
              </div>
            )}
          </section>

          {/* 4. Tùy chọn hiển thị */}
          <section
            style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Tùy chọn hiển thị
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>Đơn vị tiền tệ</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    outline: "none",
                    fontSize: 14,
                    background: "white",
                  }}
                >
                  <option value="VNĐ">VNĐ</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>Ngày bắt đầu tháng</span>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={monthStartDay}
                  onChange={(e) => setMonthStartDay(Math.max(1, Math.min(28, Number(e.target.value))))}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Mặc định: 1. Ví dụ: người nhận lương ngày 15.
                </div>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>Định dạng ngày</span>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    outline: "none",
                    fontSize: 14,
                    background: "white",
                  }}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Ví dụ: {formatDateByPattern(new Date(), dateFormat)}
                </div>
              </label>

              <button
                type="button"
                disabled={!optionsDirty}
                onClick={onSaveOptions}
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  cursor: optionsDirty ? "pointer" : "not-allowed",
                  background: optionsDirty ? "#3b82f6" : "#93c5fd",
                  color: "white",
                  opacity: optionsDirty ? 1 : 0.7,
                }}
              >
                Lưu tùy chọn
              </button>
            </div>
          </section>

          {/* 5. Dữ liệu & Quyền riêng tư */}
          <section
            style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Dữ liệu & Quyền riêng tư
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <button
                type="button"
                onClick={onExportData}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "2px solid #3b82f6",
                  background: "white",
                  color: "#3b82f6",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Xuất dữ liệu
              </button>

              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "2px solid #ef4444",
                  background: "white",
                  color: "#ef4444",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Xóa tài khoản
              </button>
            </div>

            {deleteDialogOpen && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                  zIndex: 999,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 520,
                    background: "white",
                    borderRadius: 16,
                    padding: 18,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
                    Xác nhận xóa tài khoản
                  </h3>
                  <p style={{ marginTop: 10, color: "#6b7280" }}>
                    Vui lòng nhập lại email của bạn để xác nhận.
                  </p>

                  <input
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    type="email"
                    placeholder="Nhập email"
                    style={{
                      width: "100%",
                      marginTop: 10,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      outline: "none",
                      fontSize: 14,
                    }}
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => setDeleteDialogOpen(false)}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#f8fafc",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      disabled={!canDelete}
                      onClick={onDeleteAccount}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid #ef4444",
                        background: canDelete ? "#ef4444" : "#fca5a5",
                        color: "white",
                        fontWeight: 900,
                        cursor: canDelete ? "pointer" : "not-allowed",
                        opacity: canDelete ? 1 : 0.8,
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 6. Đăng xuất */}
          <section
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <button
              type="button"
              onClick={logout}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "none",
                background: "#fee2e2",
                color: "#b91c1c",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </section>
        </div>
      </div>
    </Layout>
  );
}

