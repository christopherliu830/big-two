import * as THREE from 'three';
import { CARD_DIMENSIONS } from '../globals';
import { textures } from '../game-core/Card';
import { Color } from 'three';

const material = new THREE.MeshNormalMaterial();

const blankMaterial = new THREE.MeshBasicMaterial({color: 0xf0f0f0});
const geometry = new THREE.BoxGeometry(CARD_DIMENSIONS.x, CARD_DIMENSIONS.y, CARD_DIMENSIONS.z);
geometry.computeBoundingBox(); // Computed to set bounding box field, used for collision

/**
 * Creates a card-sized box mesh.
 */
export const getMesh = (cardName?: string, backTexture?:number) : THREE.Mesh => {
  const materials = [
    blankMaterial,
    blankMaterial,
    cardName? new THREE.MeshStandardMaterial({map: textures.fronts[cardName]}) : blankMaterial,
    backTexture || backTexture === 0 ? new THREE.MeshStandardMaterial({map: textures.backs[backTexture]}): blankMaterial,
    blankMaterial,
    blankMaterial,
  ]

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

/** 
 * Create an outline mesh for a given mesh. NOTE: This changes the render order of the mesh!
 */
export function getOutlineMesh(mesh:THREE.Mesh, 
                                color:number|string|Color='darkblue',
                                thickness:number=0.05) : THREE.Mesh {
  const outlineMaterial = new THREE.MeshBasicMaterial({color: color, side: THREE.BackSide});
  outlineMaterial.depthTest = false;
  const outlineMesh = new THREE.Mesh(mesh.geometry, outlineMaterial);
  outlineMesh.scale.multiplyScalar(1 + thickness);
  mesh.renderOrder = 1;
  outlineMesh.visible = false;
  mesh.add(outlineMesh);
  return outlineMesh;
}

export async function generateText(text:string) {
  const loader = new THREE.FontLoader();
  return new Promise<THREE.Geometry>((resolve, reject) => {
    loader.load('./node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json', (font) => {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.3,
        height: 0.02,
        curveSegments: 12,
      })
      resolve(geometry);
    })
  })
}
