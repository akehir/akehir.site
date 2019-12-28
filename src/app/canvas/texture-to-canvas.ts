
export function textureToCanvas (texture, width, height) {
  let captureCanvas = document.createElement('canvas');
  let ctx = captureCanvas.getContext('2d');
  captureCanvas.width = width;
  captureCanvas.height = height;

  let imageData = ctx.createImageData(width, height);
  imageData.data.set(texture);
  ctx.putImageData(imageData, 0, 0);

  return captureCanvas;
}
