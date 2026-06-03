import { createContext, useContext, useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile
} from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();



export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const unsubscribe =onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const profile =
        await getUserProfile(
          currentUser.uid
        );
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
      }
    );

  return unsubscribe;
}, []);

  const register = async ({
    username,
    email,
    password
  }) => {
    const newUser = await registerUser(
      username,
      email,
      password
    );

    setUser(newUser);
    return newUser;
  };

  const login = async ({
    email,
    password
  }) => {
    const firebaseUser = await loginUser(
      email,
      password
    );
    const profile =
      await getUserProfile(
        firebaseUser.uid
      );
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);