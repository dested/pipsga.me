import {AssetManager, Asset} from './assetManager';
import {HexagonColor, DrawingUtils} from '../utils/drawingUtilities';
import {GridHexagon} from '../common/gridHexagon';
import {GridHexagonConstants} from '../common/hexLibraries/gridHexagonConstants';

export class ClientGridHexagon extends GridHexagon {
  icon?: Asset;
  highlightColor?: HexagonColor;
  hexColor?: HexagonColor;
  topPath?: Path2D;
  leftDepthPath?: Path2D;
  bottomDepthPath?: Path2D;
  rightDepthPath?: Path2D;
  drawCache?: HTMLCanvasElement;

  setIcon(name: string) {
    if (name) {
      this.icon = AssetManager.assets[name];
    } else {
      this.icon = undefined;
    }
    this.invalidate();
  }

  setColor(hexColor: HexagonColor) {
    if (this.hexColor !== hexColor) {
      this.hexColor = hexColor;
      this.invalidate();
    }
  }

  setHighlight(hexColor: HexagonColor | undefined) {
    if (this.highlightColor !== hexColor) {
      this.highlightColor = hexColor;
      this.invalidate();
    }
  }

  setHeightOffset(heightOffset: number) {
    if (this.heightOffset !== heightOffset) {
      this.heightOffset = heightOffset;
      this.buildPaths();
    }
  }

  buildPaths() {
    const depthHeight = this.getDepthHeight();
    this.topPath = ClientGridHexagon.buildPath(GridHexagonConstants.hexagonTopPolygon());
    this.leftDepthPath = ClientGridHexagon.buildPath(GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
    this.bottomDepthPath = ClientGridHexagon.buildPath(GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
    this.rightDepthPath = ClientGridHexagon.buildPath(GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
  }

  getDrawingColor() {
    return (this.highlightColor || this.hexColor)!;
  }

  drawLeftDepth(context: CanvasRenderingContext2D) {
    const drawingColor = this.getDrawingColor();
    if (this.leftDepthPath && drawingColor) {
      context.save();
      context.save();
      context.clip(this.leftDepthPath);
      if (AssetManager.assets.tile.image) {
        context.fillStyle = context.createPattern(AssetManager.assets.tile.image, 'repeat')!;
        context.fillRect(
          -GridHexagonConstants.width / 2,
          -GridHexagonConstants.height() / 2,
          GridHexagonConstants.width * 2,
          GridHexagonConstants.height() * 2
        ); // context.fillRect(x, y, width, height);
      }

      context.fillStyle = DrawingUtils.makeTransparent(drawingColor.dark1, 0.75);
      context.fill(this.leftDepthPath);
      context.restore();
      context.lineWidth = 3;

      context.strokeStyle = drawingColor.dark1;
      context.stroke(this.leftDepthPath);
      context.restore();
    }
  }

  drawBottomDepth(context: CanvasRenderingContext2D) {
    const drawingColor = this.getDrawingColor();
    if (this.bottomDepthPath) {
      context.save();
      context.save();
      context.clip(this.bottomDepthPath);
      if (AssetManager.assets.tile.image) {
        context.fillStyle = context.createPattern(AssetManager.assets.tile.image, 'repeat')!;
        context.fillRect(
          -GridHexagonConstants.width / 2,
          -GridHexagonConstants.height() / 2,
          GridHexagonConstants.width * 2,
          GridHexagonConstants.height() * 2
        ); // context.fillRect(x, y, width, height);

        context.fillStyle = DrawingUtils.makeTransparent(drawingColor.dark2, 0.75);
        context.fill(this.bottomDepthPath);
      }
      context.restore();
      context.lineWidth = 3;

      context.strokeStyle = drawingColor.dark2;
      context.stroke(this.bottomDepthPath);
      context.restore();
    }
  }

  drawRightDepth(context: CanvasRenderingContext2D) {
    if (this.rightDepthPath) {
      context.save();
      context.save();
      context.clip(this.rightDepthPath);
      if (AssetManager.assets.tile.image) {
        context.fillStyle = context.createPattern(AssetManager.assets.tile.image, 'repeat')!;
        context.fillRect(
          -GridHexagonConstants.width / 2,
          -GridHexagonConstants.height() / 2,
          GridHexagonConstants.width * 2,
          GridHexagonConstants.height() * 2
        ); // context.fillRect(x, y, width, height);

        context.fillStyle = DrawingUtils.makeTransparent(this.getDrawingColor().dark3, 0.75);
        context.fill(this.rightDepthPath);
      }
      context.restore();

      context.lineWidth = 3;

      context.strokeStyle = this.getDrawingColor().dark3;
      context.stroke(this.rightDepthPath);
      context.restore();
    }
  }

  drawTop(context: CanvasRenderingContext2D) {
    if (this.topPath) {
      context.save();

      context.save();
      context.clip(this.topPath);
      if (AssetManager.assets.tile.image) {
        context.fillStyle = context.createPattern(AssetManager.assets.tile.image, 'repeat')!;
        context.fillRect(
          -GridHexagonConstants.width / 2,
          -GridHexagonConstants.height() / 2,
          GridHexagonConstants.width,
          GridHexagonConstants.height()
        ); // context.fillRect(x, y, width, height);

        context.fillStyle = DrawingUtils.makeTransparent(this.getDrawingColor().color, 0.6);
        context.fill(this.topPath);
      }
      context.restore();
      context.lineWidth = 3;

      context.strokeStyle = this.getDrawingColor().darkBorder;
      context.stroke(this.topPath);
      context.restore();
    }
  }

  drawIcon(context: CanvasRenderingContext2D) {
    if (this.icon) {
      context.save();
      context.translate(-this.icon.base.x, -this.icon.base.y);
      const width = this.icon.size.width;
      const height = this.icon.size.height;
      context.drawImage(this.icon.image!, 0, 0, width, height);
      context.restore();
    }
  }

  invalidate() {
    this.drawCache = undefined;
  }

  envelope() {
    const size = {width: 0, height: 0};
    size.width = GridHexagonConstants.width;
    size.height = GridHexagonConstants.height();

    if (this.icon) {
      size.height = Math.max(size.height, this.icon.base.y + size.height / 2);
    }

    size.height += this.getDepthHeight();

    size.width += 12;
    size.height += 6;

    return size;
  }

  hexCenter() {
    const center = {x: 0, y: 0};

    center.y = GridHexagonConstants.height() / 2;
    if (this.icon) {
      center.y = Math.max(center.y, this.icon.base.y);
    }

    center.x = GridHexagonConstants.width / 2;
    if (this.icon) {
      // center.x = center.x; todo maybe offset
    }

    center.x += 6;
    center.y += 6;
    return center;
  }

  draw(context: CanvasRenderingContext2D) {
    const center = this.hexCenter();
    if (this.drawCache) {
      context.drawImage(this.drawCache, -center.x, -center.y);
    } else {
      const c = ClientGridHexagon.getCacheImage(this.getDepthHeight(), this.icon, this.getDrawingColor());
      if (!c) {
        const can = document.createElement('canvas');
        const ctx = can.getContext('2d')!;

        const size = this.envelope();
        can.width = size.width;
        can.height = size.height;
        ctx.save();

        ctx.translate(center.x, center.y);
        if (this.getDepthHeight() > 1) {
          this.drawLeftDepth(ctx);
          this.drawBottomDepth(ctx);
          this.drawRightDepth(ctx);
        }

        ctx.save();
        ctx.lineWidth = 1;
        // ctx.lineCap = "round";
        // ctx.lineJoin = "round";
        this.drawTop(ctx);
        ctx.restore();

        this.drawIcon(ctx);
        ctx.restore();

        ClientGridHexagon.setCacheImage(this.getDepthHeight(), this.icon, this.getDrawingColor(), can);
        /*       ctx.strokeStyle='black';
                 ctx.lineWidth=1;
                 ctx.strokeRect(0,0,can.width,can.height);*/
        this.drawCache = can;
      } else {
        this.drawCache = c;
      }
      this.draw(context);
    }
  }

  static caches: {[key: string]: HTMLCanvasElement} = {};

  static getCacheImage(height: number, icon: Asset | undefined, hexColor: HexagonColor): HTMLCanvasElement {
    const c = `${icon ? icon.name : ''}-${height}-${hexColor.color}`;
    return ClientGridHexagon.caches[c];
  }

  static setCacheImage(height: number, icon: Asset | undefined, hexColor: HexagonColor, img: HTMLCanvasElement) {
    const c = `${icon ? icon.name : ''}-${height}-${hexColor.color}`;
    ClientGridHexagon.caches[c] = img;
  }

  static buildPath(path: {x: number; y: number}[]): Path2D {
    const p2d = new Path2D();
    for (const point of path) {
      p2d.lineTo(point.x, point.y);
    }
    return p2d;
  }
}
