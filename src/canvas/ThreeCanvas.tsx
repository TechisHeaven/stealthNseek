//ThreeCanvas.tsx
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import AvatarWithShovel from "../components/avatar/AvatarWithShovel";
import MainGround from "../components/ground/MainGround";

const ThreeCanvas = () => {
  const { scene } = useGLTF("/assets/kit/GLB_format/fire-basket.glb");
  scene.scale.set(4, 4, 2);
  scene.position.set(-2, -2, 0);

  return (
    <Canvas shadows>
      <SetBackgroundColor />
      <ambientLight intensity={0.2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        // intensity={Math.PI}
        decay={2}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048} // Higher value for better quality
        shadow-mapSize-height={2048}
        shadow-bias={-0.01}
      />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* <FlyControls
        autoForward={false}
        dragToLook={false}
        movementSpeed={1}
        rollSpeed={0.005}
        makeDefault
      /> */}
      {/* <KenneyModel /> */}
      <MainGround />
      <AvatarWithShovel />
      <Environment preset="night" />
    </Canvas>
  );
};

export default ThreeCanvas;

const SetBackgroundColor = () => {
  const { scene } = useThree();

  useEffect(() => {
    // Set background color to sky blue
    scene.background = new THREE.Color("dimgray");
  }, [scene]);

  return null;
};
