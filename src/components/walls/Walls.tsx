import { useGLTF } from "@react-three/drei";

const Walls = () => {
  const { scene } = useGLTF("/assets/kit/GLB_format/column-large.glb");
  scene.scale.set(4, 4, 2);
  scene.position.set(-2, -2, 0);
  return (
    <mesh position={[0, 0, 0]}>
      <primitive object={scene} />;
    </mesh>
  );
};

export default Walls;
