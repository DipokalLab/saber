import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";

export class Bullet {
  public mesh: THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>;
  public rigidBody: RAPIER.RigidBody;
  private initialSpeed: number;

  constructor(world: RAPIER.World, position: THREE.Vector3) {
    const length = 5;
    const radius = 0.1;
    this.initialSpeed = 40;

    const geometry = new THREE.CapsuleGeometry(radius, length, 4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x3159f7,
    });
    material.emissiveIntensity = 10;
    this.mesh = new THREE.Mesh(geometry, material);

    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(position.x, position.y, position.z)
      .setLinvel(0, 0, this.initialSpeed);
    this.rigidBody = world.createRigidBody(rigidBodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.capsule(length / 2, radius)
      .setRestitution(0.9)
      .setDensity(1.0);

    world.createCollider(colliderDesc, this.rigidBody);
  }

  public update() {
    const linvel = this.rigidBody.linvel();
    const currentSpeedSq = linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2;

    if (currentSpeedSq > 0.0001) {
      const currentSpeed = Math.sqrt(currentSpeedSq);

      this.rigidBody.setLinvel(
        {
          x: (linvel.x / currentSpeed) * this.initialSpeed,
          y: (linvel.y / currentSpeed) * this.initialSpeed,
          z: (linvel.z / currentSpeed) * this.initialSpeed,
        },
        true
      );

      const upVector = new THREE.Vector3(0, 1, 0);
      const velocityDirection = new THREE.Vector3(
        linvel.x,
        linvel.y,
        linvel.z
      ).normalize();

      const rotation = new THREE.Quaternion().setFromUnitVectors(
        upVector,
        velocityDirection
      );
      this.rigidBody.setRotation(rotation, true);
    }

    this.mesh.position.copy(this.rigidBody.translation() as THREE.Vector3);
    this.mesh.quaternion.copy(this.rigidBody.rotation() as THREE.Quaternion);
  }
}
