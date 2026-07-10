// scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
export function scaleX(
  x: number,
  width: number,
  scale = 2.5,
  offset = 2
): number {
  return x / (width / scale) - offset;
}
