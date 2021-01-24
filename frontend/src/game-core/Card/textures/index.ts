import {TextureLoader} from 'three';

const loader = new TextureLoader();


export const SPADE_ACE = loader.load(require('./ace_of_spades.png'));
export const SPADE_2 = loader.load(require('./2_of_spades.png'));
export const SPADE_3 = loader.load(require('./3_of_spades.png'));
export const SPADE_4 = loader.load(require('./4_of_spades.png'));
export const SPADE_5 = loader.load(require('./5_of_spades.png'));
export const SPADE_6 = loader.load(require('./6_of_spades.png'));
export const SPADE_7 = loader.load(require('./7_of_spades.png'));
export const SPADE_8 = loader.load(require('./8_of_spades.png'));
export const SPADE_9 = loader.load(require('./9_of_spades.png'));
export const SPADE_10 = loader.load(require('./10_of_spades.png'));
export const SPADE_KING = loader.load(require('./king_of_spades2.png'));
export const SPADE_QUEEN = loader.load(require('./queen_of_spades2.png'));
export const SPADE_JACK = loader.load(require('./jack_of_spades2.png'));
export const CLUB_ACE = loader.load(require('./ace_of_clubs.png'));
export const CLUB_2 = loader.load(require('./2_of_clubs.png'));
export const CLUB_3 = loader.load(require('./3_of_clubs.png'));
export const CLUB_4 = loader.load(require('./4_of_clubs.png'));
export const CLUB_5 = loader.load(require('./5_of_clubs.png'));
export const CLUB_6 = loader.load(require('./6_of_clubs.png'));
export const CLUB_7 = loader.load(require('./7_of_clubs.png'));
export const CLUB_8 = loader.load(require('./8_of_clubs.png'));
export const CLUB_9 = loader.load(require('./9_of_clubs.png'));
export const CLUB_10 = loader.load(require('./10_of_clubs.png'));
export const CLUB_KING = loader.load(require('./king_of_clubs2.png'));
export const CLUB_QUEEN = loader.load(require('./queen_of_clubs2.png'));
export const CLUB_JACK = loader.load(require('./jack_of_clubs2.png'));
export const DIAMOND_ACE = loader.load(require('./ace_of_diamonds.png'));
export const DIAMOND_2 = loader.load(require('./2_of_diamonds.png'));
export const DIAMOND_3 = loader.load(require('./3_of_diamonds.png'));
export const DIAMOND_4 = loader.load(require('./4_of_diamonds.png'));
export const DIAMOND_5 = loader.load(require('./5_of_diamonds.png'));
export const DIAMOND_6 = loader.load(require('./6_of_diamonds.png'));
export const DIAMOND_7 = loader.load(require('./7_of_diamonds.png'));
export const DIAMOND_8 = loader.load(require('./8_of_diamonds.png'));
export const DIAMOND_9 = loader.load(require('./9_of_diamonds.png'));
export const DIAMOND_10 = loader.load(require('./10_of_diamonds.png'));
export const DIAMOND_KING = loader.load(require('./king_of_diamonds2.png'));
export const DIAMOND_QUEEN = loader.load(require('./queen_of_diamonds2.png'));
export const DIAMOND_JACK = loader.load(require('./jack_of_diamonds2.png'));
export const HEART_ACE = loader.load(require('./ace_of_hearts.png'));
export const HEART_2 = loader.load(require('./2_of_hearts.png'));
export const HEART_3 = loader.load(require('./3_of_hearts.png'));
export const HEART_4 = loader.load(require('./4_of_hearts.png'));
export const HEART_5 = loader.load(require('./5_of_hearts.png'));
export const HEART_6 = loader.load(require('./6_of_hearts.png'));
export const HEART_7 = loader.load(require('./7_of_hearts.png'));
export const HEART_8 = loader.load(require('./8_of_hearts.png'));
export const HEART_9 = loader.load(require('./9_of_hearts.png'));
export const HEART_10 = loader.load(require('./10_of_hearts.png'));
export const HEART_KING = loader.load(require('./king_of_hearts2.png'));
export const HEART_QUEEN = loader.load(require('./queen_of_hearts2.png'));
export const HEART_JACK = loader.load(require('./jack_of_hearts2.png'));
export const BACKS = [
  loader.load(require('./back1.png')),
  loader.load(require('./back2.png')),
  loader.load(require('./back3.png')),
  loader.load(require('./back4.png')),
  loader.load(require('./back5.png')),
  loader.load(require('./back6.png')),
  loader.load(require('./back7.png')),
]

const fronts:{[key:string]: THREE.Texture} = {
  SPADE_ACE: SPADE_ACE,
  SPADE_2: SPADE_2,
  SPADE_3: SPADE_3,
  SPADE_4: SPADE_4,
  SPADE_5: SPADE_5,
  SPADE_6: SPADE_6,
  SPADE_7: SPADE_7,
  SPADE_8: SPADE_8,
  SPADE_9: SPADE_9,
  SPADE_10: SPADE_10,
  SPADE_JACK: SPADE_JACK,
  SPADE_QUEEN: SPADE_QUEEN,
  SPADE_KING: SPADE_KING,
  CLUB_ACE: CLUB_ACE,
  CLUB_2: CLUB_2,
  CLUB_3: CLUB_3,
  CLUB_4: CLUB_4,
  CLUB_5: CLUB_5,
  CLUB_6: CLUB_6,
  CLUB_7: CLUB_7,
  CLUB_8: CLUB_8,
  CLUB_9: CLUB_9,
  CLUB_10: CLUB_10,
  CLUB_JACK: CLUB_JACK,
  CLUB_QUEEN: CLUB_QUEEN,
  CLUB_KING: CLUB_KING,
  DIAMOND_ACE: DIAMOND_ACE,
  DIAMOND_2: DIAMOND_2,
  DIAMOND_3: DIAMOND_3,
  DIAMOND_4: DIAMOND_4,
  DIAMOND_5: DIAMOND_5,
  DIAMOND_6: DIAMOND_6,
  DIAMOND_7: DIAMOND_7,
  DIAMOND_8: DIAMOND_8,
  DIAMOND_9: DIAMOND_9,
  DIAMOND_10: DIAMOND_10,
  DIAMOND_JACK: DIAMOND_JACK,
  DIAMOND_QUEEN: DIAMOND_QUEEN,
  DIAMOND_KING: DIAMOND_KING,
  HEART_ACE: HEART_ACE,
  HEART_2: HEART_2,
  HEART_3: HEART_3,
  HEART_4: HEART_4,
  HEART_5: HEART_5,
  HEART_6: HEART_6,
  HEART_7: HEART_7,
  HEART_8: HEART_8,
  HEART_9: HEART_9,
  HEART_10: HEART_10,
  HEART_JACK: HEART_JACK,
  HEART_QUEEN: HEART_QUEEN,
  HEART_KING: HEART_KING,
}
export default {
  fronts: fronts,
  backs: BACKS,
};