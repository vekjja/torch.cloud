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

  // Ensure there is ambient lighting
  if (!scene.children.some((child) => child instanceof THREE.AmbientLight)) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  }
}
