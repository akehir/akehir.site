export function correctRadius (canvas: HTMLCanvasElement, radius) {
  let aspectRatio = canvas.width / canvas.height;
  if (aspectRatio > 1)
    radius *= aspectRatio;
  return radius;
}
