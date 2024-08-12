// AvatarWithShovel.tsx

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, Mesh, Object3D, Vector3 } from "three";
import { AvatarController } from "../../controller/avatar/AvatarController";

const AvatarWithShovel: React.FC = () => {
  const avatarRef = useRef<Group>(null);
  const shovelRef = useRef<Mesh>(null);
  const avatarController = useRef<AvatarController | null>(null);

  // Get the camera from useThree
  const { camera } = useThree();

  // Set the camera offset (distance from the avatar)
  const cameraOffset = new Vector3(2, 2, 4); // Adjusted closer offset

  // Load avatar and shovel models
  const { scene: avatarScene, animations } = useGLTF(
    "/assets/kit/GLB_format/character-digger.glb"
  );
  const { scene: shovelScene } = useGLTF("/assets/kit/GLB_format/shovel.glb");
  const { actions: avatarActions } = useAnimations(animations, avatarRef);

  useEffect(() => {
    if (avatarRef.current && shovelRef.current) {
      const hand = avatarRef.current.getObjectByName("arm-right") as Object3D;

      if (hand) {
        shovelRef.current.position.set(-0.19, 0, 0.2);
        shovelRef.current.rotation.set(0, 0, 0);
        hand.add(shovelRef.current); // Attach shovel to hand
      }
    }
  }, [avatarRef, shovelRef, avatarActions]);

  useEffect(() => {
    if (avatarRef.current) {
      avatarController.current = new AvatarController(
        avatarRef.current,
        animations
      );
      avatarController.current.playAction("idle");
    }
  }, [animations]);

  useFrame((state, delta) => {
    avatarController.current?.update(delta); // Update avatar animations

    // Make the camera follow the avatar
    if (avatarRef.current) {
      const avatarPosition = avatarRef.current.position.clone();
      const desiredCameraPosition = avatarPosition.clone().add(cameraOffset);

      // Update camera position smoothly
      camera.position.lerp(desiredCameraPosition, 0.2);
      camera.lookAt(
        avatarRef.current.position.x,
        avatarRef.current.position.y,
        avatarRef.current.position.z
      );
    }
  });

  // Handle avatar movement based on keyboard input
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
      case "a":
        avatarController.current?.moveAndRotate("left");
        break;
      case "ArrowRight":
      case "d":
        avatarController.current?.moveAndRotate("right");
        break;
      case "ArrowUp":
      case "w":
        avatarController.current?.moveAndRotate("forward");
        break;
      case "ArrowDown":
      case "s":
        avatarController.current?.moveAndRotate("backward");
        break;
      case " ":
        avatarController.current?.jump();
        break;
      case "Shift":
        avatarController.current?.toggleSitOrStand();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <primitive castShadow object={avatarScene} ref={avatarRef} />
      <primitive object={shovelScene} ref={shovelRef} />
    </>
  );
};

export default AvatarWithShovel;
