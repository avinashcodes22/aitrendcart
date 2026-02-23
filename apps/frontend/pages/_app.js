import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import AdminBackground from "../components/admin/AdminBackground";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>

        {/* 🌌 3D Background */}
        <AdminBackground />

        {/* 🔥 Render page */}
        <Component {...pageProps} />

      </CartProvider>
    </AuthProvider>
  );
}
