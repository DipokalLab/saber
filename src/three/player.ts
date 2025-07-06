import * as RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import type { UserDataCollider } from "./type";

export class Player {
  public rigidBody: RAPIER.RigidBody;
  public collider: UserDataCollider;
  public hearts: number;

  private maxHearts: number;
  private onDamage: (currentHearts: number) => void;

  constructor(world: RAPIER.World, onDamage: (currentHearts: number) => void) {
    this.maxHearts = 10;
    this.hearts = this.maxHearts;
    this.onDamage = onDamage;

    const halfExtents = { x: 2, y: 2, z: 2 };

    const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = world.createRigidBody(rigidBodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z
    ).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    this.collider = world.createCollider(
      colliderDesc,
      this.rigidBody
    ) as UserDataCollider;

    this.collider.userData = { object: this };
  }

  public handleHit() {
    if (this.hearts > 0) {
      this.hearts -= 1;
      console.log(`Player Hit! Hearts remaining: ${this.hearts}`);
      this.onDamage(this.hearts);
    }
  }

  public update(camera: THREE.Camera) {
    const playerPosition = new THREE.Vector3();
    camera.getWorldPosition(playerPosition);

    this.rigidBody.setTranslation(playerPosition, true);
  }
}
