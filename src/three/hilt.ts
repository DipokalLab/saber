import { useInGameStore } from "@/features/inGame/store";
import { useMouseStore } from "@/features/trackingMouse/stote";
import { useHandStore } from "@/features/trackingHand/store";
import * as THREE from "three";

export class Hilt {
  mesh: THREE.Group;
  private posLerp = 0.1;
  private rotLerp = 0.3;
  private scaleRange = 30;
  private up = new THREE.Vector3(0, 1, 0);
  private targetPosition = new THREE.Vector3();
  private wW = new THREE.Vector3();
  private wI = new THREE.Vector3();
  private wM = new THREE.Vector3();
  private wR = new THREE.Vector3();
  private wP = new THREE.Vector3();
  private dir = new THREE.Vector3();
  private targetQuat = new THREE.Quaternion();

  private moveSensitivity = 0.05;

  private swingRotation = new THREE.Quaternion();
  private swingDamping = 0.05;
  private swingSensitivity = 0.008;

  private positionBounds = new THREE.Box3(
    new THREE.Vector3(-15, -10, 0),
    new THREE.Vector3(15, 10, 0)
  );

  constructor() {
    this.mesh = new THREE.Group();

    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hilt = new THREE.Mesh(geometry, material);
    hilt.position.set(0, -1, 0);
    this.mesh.add(hilt);
  }

  updateHand() {
    const hands = useHandStore.getState().landmarks;
    console.log(hands);

    if (!hands.length) return;
    const lm = hands[0];
    const s = this.scaleRange;
    this.wW.set(-(lm[0].x - 0.5) * s, -(lm[0].y - 0.5) * s, lm[0].z * s);
    this.wI.set(-(lm[5].x - 0.5) * s, -(lm[5].y - 0.5) * s, lm[5].z * s);
    this.wM.set(-(lm[9].x - 0.5) * s, -(lm[9].y - 0.5) * s, lm[9].z * s);
    this.wR.set(-(lm[13].x - 0.5) * s, -(lm[13].y - 0.5) * s, lm[13].z * s);
    this.wP.set(-(lm[17].x - 0.5) * s, -(lm[17].y - 0.5) * s, lm[17].z * s);
    this.targetPosition.copy(this.wW);
    this.mesh.position.lerp(this.targetPosition, this.posLerp);
    const vI = new THREE.Vector3().subVectors(this.wI, this.wW).normalize();
    const vM = new THREE.Vector3().subVectors(this.wM, this.wW).normalize();
    const vR = new THREE.Vector3().subVectors(this.wR, this.wW).normalize();
    const vP = new THREE.Vector3().subVectors(this.wP, this.wW).normalize();
    this.dir.copy(vI).add(vM).add(vR).add(vP).normalize();
    this.targetQuat.setFromUnitVectors(this.up, this.dir);
    this.mesh.quaternion.slerp(this.targetQuat, this.rotLerp);
  }

  updateMouse() {
    const { dx, dy } = useMouseStore.getState();

    this.targetPosition.x += dx * this.moveSensitivity;
    this.targetPosition.y -= dy * this.moveSensitivity;

    this.targetPosition.clamp(this.positionBounds.min, this.positionBounds.max);

    this.mesh.position.lerp(this.targetPosition, this.posLerp);

    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      const zSwingAxis = new THREE.Vector3(0, 0, 1);
      const zSwingAmount = -dx * this.swingSensitivity;
      const zDelta = new THREE.Quaternion().setFromAxisAngle(
        zSwingAxis,
        zSwingAmount
      );

      const xSwingAxis = new THREE.Vector3(1, 0, 0);
      const xSwingAmount = dy * this.swingSensitivity;
      const xDelta = new THREE.Quaternion().setFromAxisAngle(
        xSwingAxis,
        xSwingAmount
      );

      this.swingRotation.premultiply(zDelta).premultiply(xDelta);
    }

    this.mesh.quaternion.slerp(this.swingRotation, this.rotLerp);

    this.swingRotation.slerp(new THREE.Quaternion(), 1 - this.swingDamping);
  }

  update() {
    const controlMode = useInGameStore.getState().controlMode;

    console.log(controlMode);

    if (controlMode === "mouse") {
      this.updateMouse();
    } else if (controlMode === "hand") {
      this.updateHand();
    }
  }
}
