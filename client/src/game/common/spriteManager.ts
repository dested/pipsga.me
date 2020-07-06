import {GridHexagon} from './gridHexagon';
export class SpriteManager {
  sprites: Sprite[] = [];
  spritesMap: {[tileKey: number]: Sprite[]} = {};

  addSprite(sprite: Sprite) {
    this.sprites.push(sprite);
  }

  tick() {
    for (const sprite of this.sprites) {
      sprite.tick();
    }
  }

  getSpritesAtTile(item: GridHexagon): Sprite[] {
    return this.spritesMap[item.x + item.z * 5000] || [];
  }
}

export class Sprite {
  x: number = 0;
  y: number = 0;
  tile?: GridHexagon;
  key?: string;
  spriteManager: SpriteManager;

  constructor(spriteManager: SpriteManager) {
    this.spriteManager = spriteManager;
  }

  tick() {}

  setTile(tile: GridHexagon) {
    if (this.tile) {
      let sprites = this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000];
      sprites = sprites || [];
      sprites.splice(sprites.indexOf(this), 1);
      this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000] = sprites;
    }

    this.tile = tile;

    if (tile) {
      this.x = this.tile.getRealX();
      this.y = this.tile.getRealY();
      let sprites = this.spriteManager.spritesMap[tile.x + tile.z * 5000];
      sprites = sprites || [];
      sprites.push(this);
      this.spriteManager.spritesMap[tile.x + tile.z * 5000] = sprites;
    }
  }
}
