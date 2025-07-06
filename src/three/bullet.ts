import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";

interface bulletCollider extends RAPIER.Collider {
  userData?: {
    object: Bullet;
  };
}

export class Bullet {
  public mesh: THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>;
  public rigidBody: RAPIER.RigidBody;
  private initialSpeed: number;
  private hasBeenDeflected = false;

  constructor(world: RAPIER.World, position: THREE.Vector3) {
    const length = 5;
    const radius = 0.1;
    this.initialSpeed = 70;

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

    const colliderDesc = RAPIER.ColliderDesc.capsule(length / 2, radius * 2)
      .setRestitution(0.9)
      .setDensity(1.0)
      .setActiveEvents(
        RAPIER.ActiveEvents.COLLISION_EVENTS |
          RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS
      );

    const collider = world.createCollider(
      colliderDesc,
      this.rigidBody
    ) as bulletCollider;
    collider.userData = { object: this };
  }

  public deflect() {
    if (this.hasBeenDeflected) {
      return;
    }
    this.hasBeenDeflected = true;

    const currentVelocity = new THREE.Vector3().copy(
      this.rigidBody.linvel() as THREE.Vector3
    );

    const reversedVelocity = currentVelocity.negate();

    const randomVector = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );

    randomVector.multiplyScalar(15);

    const finalVelocity = reversedVelocity.add(randomVector);

    this.rigidBody.setLinvel(finalVelocity, true);
  }

  public update() {
    if (!this.hasBeenDeflected) {
      const linvel = this.rigidBody.linvel();
      const currentSpeed = Math.sqrt(
        linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2
      );

      if (currentSpeed > 0.001) {
        this.rigidBody.setLinvel(
          {
            x: (linvel.x / currentSpeed) * this.initialSpeed,
            y: (linvel.y / currentSpeed) * this.initialSpeed,
            z: (linvel.z / currentSpeed) * this.initialSpeed,
          },
          true
        );
      }
    }

    const currentLinvel = this.rigidBody.linvel();
    const speedSq =
      currentLinvel.x ** 2 + currentLinvel.y ** 2 + currentLinvel.z ** 2;

    if (speedSq > 0.0001) {
      const velocityDirection = new THREE.Vector3(
        currentLinvel.x,
        currentLinvel.y,
        currentLinvel.z
      ).normalize();

      const upVector = new THREE.Vector3(0, 1, 0);
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
