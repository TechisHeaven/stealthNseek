//ThreeCanvas.tsx
import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import Map from "../components/ground/Map";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "../controller/character.controller";
import { useControls } from "leva";

const ThreeCanvas = () => {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
  ];

  const maps = {
    castle_on_hills: {
      scale: 3,
      position: [-6, -7, 0],
    },
  };

  const shadowCameraRef = useRef();
  const { map } = useControls("Map", {
    map: {
      value: "castle_on_hills",
      options: Object.keys(maps),
    },
  });
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows
        camera={{ position: [2, 2, 2], near: 0.6, fov: 40 }}
        style={{
          touchAction: "none",
        }}
      >
        <Environment preset="night" />
        <color attach="background" args={["#ececec"]} />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          // intensity={Math.PI}
          decay={2}
          intensity={2}
          // castShadow
          shadow-mapSize-width={2048} // Higher value for better quality
          shadow-mapSize-height={2048}
          shadow-bias={-0.01}
        />
        <directionalLight
          intensity={0.65}
          castShadow
          position={[-15, 10, 15]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.00005}
        >
          <OrthographicCamera
            left={-22}
            right={15}
            top={10}
            bottom={-20}
            ref={shadowCameraRef}
            attach={"shadow-camera"}
          />
        </directionalLight>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Physics key={map}>
          <CharacterController key={map} />
          <Map
            scale={maps[map].scale}
            position={maps[map].position}
            model={`/assets/kit/GLB_format/map/${map}.glb`}
          />
          {/* <AvatarWithShovel /> */}
        </Physics>
      </Canvas>
    </KeyboardControls>
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
