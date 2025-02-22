// scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
export function scaleX(
  x: number,
  width: number,
  scale: number = 2.5,
  offset: number = 2
): number {
  return x / (width / scale) - offset;
}
