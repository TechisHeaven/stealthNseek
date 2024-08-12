import { Box3, Group, Vector3 } from "three";

export class CollisionDetection {
  private boundaries: Box3[]; // Array of Box3 objects for walls or boundaries

  constructor(boundaries: Box3[]) {
    this.boundaries = boundaries;
  }

  checkCollision(player: Group): boolean {
    const playerBox = new Box3().setFromObject(player);

    for (const boundary of this.boundaries) {
      if (playerBox.intersectsBox(boundary)) {
        return true;
      }
    }

    return false;
  }

  checkBoundaryLimits(player: Group, minY: number, maxY: number): void {
    if (player.position.y < minY) player.position.y = minY;
    if (player.position.y > maxY) player.position.y = maxY;
  }
}
