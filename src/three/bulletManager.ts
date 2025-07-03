import * as THREE from "three";
import { Bullet } from "./bullet";

export class BulletManager {
  private scene: THREE.Scene;
  private bullets: Bullet[] = [];
  private spawnPositionsY = [0, 10, 30];
  private spawnTimer = 0;
  private nextSpawnTime = 0;
  private onBulletCreated: (bullet: Bullet) => void;

  constructor(scene: THREE.Scene, onBulletCreated: (bullet: Bullet) => void) {
    this.scene = scene;
    this.onBulletCreated = onBulletCreated;
    this.setNextRandomSpawnTime();
  }

  private setNextRandomSpawnTime() {
    this.nextSpawnTime = Math.random() * 1.3 + 0.2;
  }

  private spawnBullet() {
    const y =
      this.spawnPositionsY[
        Math.floor(Math.random() * this.spawnPositionsY.length)
      ];
    const x = THREE.MathUtils.randFloat(-5, 5);
    const z = -200;

    const position = new THREE.Vector3(x, y, z);
    const bullet = new Bullet(position);

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

  public update(deltaTime: number) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > this.nextSpawnTime) {
      this.spawnBulletWave();
      this.spawnTimer = 0;
      this.setNextRandomSpawnTime();
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(deltaTime);

      if (bullet.mesh.position.z > 50) {
        this.scene.remove(bullet.mesh);
        bullet.mesh.geometry.dispose();
        bullet.mesh.material.dispose();
        this.bullets.splice(i, 1);
      }
    }
  }
}
