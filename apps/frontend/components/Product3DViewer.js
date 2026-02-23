import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.3} />;
}

export default function Product3DViewer({ modelUrl }) {
  if (!modelUrl) {
    return (
      <div className="h-64 flex items-center justify-center bg-black/40 border border-white/10 rounded-xl text-white/60">
        3D preview not available
      </div>
    );
  }

  return (
    <div className="h-96 bg-black rounded-xl border border-cyan-500/20 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Model url={modelUrl} />
          <OrbitControls enablePan enableZoom enableRotate />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
