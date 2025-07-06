import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { Bullet } from "./bullet";

export class BulletManager {
  private scene: THREE.Scene;
  private world: RAPIER.World;
  private bullets: Bullet[] = [];
  private spawnTimer = 0;
  private nextSpawnTime = 0;
  private onBulletCreated: (bullet: Bullet) => void;

  constructor(
    scene: THREE.Scene,
    world: RAPIER.World,
    onBulletCreated: (bullet: Bullet) => void
  ) {
    this.scene = scene;
    this.world = world;
    this.onBulletCreated = onBulletCreated;
    this.setNextRandomSpawnTime();
  }

  private setNextRandomSpawnTime() {
    this.nextSpawnTime = Math.random() * 1.3 + 0.2;
  }

  private spawnBullet() {
    const y = THREE.MathUtils.randFloat(9, 14);
    const x = THREE.MathUtils.randFloat(-5, 5);
    const z = -80;
    const position = new THREE.Vector3(x, y, z);

    const targetX = THREE.MathUtils.randFloat(-2, 2);
    const targetY = THREE.MathUtils.randFloat(9, 14);
    const targetZ = 0;
    const targetPosition = new THREE.Vector3(targetX, targetY, targetZ);

    const direction = new THREE.Vector3()
      .subVectors(targetPosition, position)
      .normalize();

    const bullet = new Bullet(this.world, position, direction);

    this.bullets.push(bullet);
    this.scene.add(bullet.mesh);
    this.onBulletCreated(bullet);
  }

  private spawnBulletWave() {
    const waveSize = THREE.MathUtils.randInt(1, 3);
    for (let i = 0; i < waveSize; i++) {
      this.spawnBullet();
    }
  }

  public removeBullet(bulletToRemove: Bullet) {
    const index = this.bullets.indexOf(bulletToRemove);
    if (index > -1) {
      this.world.removeCollider(bulletToRemove.rigidBody.collider(0), false);
      this.world.removeRigidBody(bulletToRemove.rigidBody);
      this.scene.remove(bulletToRemove.mesh);
      bulletToRemove.mesh.geometry.dispose();
      (bulletToRemove.mesh.material as THREE.Material).dispose();
      this.bullets.splice(index, 1);
    }
  }

  public update(deltaTime: number) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > this.nextSpawnTime) {
      this.spawnBulletWave();
      this.spawnTimer = 0;
      this.setNextRandomSpawnTime();
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update();

      const bulletPosition = bullet.rigidBody.translation();
      if (
        bulletPosition.z > 200 ||
        Math.abs(bulletPosition.x) > 100 ||
        Math.abs(bulletPosition.y) > 100
      ) {
        this.world.removeCollider(bullet.rigidBody.collider(0), false);
        this.world.removeRigidBody(bullet.rigidBody);
        this.scene.remove(bullet.mesh);
        bullet.mesh.geometry.dispose();
        bullet.mesh.material.dispose();
        this.bullets.splice(i, 1);
      }
    }
  }
}
