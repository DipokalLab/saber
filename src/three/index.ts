import * as THREE from "three";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SelectiveBloomEffect,
} from "postprocessing";
import { Saber } from "./saber";

export class Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animate.bind(this));

    const dom = document.querySelector("#game") as Element;
    dom.appendChild(this.renderer.domElement);

    const saber = new Saber();
    this.scene.add(saber.mesh);

    const bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      intensity: 8,
      mipmapBlur: true,
      luminanceThreshold: 0,
      luminanceSmoothing: 0.2,
      radius: 0.618,
      resolutionScale: 128,
    });

    bloomEffect.selection.add(saber.mesh);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new EffectPass(this.camera, bloomEffect));

    this.camera.position.z = 30;

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.animate();
  }

  animate() {
    //this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }
}
