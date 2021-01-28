const suitOrder = ['DIAMOND', 'CLUB', 'HEART', 'SPADE'];
const numOrder = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'JACK',
  'QUEEN',
  'KING',
  'ACE',
  '2',
];

export function cardCompareTo(
  a: string,
  b: string,
  valueOnly: boolean = false
) {
  const [as, an] = a.split('_');
  const [bs, bn] = b.split('_');
  const ias = suitOrder.indexOf(as);
  const ian = numOrder.indexOf(an);
  const ibs = suitOrder.indexOf(bs);
  const ibn = numOrder.indexOf(bn);

  if (valueOnly) {
    if (ian > ibn) return 1;
    else if (ian < ibn) return -1;
    else return 0;
  }

  if (ian > ibn) return 1;
  else if (ian < ibn) return -1;
  else if (ias > ibs) return 1;
  else if (ias < ibs) return -1;
  else return 0;
}

export function checkSameValue(cards: string[]) {
  const value = cards[0].split('_')[1];
  return cards.every((card) => card.split('_')[1] === value);
}
