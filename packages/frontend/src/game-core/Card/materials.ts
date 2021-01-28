import * as THREE from 'three';
import { Color } from 'three';

export async function generateText(text: string) {
  const loader = new THREE.FontLoader();
  return new Promise<THREE.Geometry>((resolve, reject) => {
    loader.load(
      './node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json',
      (font) => {
        const geometry = new THREE.TextGeometry(text, {
          font,
          size: 0.3,
          height: 0.02,
          curveSegments: 12,
        });
        resolve(geometry);
      }
    );
  });
}
