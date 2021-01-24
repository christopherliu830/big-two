
const suits = [
  'SPADE', 'CLUB', 'DIAMOND', 'HEART',
]
const numbers = [
  'ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING',
]
const cartesian = (a:string[], b:string[]) => {
  const ret:string[] = [];
  for(let i = 0; i < a.length; i++) {
    for(let j = 0; j < b.length; j++) {
      ret.push(a[i] + '_' + b[j]);
    }
  }
  return ret;
}
export function shuffle(array:any[]) {
  // Durstenfelt shuffle
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const CARD_NAMES = cartesian(suits, numbers);
export function getDeck() {
  return shuffle([...CARD_NAMES]);
}