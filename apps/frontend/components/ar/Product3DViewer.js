import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Center,
  Html,
} from "@react-three/drei";
import { Suspense, useState } from "react";

/* ===============================
   HOTSPOT COMPONENT
================================ */

function Hotspot({ position, label, description }) {

  const [open, setOpen] = useState(false);

  return (
    <group position={position}>

      <mesh onClick={() => setOpen(!open)}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" />
      </mesh>

      {open && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white p-3 rounded-lg w-48 text-sm border border-cyan-500/30">
            <div className="font-semibold mb-1">{label}</div>
            <div className="text-gray-300">{description}</div>
          </div>
        </Html>
      )}

    </group>
  );
}

/* ===============================
   3D MODEL COMPONENT
================================ */

function Model({ url, hotspots = [] }) {

  const resolvedUrl =
    url?.startsWith("http")
      ? url
      : `http://localhost:5000/${url}`;

  const { scene } = useGLTF(resolvedUrl);

  return (
    <Center>

      <primitive object={scene} scale={1.4} />

      {hotspots.map((h, i) => (
        <Hotspot
          key={i}
          position={h.position}
          label={h.label}
          description={h.description}
        />
      ))}

    </Center>
  );
}

/* ===============================
   LOADER
================================ */

function Loader() {
  return (
    <Html center>
      <div className="text-white/60 text-sm animate-pulse">
        Loading 3D...
      </div>
    </Html>
  );
}

/* ===============================
   PRODUCT 3D VIEWER
================================ */

export default function Product3DViewer({
  modelUrl,
  hotspots = [],
}) {

  if (!modelUrl) {

    return (
      <div className="h-72 flex items-center justify-center bg-black/40 border border-white/10 rounded-xl text-white/60">
        3D preview not available
      </div>
    );

  }

  return (
    <div className="h-96 bg-black rounded-xl border border-cyan-500/20 overflow-hidden">

      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
      >

        <Suspense fallback={<Loader />}>

          <ambientLight intensity={0.8} />

          <directionalLight
            position={[5,5,5]}
            intensity={1.2}
          />

          <directionalLight
            position={[-5,3,-5]}
            intensity={0.6}
          />

          <Environment preset="city" />

          <Model url={modelUrl} hotspots={hotspots} />

          <OrbitControls
            enablePan={false}
            enableZoom
            autoRotate
            autoRotateSpeed={1.2}
          />

        </Suspense>

      </Canvas>

    </div>
  );
}