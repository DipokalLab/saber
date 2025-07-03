import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";

export class RapierDebugRenderer {
  private scene: THREE.Scene;
  private world: RAPIER.World;
  private lines: THREE.LineSegments;
  private material: THREE.LineBasicMaterial;

  constructor(scene: THREE.Scene, world: RAPIER.World) {
    this.scene = scene;
    this.world = world;
    this.material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      vertexColors: false,
    });
    this.lines = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      this.material
    );
    this.scene.add(this.lines);
  }

  public update() {
    const { vertices } = this.world.debugRender();
    this.lines.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    this.scene.add(this.lines);
  }

  public dispose() {
    this.scene.remove(this.lines);
    this.lines.geometry.dispose();
    this.material.dispose();
  }
}
