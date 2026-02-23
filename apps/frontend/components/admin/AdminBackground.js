import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function AdminBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-60">
      <Canvas>
        <Stars radius={60} depth={40} count={2000} factor={3}/>
      </Canvas>
    </div>
  );
}
