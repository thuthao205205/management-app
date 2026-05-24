import { createContext, useContext, useState } from "react";
import { mockAuth } from "../data/mockAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    mockAuth.getCurrentUser()
  );

  const signIn = async ({ email }) => {
    const u = await mockAuth.signIn({ email });
    setUser(u);
    return u;
  };

  const signOut = async () => {
    await mockAuth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);