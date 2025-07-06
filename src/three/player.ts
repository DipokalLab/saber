import * as RAPIER from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import type { UserDataCollider } from "./type";

export class Player {
  public rigidBody: RAPIER.RigidBody;
  public collider: UserDataCollider;
  private onDamage: () => void;

  constructor(world: RAPIER.World, onDamage: () => void) {
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
    this.onDamage();
  }

  public update(camera: THREE.Camera) {
    const playerPosition = new THREE.Vector3();
    camera.getWorldPosition(playerPosition);

    this.rigidBody.setTranslation(playerPosition, true);
  }
}
