import { Vector3 } from 'three';

export function lerpvec(a: Vector3, b: Vector3, t: number) {
  t = Math.max(0, Math.min(1, t));
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return new Vector3(a.x + dx * t, a.y + dy * t, a.y + dz * t);
}
export function lerpnum(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
export function lerparc(a: number, b: number, t: number) {
  const x = a + (b - a) * t;
  const y = (t - 0) * (t - 1);
  return { x, y };
}

export function shiftCardPositions(num: number) {
  const offsets = [];
  const rand = Math.random() - 0.5;
  offsets.push(
    (start: Vector3, t: number) =>
      new Vector3(
        start.x + lerpnum(-0.4, 0.4, t),
        start.y + 0.2 + rand * 0.2,
        start.z + -rand * 0.2
      )
  );
  return offsets;
}

export function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(cname: string) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
