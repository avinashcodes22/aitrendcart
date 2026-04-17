import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET FRESH TOKEN (SAFE)
  ========================= */

  async function getFreshToken() {

    if (!auth.currentUser) return null;

    try {
      return await auth.currentUser.getIdToken(true);
    } catch (err) {
      console.error("Token error:", err);
      return null;
    }

  }

  /* =========================
     AUTO REFRESH TOKEN
  ========================= */

  useEffect(() => {

    let refreshInterval;

    const unsub = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);
      setLoading(false);

      /* 🔁 AUTO REFRESH EVERY 50 MIN */
      if (currentUser) {

        refreshInterval = setInterval(async () => {
          try {
            await currentUser.getIdToken(true);
          } catch (err) {
            console.error("Auto refresh failed:", err);
          }
        }, 50 * 60 * 1000);

      }

    });

    return () => {
      unsub();
      if (refreshInterval) clearInterval(refreshInterval);
    };

  }, []);

  /* =========================
     CONTEXT VALUE
  ========================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        getFreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => useContext(AuthContext);