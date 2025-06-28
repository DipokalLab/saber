import * as THREE from "three";

export class Saber {
  mesh: THREE.Mesh<
    THREE.CylinderGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;
  constructor() {
    const height = 20;
    const geometry = new THREE.CylinderGeometry(0.25, 0.25, height, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xf25c5a });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = height / 2;
  }
}
