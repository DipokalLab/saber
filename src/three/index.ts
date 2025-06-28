import * as THREE from "three";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SelectiveBloomEffect,
} from "postprocessing";
import { Saber } from "./saber";
import { Hilt } from "./hilt";

export class Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  saber: Saber;
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

    const hilt = new Hilt();
    this.scene.add(hilt.mesh);

    this.saber = new Saber();
    hilt.mesh.add(this.saber.mesh);

    const bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      intensity: 8,
      mipmapBlur: true,
      luminanceThreshold: 0,
      luminanceSmoothing: 0.2,
      radius: 0.618,
      resolutionScale: 128,
    });

    bloomEffect.selection.add(this.saber.mesh);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new EffectPass(this.camera, bloomEffect));

    this.camera.position.z = 30;
    this.camera.position.y = 10;

    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener("click", this.handleClick.bind(this));
  }

  handleWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.animate();
  }

  handleClick(e: MouseEvent) {
    if (!e) return;
    if (!e.target) return;

    if (e.target instanceof Element) {
      if (e.target.id == "root") {
        this.saber.toggle();
      }
    }
  }

  animate() {
    //this.renderer.render(this.scene, this.camera);
    this.saber.update();
    this.composer.render();
  }
}
