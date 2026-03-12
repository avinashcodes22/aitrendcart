import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

/* ======================================================
   CONFIG
====================================================== */
const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

/* ======================================================
   SIZE SCALE
====================================================== */
function getSize(sales) {
  return Math.log(sales + 1) * 1.5 + 0.9;
}

/* ======================================================
   COLOR SCALE
====================================================== */
function getColor(sales) {
  if (sales >= 15) return "#00ffff";
  if (sales >= 5) return "#facc15";
  return "#ff6b6b";
}

/* ======================================================
   POSITIONS
====================================================== */
function getPositions(trends) {
  const spacing = 6;
  return trends.map((_, i) => {
    const angle = i * 1.6;
    const radius = spacing * Math.sqrt(i + 1);

    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ];
  });
}

/* ======================================================
   BUBBLE
====================================================== */
function Bubble({ trend, position, onClick }) {
  const size = getSize(trend.sales);
  const color = getColor(trend.sales);

  return (
    <group position={position}>
      <mesh onClick={() => onClick(trend)}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </mesh>

      <Html distanceFactor={20}>
        <div className="bg-black/70 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
          {trend.name} — {trend.sales}
        </div>
      </Html>
    </group>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function AdminTrend3D() {
  const { token } = useAuth();

  const [trends, setTrends] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("30d");   // ⭐ filter state

  /* ================= LOAD DATA ================= */
  async function loadTrends() {
    if (!token) return;

    try {
      const res = await fetch(
        `${API}/api/admin/trends?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      setTrends(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Trend fetch error:", err.message);
      setError("Failed to load trends");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTrends();
  }, [token, range]);   // ⭐ reload when range changes

  /* ================= STATES ================= */
  if (loading)
    return (
      <div className="text-white/60 text-center mt-20">
        Loading trend data...
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 text-center mt-20">
        {error}
      </div>
    );

  if (!trends.length)
    return (
      <div className="text-white/40 text-center mt-20">
        No trend data yet
      </div>
    );

  const positions = getPositions(trends);

  return (
    <div className="space-y-4">

      {/* ================= FILTER MENU ================= */}
      <div className="flex gap-3">
        {[
          { label: "Today", val: "today" },
          { label: "Last 7 Days", val: "7d" },
          { label: "Last 30 Days", val: "30d" },
        ].map((btn) => (
          <button
            key={btn.val}
            onClick={() => {
              setLoading(true);
              setRange(btn.val);
            }}
            className={`px-3 py-1 rounded text-sm ${
              range === btn.val
                ? "bg-cyan-500"
                : "bg-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ================= 3D VIEW ================= */}
      <Canvas camera={{ position: [0, 8, 25] }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[20, 20, 20]} />

        {trends.map((t, i) => (
          <Bubble
            key={i}
            trend={t}
            position={positions[i]}
            onClick={setSelected}
          />
        ))}

        <OrbitControls />
      </Canvas>

      {/* ================= CLICK MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#050816] border border-cyan-500/30 rounded-2xl p-6 w-[350px] text-white">

            <div className="flex justify-between mb-3">
              <h2 className="text-cyan-400 font-bold">
                {selected.name}
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-white/70 mb-3">
              Sales: {selected.sales}
            </p>

            <p className="text-xs text-white/40">
              Next step → open product page + show 3D model
            </p>

          </div>
        </div>
      )}
    </div>
  );
}