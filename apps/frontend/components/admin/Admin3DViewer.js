import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
}

export default function Admin3DViewer({ modelUrl }) {
  if (!modelUrl) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          borderRadius: 8,
          color: "#888"
        }}
      >
        No 3D model available
      </div>
    );
  }

  return (
    <div style={{ height: 400, background: "#000", borderRadius: 8 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Model url={modelUrl} />
          <OrbitControls enableZoom enablePan enableRotate />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
