import * as THREE from "three";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SelectiveBloomEffect,
  VignetteEffect,
} from "postprocessing";
import { Saber } from "./saber";
import { Hilt } from "./hilt";
import { useInGameStore, type InGameState } from "@/features/inGame/store";
import { BulletManager } from "./bulletManager";
import { Bullet } from "./bullet";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { RapierDebugRenderer } from "./rapierDebugRenderer";
import { World } from "./world";
import type { UserDataCollider } from "./type";
import { Player } from "./player";
import { useHeartStore } from "@/features/heart/store";

export class Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  saber: Saber;
  hilt: Hilt;
  bulletManager: BulletManager;
  clock: THREE.Clock;
  world: RAPIER.World;
  debugRenderer: RapierDebugRenderer;
  firstStart: boolean;
  eventQueue: RAPIER.EventQueue;

  player: Player;
  vignetteEffect!: VignetteEffect;

  private cameraSwayTarget = new THREE.Vector2();
  private accumulator = 0.0;
  private readonly timeStep = 1.0 / 60.0;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.scene.background = new THREE.Color("#000000");

    const gravity = { x: 0.0, y: 0.0, z: 0.0 };
    this.world = new RAPIER.World(gravity);
    this.eventQueue = new RAPIER.EventQueue(true);

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animate.bind(this));

    this.debugRenderer = new RapierDebugRenderer(this.scene, this.world);

    const dom = document.querySelector("#game") as Element;
    dom.appendChild(this.renderer.domElement);

    const audioListener = new THREE.AudioListener();
    this.camera.add(audioListener);

    this.hilt = new Hilt();
    this.scene.add(this.hilt.mesh);

    this.saber = new Saber(this.world, audioListener);
    this.hilt.mesh.add(this.saber.mesh);

    const world = new World();
    this.scene.add(world.mesh);

    const light = new THREE.AmbientLight(0x404040);
    this.scene.add(light);

    this.vignetteEffect = new VignetteEffect({
      eskil: false,
      offset: 0.1,
      darkness: 0.7,
    });

    const bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, {
      intensity: 8,
      mipmapBlur: true,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0.2,
      radius: 0.618,
      resolutionScale: 128,
    });

    bloomEffect.selection.add(this.saber.mesh);

    this.bulletManager = new BulletManager(
      this.scene,
      this.world,
      (bullet: Bullet) => {
        bloomEffect.selection.add(bullet.mesh);
      }
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const effectPass = new EffectPass(
      this.camera,
      bloomEffect,
      this.vignetteEffect
    );
    this.composer.addPass(effectPass);

    this.camera.position.z = 30;
    this.camera.position.y = 10;

    this.firstStart = true;

    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener("click", this.handleClick.bind(this));
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("mousemove", this.handleCameraSway.bind(this));

    this.player = new Player(this.world, this.handleHitPlayer.bind(this));

    useInGameStore.subscribe((currentState) => {
      this.handleGameStartChange(currentState);
    });

    useHeartStore.subscribe((currentState) => {
      if (currentState.hearts <= 0) {
        document.exitPointerLock();
      }
    });
  }

  private handleCameraSway(event: MouseEvent) {
    const sensitivity = 0.004;
    const maxSway = 0.03;

    this.cameraSwayTarget.y -= event.movementX * sensitivity;
    this.cameraSwayTarget.x -= event.movementY * sensitivity;

    this.cameraSwayTarget.x = THREE.MathUtils.clamp(
      this.cameraSwayTarget.x,
      -maxSway,
      maxSway
    );
    this.cameraSwayTarget.y = THREE.MathUtils.clamp(
      this.cameraSwayTarget.y,
      -maxSway,
      maxSway
    );
  }

  handleHitPlayer() {
    if (!useInGameStore.getState().isStart) {
      return;
    }

    const { decreaseHeart } = useHeartStore.getState();
    decreaseHeart();
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.code === "Space") {
      this.saber.toggle();
    }
  }

  handleGameStartChange(state: InGameState) {
    if (state.isStart) {
      this.renderer.domElement.requestPointerLock();
      if (this.firstStart) {
        this.firstStart = false;
        this.saber.playIdleSound(true);
      }
    } else {
      document.exitPointerLock();
    }
  }

  handleWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.composer.setSize(window.innerWidth, window.innerHeight);

    this.animate();
  }

  handleClick(e: MouseEvent) {
    if (!e) return;
    if (!e.target) return;

    if (e.target instanceof Element) {
      if (e.target.id == "root") {
        this.renderer.domElement.requestPointerLock();
      }
    }
  }

  handleCollision() {
    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) return;

      const collider1 = this.world.getCollider(handle1) as UserDataCollider;
      const collider2 = this.world.getCollider(handle2) as UserDataCollider;

      const object1 = collider1.userData?.object;
      const object2 = collider2.userData?.object;

      if (!object1 || !object2) return;

      let saber: Saber | null = null;
      let bullet: Bullet | null = null;

      if (object1 instanceof Saber && object2 instanceof Bullet) {
        saber = object1;
        bullet = object2;
      } else if (object2 instanceof Saber && object1 instanceof Bullet) {
        saber = object2;
        bullet = object1;
      }

      if (saber && bullet) {
        saber.handleHit();
        bullet.deflect();
      }

      if (
        (object1 instanceof Player && object2 instanceof Bullet) ||
        (object2 instanceof Player && object1 instanceof Bullet)
      ) {
        const player =
          object1 instanceof Player ? object1 : (object2 as Player);
        const bullet =
          object1 instanceof Bullet ? object1 : (object2 as Bullet);

        player.handleHit();
        this.bulletManager.removeBullet(bullet);
      }
    });
  }

  handleCameraAnimate() {
    const decayFactor = 0.95;
    const lerpFactor = 0.04;

    this.cameraSwayTarget.multiplyScalar(decayFactor);

    this.camera.rotation.x = THREE.MathUtils.lerp(
      this.camera.rotation.x,
      this.cameraSwayTarget.x,
      lerpFactor
    );
    this.camera.rotation.y = THREE.MathUtils.lerp(
      this.camera.rotation.y,
      this.cameraSwayTarget.y,
      lerpFactor
    );
  }

  animate() {
    const deltaTime = this.clock.getDelta();
    this.accumulator += deltaTime;

    this.handleCameraAnimate();

    this.saber.update();
    this.hilt.update();

    while (this.accumulator >= this.timeStep) {
      this.world.integrationParameters.dt = this.timeStep;
      this.world.step(this.eventQueue);
      this.handleCollision();

      this.player.update(this.camera);

      this.bulletManager.update(this.timeStep);

      this.accumulator -= this.timeStep;
    }
    this.composer.render();
  }
}
