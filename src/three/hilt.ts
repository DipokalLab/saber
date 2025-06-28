import { useHandStore } from "@/features/tracking/store";
import * as THREE from "three";

export class Hilt {
  mesh: THREE.Mesh<
    THREE.CylinderGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;
  constructor() {
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update() {
    const lm = useHandStore.getState().landmarks;
    console.log(lm);
  }
}
