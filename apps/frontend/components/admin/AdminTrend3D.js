import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AIProductPanel from "./AIProductPanel";

const API = "http://localhost:5000";

export default function AdminTrend3D() {

  const { user, getFreshToken } = useAuth();

  const [data, setData] = useState([]);
  const [range, setRange] = useState("30d");
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [time, setTime] = useState(0);

  /* 🎬 ANIMATION LOOP */
  useEffect(() => {
    let frame;
    const animate = () => {
      setTime((t) => t + 0.015);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  /* 📡 LOAD DATA */
  async function load() {
    try {
      const token = await getFreshToken();
      if (!token) return;

      const res = await fetch(
        `${API}/api/admin/trends?range=${range}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const json = await res.json();
      setData(json?.trends || []);

    } catch (err) {
      console.error("Trend load error:", err);
    }
  }

  useEffect(() => {
    if (user) load();
  }, [range, user]);

  /* 🧠 SYSTEM SIZE */
  const count = data.length;

  const containerHeight =
    count < 5 ? 420 :
    count < 10 ? 500 :
    count < 15 ? 600 :
    700;

  return (

    <div className="space-y-4">

      {/* FILTER */}
      <div className="flex gap-2">
        {["today", "7d", "30d"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded ${
              range === r
                ? "bg-cyan-500 text-black"
                : "bg-white/10 text-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 🌌 GALAXY */}
      <div
        className="relative overflow-hidden rounded-xl border border-cyan-500/10"
        style={{ height: containerHeight }}
      >

        {/* CORE */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(34,211,238,0.15)",
            boxShadow: "0 0 80px rgba(34,211,238,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5
          }}
        >
          <span className="text-cyan-300 text-sm font-bold">
            AI CORE
          </span>
        </div>

        {/* ORBITS */}
        {[70, 120, 170].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: "1px solid rgba(34,211,238,0.08)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}

        {/* PLANETS */}
        {data.map((item, index) => {

          const value = item.sales || 1;

          /* 🎯 SAFE SIZE */
          const size = Math.max(35, Math.min(value * 4, 70));

          /* 🎯 RING DISTRIBUTION */
          const total = data.length;
          const rings = 3;
          const itemsPerRing = Math.ceil(total / rings);

          const ringIndex = Math.floor(index / itemsPerRing);
          const positionInRing = index % itemsPerRing;

          /* 🎯 ANGLE */
          const angle =
            (positionInRing / itemsPerRing) * Math.PI * 2 +
            time * (0.2 + ringIndex * 0.05);

          /* 🎯 RADIUS */
          const baseRadius = 70;
          const radius = baseRadius + ringIndex * 50;

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const hue = 190 + index * 12;
          const isActive = activeIndex === index;

          return (

            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setSelectedProduct(item)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                transform: `
                  translate(-50%, -50%)
                  translate(${x}px, ${y}px)
                  scale(${isActive ? 1.2 : 1})
                `,
                borderRadius: "50%",
                background: `
                  radial-gradient(
                    circle,
                    hsla(${hue}, 90%, 65%, 0.95),
                    hsla(${hue}, 80%, 30%, 0.2)
                  )
                `,
                boxShadow: isActive
                  ? `0 0 40px hsla(${hue}, 90%, 60%, 0.9)`
                  : `0 0 15px hsla(${hue}, 90%, 60%, 0.4)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: isActive ? 10 : 1
              }}
            >

              <div className="text-white text-xs text-center px-1">
                <div className="truncate max-w-[70px]">
                  {item.name}
                </div>
                <div>{value}</div>
              </div>

            </div>

          );

        })}

      </div>

      {/* 🧠 AI PANEL */}
      {selectedProduct && (
        <AIProductPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}