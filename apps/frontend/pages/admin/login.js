import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/router";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      /* ✅ IMPORTANT: wait for token */
      await userCred.user.getIdToken();

      /* ✅ small delay ensures context sync */
      setTimeout(() => {
        router.push("/admin");
      }, 300);

    } catch (err) {

      setError(err.message);
      setLoading(false);

    }

  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <form onSubmit={handleLogin} style={{ width: 320 }}>

        <h2>Admin Login</h2>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />

        <button
          style={{ width: "100%", padding: 10 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );

}