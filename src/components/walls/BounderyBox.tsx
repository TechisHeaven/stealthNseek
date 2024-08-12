// BoundaryBox.tsx

import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";
import { useRef, useEffect } from "react";

const BoundaryBox = ({ boundary }: { boundary: Object3D }) => {
  const boxRef = useRef<Mesh>(null);

  useEffect(() => {
    if (boxRef.current) {
      // Apply material and geometry to visualize the boundary box
      const size = (boundary as any).box.getSize(new Vector3()); // Get size from Box3
      boxRef.current.geometry = new BoxGeometry(size.x, size.y, size.z);
      boxRef.current.material = new MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
    }
  }, [boundary]);

  return <primitive object={boundary} ref={boxRef} />;
};

export default BoundaryBox;
