import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export type GeometryTemplate = 'plane' | 'plate' | 'box' | 'ring' | 'building';

function createGeometry(template: GeometryTemplate): THREE.BufferGeometry {
  switch (template) {
    case 'plate':
      return new THREE.CylinderGeometry(1, 1, 0.05, 32);
    case 'box':
      return new THREE.BoxGeometry(1, 1, 1);
    case 'ring':
      return new THREE.TorusGeometry(0.7, 0.2, 16, 32);
    case 'building':
      return new THREE.BoxGeometry(1, 2, 1);
    case 'plane':
    default:
      return new THREE.PlaneGeometry(1, 1);
  }
}

// FIX: Fetch image as blob to bypass Firebase Storage CORS entirely
function loadImageAsTexture(url: string): Promise<THREE.Texture> {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Fetch the image data as a blob
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();

      // 2. Create a local object URL (This has no CORS restrictions!)
      const objectUrl = URL.createObjectURL(blob);

      // 3. Load the local object URL into Three.js
      const loader = new THREE.TextureLoader();
      loader.load(
        objectUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          // 4. Clean up the object URL to free memory
          URL.revokeObjectURL(objectUrl);
          resolve(texture);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(objectUrl);
          console.error('TextureLoader Error:', error);
          reject(new Error('Failed to load image into 3D model.'));
        }
      );
    } catch (error) {
      console.error('Fetch Image Error:', error);
      reject(new Error('Failed to fetch image for 3D generation.'));
    }
  });
}

export async function generateGLBFromImage(
  imageUrl: string,
  geometryTemplate: GeometryTemplate = 'plane',
  onProgress?: (status: string) => void
): Promise<ArrayBuffer> {
  try {
    onProgress?.('Loading image...');
    const texture = await loadImageAsTexture(imageUrl);

    onProgress?.('Creating 3D scene...');
    
    // 1. Setup Scene
    const scene = new THREE.Scene();

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 3. Geometry & Material
    const geometry = createGeometry(geometryTemplate);
    
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Export to GLB
    onProgress?.('Generating 3D model...');
    const exporter = new GLTFExporter();

    // Use parseAsync for modern Three.js versions
    const result = await exporter.parseAsync(scene, { binary: true });

    // Cleanup memory
    geometry.dispose();
    material.dispose();
    texture.dispose();

    onProgress?.('3D model ready!');
    
    return result as ArrayBuffer;

  } catch (error: any) {
    console.error('Error generating GLB:', error.message || error);
    throw new Error(error.message || 'Failed to generate 3D model');
  }
}