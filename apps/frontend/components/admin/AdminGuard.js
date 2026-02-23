import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token]);

  if (loading) {
    return <div className="p-10">Checking login...</div>;
  }

  if (!token) {
    return null;
  }

  return children;
}
