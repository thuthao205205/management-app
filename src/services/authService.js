// services/authService.js

const STORAGE_KEY = "finance_user";

export const authService = {
  async signIn(email, password) {
    const user = {
      id: 1,
      name: email.split("@")[0],
      email
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },

  async register(name, email, password) {
    const user = {
      id: Date.now(),
      name,
      email
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(user)
    );

    return user;
  },

  async signOut() {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEY);

    return user ? JSON.parse(user) : null;
  }
};