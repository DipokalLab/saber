import * as THREE from "three";

export class Bullet {
  public mesh: THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>;
  private speed: number;

  constructor(position: THREE.Vector3) {
    const geometry = new THREE.CapsuleGeometry(0.1, 5, 4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x3159f7,
    });
    material.emissiveIntensity = 10;

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.rotation.x = Math.PI / 2;

    this.speed = 50;
  }

  public update(deltaTime: number) {
    this.mesh.position.z += this.speed * deltaTime;
  }
}
