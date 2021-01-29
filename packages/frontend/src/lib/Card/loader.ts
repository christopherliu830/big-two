import { Card } from 'common';
import {
  BoxGeometry,
  Color,
  TextureLoader,
  MeshBasicMaterial,
  MeshStandardMaterial,
  BackSide,
  Mesh,
} from 'three';

const loader = new TextureLoader();
const blank = new MeshBasicMaterial({ color: 0xf0f0f0 });
const geometry = new BoxGeometry(0.64, 0.02, 0.89); // TODO: move this into a config file
geometry.computeBoundingBox();

/** Loads a textured mesh with a given card suit, value, and optional back texture */
export const load = (
  suit: Card.Suit,
  value: Card.Value,
  backTexture?: number
) => {
  const frontTex = loadFront(suit, value);
  const backTex = loadBack(backTexture || 0);

  const front = new MeshStandardMaterial({ map: frontTex || backTex });
  const back = new MeshStandardMaterial({ map: backTex });

  const materials = [blank, blank, front, back, blank, blank];

  return { geometry, material: materials };
};

export const generateOutlineMesh = (
  mesh: THREE.Mesh,
  color: number | string | Color = 'darkblue',
  thickness = 0.05
) => {
  const outlineMaterial = new MeshBasicMaterial({
    color,
    side: BackSide,
  });
  outlineMaterial.depthTest = false;

  const outlineMesh = new Mesh(mesh.geometry, outlineMaterial);
  outlineMesh.scale.multiplyScalar(1 + thickness);
  outlineMesh.renderOrder = mesh.renderOrder - 1;
  outlineMesh.visible = false;
  mesh.add(outlineMesh);

  return outlineMesh;
};

const loadFront = (suit: Card.Suit, value: Card.Value) => {
  if (suit === Card.Suit.Hidden || value === Card.Value.Hidden) return null;

  let a = '';
  let b = '';
  let c = '';

  switch (suit) {
    case Card.Suit.Club:
      b = 'clubs';
      break;
    case Card.Suit.Diamond:
      b = 'diamonds';
      break;
    case Card.Suit.Heart:
      b = 'hearts';
      break;
    case Card.Suit.Spade:
      b = 'spades';
      break;
  }

  switch (value) {
    case Card.Value.Ace:
      a = 'ace';
      break;
    case Card.Value.Two:
      a = '2';
      break;
    case Card.Value.Three:
      a = '3';
      break;
    case Card.Value.Four:
      a = '4';
      break;
    case Card.Value.Five:
      a = '5';
      break;
    case Card.Value.Six:
      a = '6';
      break;
    case Card.Value.Seven:
      a = '7';
      break;
    case Card.Value.Eight:
      a = '8';
      break;
    case Card.Value.Nine:
      a = '9';
      break;
    case Card.Value.Ten:
      a = '10';
      break;
    case Card.Value.Jack:
      a = 'jack';
      c = '2';
      break;
    case Card.Value.Queen:
      a = 'queen';
      c = '2';
      break;
    case Card.Value.King:
      a = 'king';
      c = '2';
      break;
  }

  return loader.load(require(`./assets/${a}_of_${b}${c}.png`));
};

const loadBack = (index: number) => {
  return loader.load(require(`./assets/back${index + 1}.png`));
};
