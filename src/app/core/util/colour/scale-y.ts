// scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
export function scaleY(
  y: number,
  height: number,
  scale = 2,
  offset = 1
): number {
  return y / (height / scale) - offset;
}
