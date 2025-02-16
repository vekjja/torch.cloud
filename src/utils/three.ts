import * as THREE from "three";

export let scene: THREE.Scene | null = null;
export let camera: THREE.PerspectiveCamera | null = null;
export let renderer: THREE.WebGLRenderer | null = null;

interface ThreeSceneProps {
  mount: HTMLElement;
  width?: number;
  height?: number;
  alpha?: boolean;
  antialias?: boolean;
}

export function initThreeScene({
  width,
  height,
  mount,
  alpha = false,
  antialias = true,
}: ThreeSceneProps) {
  if (!scene) {
    scene = new THREE.Scene();
  }

  if (!camera) {
    camera = new THREE.PerspectiveCamera(
      75,
      (width || mount.clientWidth) / (height || mount.clientHeight),
      0.1,
      1000
    );
    camera.position.z = 5;
  }

  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha, antialias });
    renderer.setSize(width || mount.clientWidth, height || mount.clientHeight);
    mount.appendChild(renderer.domElement);
  }
}

export function newThreeScene({
  width,
  height,
  mount,
  alpha = false,
  antialias = true,
}: ThreeSceneProps) {
  const s = new THREE.Scene();
  const c = new THREE.PerspectiveCamera(
    75,
    (width || mount.clientWidth) / (height || mount.clientHeight),
    0.1,
    1000
  );
  const r = new THREE.WebGLRenderer({ alpha, antialias });
  r.setSize(width || mount.clientWidth, height || mount.clientHeight);
  mount.appendChild(r.domElement);
  return { scene: s, camera: c, renderer: r };
}

export function new3BaseScene() {}
