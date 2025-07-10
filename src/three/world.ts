import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export class World {
  mesh: THREE.Group<THREE.Object3DEventMap>;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = "World";
    this.mesh.position.set(0, 0, 0);

    this.loadGlb();
    //this.loadPlane();
  }

  loadGlb() {
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    loader.load("/assets/world.glb", (gltf) => {
      const model = gltf.scene;
      const scale = 20;
      model.scale.set(scale, scale, scale);
      model.position.set(30, 0, 0);
      model.rotateY(-Math.PI / 2);

      this.mesh.add(model);
      this.mesh.position.set(0, -9, 0);
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
