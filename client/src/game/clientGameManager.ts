import {ClientHeliSprite} from './clientSpriteManager';
import {HexagonColor} from './utils/drawingUtilities';
import {HexUtils, Vector3d} from './common/hexLibraries/hexUtils';
import {ClientGridHexagon} from './hexLibraries/clientGridHexagon';
import {ClientHexBoard} from './hexLibraries/clientHexBoard';
import {GridHexagon} from './common/gridHexagon';
import {GameBoard} from './gameBoard';
import {assertType} from '../utils';
import Hammer from 'hammerjs';

export class ClientGameManager {
  private hexBoard: ClientHexBoard;
  private context: CanvasRenderingContext2D;

  static baseColor = new HexagonColor('#FFFFFF');
  static highlightColor = new HexagonColor('#00F9FF');
  static selectedHighlightColor = new HexagonColor('#6B90FF');
  static moveHighlightColor = new HexagonColor('#BE9EFF');
  static attackHighlightColor = new HexagonColor('#91F9CF');

  swipeVelocity = {x: 0, y: 0};
  tapStart = {x: 0, y: 0};

  constructor(private canvas: HTMLCanvasElement, menu: HTMLCanvasElement, overlay: HTMLDivElement) {
    this.hexBoard = new ClientHexBoard();

    this.context = this.canvas.getContext('2d')!;

    const mc = new Hammer.Manager(overlay);
    mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Tap());

    window.onresize = () => {
      this.canvas.width = document.body.clientWidth;
      this.canvas.height = document.body.clientHeight;
    };
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    this.hexBoard.resize(this.canvas.width, this.canvas.height);

    mc.on('panstart', (ev) => {
      this.swipeVelocity.x = this.swipeVelocity.y = 0;
      this.tapStart.x = this.hexBoard.viewPort.x;
      this.tapStart.y = this.hexBoard.viewPort.y;
      this.hexBoard.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
    });
    mc.on('panmove', (ev) => {
      this.hexBoard.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
    });

    mc.on('swipe', (ev) => {
      this.swipeVelocity.x -= ev.velocityX * 10;
      this.swipeVelocity.y -= ev.velocityY * 10;
    });

    mc.on('tap', (ev) => {
      const x = ev.center.x as number;
      const y = ev.center.y as number;

      this.tapHex(x, y);
    });

    this.draw();

    this.hexBoard.initialize(GameBoard.generateBoard());
  }

  startAction(item: ClientGridHexagon) {
    const radius = 5;
    const spots = this.findAvailableSpots<ClientGridHexagon>(radius, item);
    for (const spot of spots) {
      const sprites = this.hexBoard.clientSpriteManager.spritesMap[spot.x + spot.z * 5000];
      if (spot === item || (sprites && sprites.length > 0)) continue;
      const path = this.hexBoard.pathFind(item, spot);
      if (path.length > 1 && path.length <= radius + 1) {
        spot.setHighlight(ClientGameManager.moveHighlightColor);
        spot.setHeightOffset(0.25);
      }
    }
  }

  findAvailableSpots<TGridHexagon extends GridHexagon>(radius: number, center: Vector3d): TGridHexagon[] {
    const items: TGridHexagon[] = [];
    for (const gridHexagon of this.hexBoard.hexList) {
      if (HexUtils.distance(center, gridHexagon) <= radius) {
        items.push(gridHexagon as TGridHexagon);
      }
    }

    return items;
  }

  drawIndex = 0;

  draw() {
    requestAnimationFrame(() => {
      this.draw();
    });
    this.tick();
    this.canvas.width = this.canvas.width;
    this.hexBoard.drawBoard(this.context);
  }

  tick() {
    if (Math.abs(this.swipeVelocity.x) > 0) {
      const sign = HexUtils.mathSign(this.swipeVelocity.x);
      this.swipeVelocity.x += 0.7 * -sign;
      if (HexUtils.mathSign(this.swipeVelocity.x) !== sign) {
        this.swipeVelocity.x = 0;
      }
    }

    if (Math.abs(this.swipeVelocity.y) > 0) {
      const sign = HexUtils.mathSign(this.swipeVelocity.y);
      this.swipeVelocity.y += 0.7 * -sign;
      if (HexUtils.mathSign(this.swipeVelocity.y) !== sign) {
        this.swipeVelocity.y = 0;
      }
    }
    // if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0)
    {
      this.hexBoard.offsetView(this.swipeVelocity.x, this.swipeVelocity.y);
    }
    this.hexBoard.clientSpriteManager.tick();
  }

  private selectedHex?: GridHexagon;

  private tapHex(x: number, y: number) {
    this.swipeVelocity.x = this.swipeVelocity.y = 0;

    /* if (this.menuManager.tap(x, y)) {
         return;
         }
         this.menuManager.closeMenu();*/

    for (const gridHexagon of this.hexBoard.hexList) {
      assertType<ClientGridHexagon>(gridHexagon);
      gridHexagon.setHighlight(undefined);
      gridHexagon.setHeightOffset(0);
    }

    const item = this.hexBoard.getHexAtPoint(x, y);
    if (!item) return;

    if (this.selectedHex) {
      const sprite = this.hexBoard.clientSpriteManager.getSpritesAtTile(this.selectedHex)[0] as ClientHeliSprite;
      if (!sprite) {
        this.selectedHex = undefined;
        return;
      }

      const path = this.hexBoard.pathFind(this.selectedHex, item);
      for (let i = 1; i < path.length; i++) {
        const p = path[i];
        const oldP = path[i - 1];
        setTimeout(() => {
          sprite.currentDirection = HexUtils.getDirection(oldP, p);
          const hexAtSpot = this.hexBoard.getHexAtSpot(p.x, p.y, p.z);
          if (hexAtSpot) {
            sprite.setTile(hexAtSpot);
          }
        }, i * 500);
      }
      this.selectedHex = undefined;
      return;
    }

    this.selectedHex = item;

    const sprites = this.hexBoard.clientSpriteManager.getSpritesAtTile(item);
    if (sprites && sprites.length > 0) {
      item.setHighlight(ClientGameManager.selectedHighlightColor);
      item.setHeightOffset(0.25);
      this.startAction(item);
    }
  }
}
