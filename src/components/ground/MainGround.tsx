//MainGround.tsx
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Material } from "three";

const MainGround = () => {
  const { scene } = useGLTF("/assets/kit/GLB_format/road.glb"); // Your ground texture
  // Adjust to tile the texture
  const groundRef = useRef<Material>();

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[20, 0.01, 20]} />
      <meshStandardMaterial color={"#8087a1"} />
      <primitive object={scene} />;
    </mesh>
  );
};

export default MainGround;
