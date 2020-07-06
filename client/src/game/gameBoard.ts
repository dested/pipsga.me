import {HexBoardModel} from './common/models/hexBoard';
import Noise from 'simplex-noise';

function random(bottom: number, top: number): number {
  return (Math.random() * (top - bottom) + bottom) | 0;
}

export class GameBoard {
  static generateBoard() {
    const board: HexBoardModel = {
      boardStr: '',
      width: 84 * 5,
      height: 84 * 5,
    };
    let boardStr = '';
    const noise = new Noise(Math.random);
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        let str = 0;
        if (random(0, 100) < 10) {
          str = 0;
        } else {
          if (random(0, 100) < 15) str = 2;
          else if (random(0, 100) < 6) str = 1;
          else str = 1;
        }

        const value = Math.abs(noise.noise2D(x / 90, y / 90)) * 90;
        boardStr += ((value / 15) | 0).toString();
        // console.log(value,(value|0).toString(),((value|0)+1).toString());
      }
      boardStr += '|';
    }
    board.boardStr = boardStr;
    return board;
  }
}
