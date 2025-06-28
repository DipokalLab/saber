import * as THREE from "three";

export class Saber {
  public mesh: THREE.Mesh<
    THREE.CylinderGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;
  private initialHeight: number;
  private isAnimating: boolean;
  private isOpening: boolean;
  private animationStartTime: number;
  private animationDuration: number;
  constructor() {
    const height = 20;
    const geometry = new THREE.CylinderGeometry(0.25, 0.25, height, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xf25c5a });
    this.mesh = new THREE.Mesh(geometry, material);

    this.initialHeight = height;
    this.mesh.position.y = this.initialHeight / 2;

    this.isAnimating = false;
    this.isOpening = false;
    this.animationStartTime = 0;
    this.animationDuration = 1000;
  }

  private _startAnimation(opening: boolean) {
    if (this.isAnimating) return;

    this.isOpening = opening;
    this.isAnimating = true;
    this.animationStartTime = performance.now();
  }

  public toggle() {
    const isCurrentlyOpen = this.mesh.scale.y > 0.99;
    this._startAnimation(!isCurrentlyOpen);
  }

  public update() {
    if (!this.isAnimating) return;

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
}
