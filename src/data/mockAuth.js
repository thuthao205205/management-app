

const STORAGE_KEY = "finance_user";

const mockAuth = {
  // Lấy user hiện tại
  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEY);

    if (!user) return null;

    return JSON.parse(user);
  },

  // Đăng nhập
  async signIn({ email, password }) {
    // giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = {
      id: 1,
      name: email.split("@")[0],
      email,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },

  // Đăng ký
  async signUp({
    name,
    email,
    password,
  }) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = {
      id: Date.now(),
      name,
      email,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },

  // Đăng xuất
  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    localStorage.removeItem(STORAGE_KEY);
  },
};

export default mockAuth;