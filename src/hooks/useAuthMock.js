import { useEffect, useState } from "react";
import { mockAuth } from "../data/mockAuth";

export function useAuthMock() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(mockAuth.getCurrentUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async ({ email }) => {
    const u = await mockAuth.signIn({ email });
    // ensure state khớp storage ngay lập tức
    setUser(mockAuth.getCurrentUser());
    return u;
  };

  const signOut = async () => {
    await mockAuth.signOut();
    setUser(mockAuth.getCurrentUser()); // sẽ là null
  };


  return { user, signIn, signOut };
}


