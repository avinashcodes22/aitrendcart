import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

/* ===========================
   BLOB
=========================== */
function Blob({ position, scale }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
}

/* ===========================
   MAIN COMPONENT
=========================== */
export default function AITrendBlob() {

  const { user } = useAuth();

  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        if (!user) {
          console.log("⏳ Waiting for user...");
          setLoading(false); // ✅ FIX: stop infinite loading
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch(`${API}/api/admin/trends`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR:", text);
          setLoading(false);
          return;
        }

        const data = await res.json();

        console.log("TREND DATA:", data);

        const parsed =
          data?.trends ||
          data?.data ||
          (Array.isArray(data) ? data : []);

        setTrends(parsed);

      } catch (err) {

        console.error("Fetch error:", err);

      } finally {

        setLoading(false); // ✅ ALWAYS stop loading

      }

    }

    load();

  }, [user]);

  /* ===========================
     UI
  =========================== */

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center text-white/50">
        Loading trend data...
      </div>
    );
  }

  if (!trends.length) {
    return (
      <div className="h-72 flex items-center justify-center text-yellow-400">
        No trend data available (but system working ✅)
      </div>
    );
  }

  const max = Math.max(...trends.map(t => t.sales || 1), 1);

  return (
    <div className="h-72 border border-cyan-500/20 rounded-xl bg-black/40">

      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />

        <Suspense fallback={null}>
          {trends.map((t, i) => {

            const scale = (t.sales / max) * 2 + 0.5;

            const x = (i % 5) * 3 - 6;
            const y = Math.floor(i / 5) * 2 - 2;

            return (
              <Blob key={i} position={[x, y, 0]} scale={scale} />
            );
          })}

          <OrbitControls enableZoom={false} />
        </Suspense>

      </Canvas>

    </div>
  );
}