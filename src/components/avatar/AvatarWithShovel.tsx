import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Group, SkinnedMesh, Mesh, Vector3 } from "three";

interface AvatarWithShovelProps {
  scale: number;
  animation: string;
}

const AvatarWithShovel = ({ animation, ...props }: AvatarWithShovelProps) => {
  const avatarRef = useRef<Group>(null);
  const shovelRef = useRef<Mesh>(null);
  const group = useRef<Group>(null);

  // Load avatar and shovel models
  const { animations, nodes, materials } = useGLTF(
    "/assets/kit/GLB_format/character-digger.glb"
  ) as any;
  const { scene: shovelScene } = useGLTF(
    "/assets/kit/GLB_format/shovel.glb"
  ) as any;
  const { actions: avatarActions } = useAnimations(animations, group);

  useEffect(() => {
    avatarActions[animation]?.reset().fadeIn(0.24).play();
    return () => {
      avatarActions[animation]?.fadeOut(0.24);
    };
  }, [animation]);
  return (
    <group ref={group} {...props} scale={[1, 1, 1]} dispose={null}>
      <group name="Scene">
        <group name="fall_guys">
          <primitive object={nodes["root"]} />
          <primitive object={nodes["character-digger"]} />
          {/* <primitive object={avatarScene} ref={avatarRef} />
          <primitive object={shovelScene} ref={shovelRef} /> */}
          <skinnedMesh
            name="arm-left"
            geometry={nodes["arm-left"].geometry}
            material={materials.colormap}
            skeleton={nodes["arm-left"].skeleton}
            // castShadow
            // receiveShadow
          />
          <skinnedMesh
            name="arm-right"
            geometry={nodes["root"].geometry}
            material={materials.colormap}
            skeleton={nodes["root"].skeleton}
            // castShadow
            // receiveShadow
          />
          <skinnedMesh
            name="digger_1"
            geometry={nodes["character-digger_1"].geometry}
            material={materials.Material}
            skeleton={nodes["character-digger_1"].skeleton}
          />
          <skinnedMesh
            name="head"
            geometry={nodes["head"].geometry}
            material={materials.Material}
            skeleton={nodes["head"].skeleton}
          />
          <skinnedMesh
            name="leg-left"
            geometry={nodes["leg-left"].geometry}
            material={materials.Material}
            skeleton={nodes["leg-left"].skeleton}
          />
          <skinnedMesh
            name="leg-right"
            geometry={nodes["leg-right"].geometry}
            material={materials.Material}
            skeleton={nodes["leg-right"].skeleton}
          />
          <skinnedMesh
            name="torso"
            geometry={nodes["torso"].geometry}
            material={materials.Material}
            skeleton={nodes["torso"].skeleton}
          />
        </group>
      </group>
    </group>
  );
};

export default AvatarWithShovel;

useGLTF.preload("/assets/kit/GLB_format/character-digger.glb");
useGLTF.preload("/assets/kit/GLB_format/shovel.glb");
