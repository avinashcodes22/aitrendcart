import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function AdminGuard({ children }) {

  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {

    /* ⛔ wait until auth is ready */
    if (loading) return;

    /* ❌ not logged in → redirect */
    if (!user) {
      router.replace("/admin/login");
    }

  }, [user, loading]);

  /* ⛔ prevent flicker */
  if (loading) {
    return (
      <div className="p-10 text-white">
        Checking authentication...
      </div>
    );
  }

  /* ⛔ block until redirect */
  if (!user) {
    return null;
  }

  /* ✅ allow access */
  return children;

}