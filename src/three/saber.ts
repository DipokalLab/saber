import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";

export class Saber {
  public mesh: THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshStandardMaterial>;
  public rigidBody: RAPIER.RigidBody;
  public collider: RAPIER.Collider;

  private initialHeight: number;
  private isAnimating: boolean;
  private isOpening: boolean;
  private animationStartTime: number;
  private animationDuration: number;
  private world: RAPIER.World;

  private onSound: HTMLAudioElement;
  private offSound: HTMLAudioElement;
  idleSound: THREE.Audio<GainNode>;

  constructor(world: RAPIER.World, listener: THREE.AudioListener) {
    this.world = world;
    const height = 20;
    const radius = 0.25;
    const geometry = new THREE.CapsuleGeometry(radius, height, 4, 8, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf25c5a,
      emissive: 0xf02b2b,
    });
    material.emissiveIntensity = 7.5;
    this.mesh = new THREE.Mesh(geometry, material);

    this.initialHeight = height;
    this.mesh.position.y = this.initialHeight / 2;

    const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.capsule(
      this.initialHeight / 2,
      radius * 2
    );
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);

    this.isAnimating = false;
    this.isOpening = false;
    this.animationStartTime = 0;
    this.animationDuration = 1000;

    this.onSound = new Audio("/sound/on.mp3");
    this.offSound = new Audio("/sound/off.mp3");

    this.idleSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("/sound/idle.mp3", (buffer) => {
      this.idleSound.setBuffer(buffer);
      this.idleSound.setLoop(true);
      this.idleSound.setVolume(0.3);
    });
  }

  private _startAnimation(opening: boolean) {
    if (this.isAnimating) return;

    this.isOpening = opening;
    this.isAnimating = true;
    this.animationStartTime = performance.now();

    this.playIdleSound(opening);
  }

  public playIdleSound(opening: boolean) {
    if (opening) {
      if (this.idleSound.buffer && !this.idleSound.isPlaying) {
        this.idleSound.play();
      }
    } else {
      if (this.idleSound.isPlaying) {
        this.idleSound.stop();
      }
    }
  }

  public toggle() {
    if (this.isAnimating) return;

    const isOpening = this.mesh.scale.y < 0.1;

    if (isOpening) {
      this.onSound.currentTime = 0;
      this.onSound.play();
    } else {
      this.offSound.currentTime = 0;
      this.offSound.play();
    }

    this._startAnimation(isOpening);
  }

  public update() {
    if (this.isAnimating) {
      const currentTime = performance.now();
      const elapsedTime = currentTime - this.animationStartTime;
      const progress = Math.min(elapsedTime / this.animationDuration, 1.0);
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const targetScaleY = this.isOpening ? 1 : 0;
      const targetPositionY = this.isOpening ? this.initialHeight / 2 : 0;
      const startScaleY = this.isOpening ? 0 : 1;
      const startPositionY = this.isOpening ? 0 : this.initialHeight / 2;

      this.mesh.scale.y =
        startScaleY + (targetScaleY - startScaleY) * easedProgress;
      this.mesh.position.y =
        startPositionY + (targetPositionY - startPositionY) * easedProgress;

      if (progress >= 1.0) {
        this.isAnimating = false;
        this.mesh.scale.y = targetScaleY;
        this.mesh.position.y = targetPositionY;
      }
    }

    const worldPosition = this.mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = this.mesh.getWorldQuaternion(new THREE.Quaternion());

    this.rigidBody.setTranslation(worldPosition, true);
    this.rigidBody.setRotation(worldRotation, true);

    const newHalfHeight = (this.initialHeight / 2) * this.mesh.scale.y;
    this.collider.setHalfHeight(newHalfHeight);
  }
}
