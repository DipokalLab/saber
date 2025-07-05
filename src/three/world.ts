import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class World {
  mesh: THREE.Group<THREE.Object3DEventMap>;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = "World";
    this.mesh.position.set(0, 0, 0);

    //this.loadGlb();
    this.loadPlane();
  }

  loadGlb() {
    const loader = new GLTFLoader();
    loader.load("/assets/world.glb", (gltf) => {
      this.mesh.add(gltf.scene);
      this.mesh.scale.set(0.1, 0.1, 0.1);
      this.mesh.position.set(0, -2, 0);
    });
  }

  loadPlane() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -9;
    this.mesh.add(plane);
  }
}
