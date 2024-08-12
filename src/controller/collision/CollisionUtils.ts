// CollisionUtil.ts
import { Box3, Mesh, Vector3 } from "three";

export class CollisionUtil {
  static getBoundingBoxFromMesh(mesh: Mesh): Box3 {
    const boundingBox = new Box3();
    mesh.geometry.computeBoundingBox();
    boundingBox.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
    return boundingBox;
  }
}
