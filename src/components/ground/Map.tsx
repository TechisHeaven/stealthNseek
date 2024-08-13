//MainGround.tsx
import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

const MainGround = ({ model, ...props }) => {
  // const { scene } = useGLTF("/assets/kit/GLB_format/road.glb"); // Your ground texture
  // Adjust to tile the texture
  // const { scene, animations } = useGLTF(
  //   "/assets/kit/GLB_format/road.glb");
  const { scene, animations } = useGLTF(
    "/assets/kit/GLB_format/map/castle_on_hills.glb"
  );
  const group = useRef();
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // useEffect(() => {
  //   if (actions && animations.length > 0) {
  //     actions[animations[0].name].play();
  //   }
  // }, [actions]);

  return (
    <group>
      <RigidBody type="fixed" colliders="hull">
        <primitive object={scene} {...props} ref={group} />;
      </RigidBody>
    </group>

    // <mesh position={[0, 0, 0]}>
    //   <boxGeometry args={[20, 0.01, 20]} />
    //   <meshStandardMaterial color={"#8087a1"} />
    //   <primitive object={scene} />;
    // </mesh>
  );
};

export default MainGround;
