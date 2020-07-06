export class Help {
  static mod(j: number, n: number): number {
    return ((j % n) + n) % n;
  }
  private static getBase64Image(data: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(data, 0, 0);
    return canvas.toDataURL('image/png');
  }
  static getImageData(image: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
  }
  static isLoaded(element: HTMLImageElement): boolean {
    return element.getAttribute('loaded') === 'true';
  }
  static loaded(element: HTMLImageElement, set: boolean): void {
    element.setAttribute('loaded', set ? 'true' : 'false');
  }
  static loadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
    const sprite1 = new Image();
    sprite1.addEventListener(
      'load',
      () => {
        Help.loaded(sprite1, true);
        if (complete) complete(sprite1);
      },
      false
    );
    sprite1.src = src;
    return sprite1;
  }
  static degToRad(angle: number): number {
    return (angle * Math.PI) / 180;
  }
  static sign(m: number): number {
    return m === 0 ? 0 : m < 0 ? -1 : 1;
  }
  static floor(spinDashSpeed: number): number {
    if (spinDashSpeed > 0) return ~~spinDashSpeed;
    return Math.floor(spinDashSpeed) | 0;
  }
  static max(f1: number, f2: number): number {
    return f1 < f2 ? f2 : f1;
  }
  static min(f1: number, f2: number): number {
    return f1 > f2 ? f2 : f1;
  }
}
