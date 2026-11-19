/**
 * Minimal jsdom gap mocks for the Jest environment (imported from `setup-jest.ts`).
 *
 * jsdom does not implement `HTMLCanvasElement.prototype.getContext` (it logs a
 * "not implemented" error and returns `null`), while Karma ran the suite in
 * Chrome where the 2D context exists natively. `ColourComponent` obtains a 2D
 * context in `ngAfterViewInit`, so a stub restores parity. Only the surface the
 * app actually uses is implemented.
 */
const createMock2dContext = (): CanvasRenderingContext2D => {
  const noop = (): void => undefined;

  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    save: noop,
    restore: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    stroke: noop,
    fill: noop,
    clearRect: noop,
    fillRect: noop,
    strokeRect: noop,
    translate: noop,
    rotate: noop,
    scale: noop,
    drawImage: noop,
    putImageData: noop,
    getImageData: (x: number, y: number, width: number, height: number) =>
      ({
        width,
        height,
        colorSpace: 'srgb',
        data: new Uint8ClampedArray(Math.max(1, width * height * 4)),
      }) as ImageData,
  } as unknown as CanvasRenderingContext2D;
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function (this: HTMLCanvasElement, contextId: string) {
    return contextId === '2d' ? createMock2dContext() : null;
  },
  writable: true,
  configurable: true,
});
