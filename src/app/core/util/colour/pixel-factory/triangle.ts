import { getColourValue } from '@core/types';
import { checkFactory } from '../check/check-factory';

export function triangle(
  variant: string,
  xoffset = 0,
  yoffset = 0
): getColourValue {
  const colour = checkFactory(variant);

  return (p: number, q: number, offset: number): number => {
    return colour((p + xoffset) ^ (q + yoffset) ^ offset);
    // TODO: Implement
    // Private Sub Command1_Click()
    // Command8.Left = 10080
    // Command8.Top = 120
    // Command8.Width = 1215
    // Command8.Height = 495
    //
    // 'so varis zum steuern:
    // a2 = Text2.Text
    // a1 = 0
    // ProgressBar1.Min = 0
    // ProgressBar1.Max = a2
    // ProgressBar1.Value = 0
    // aa = 1
    // b = True
    // 'Grunddreieck zeichnen
    // x1 = Text3.Text
    // y1 = Text4.Text
    // x2 = Text5.Text
    // y2 = Text6.Text
    // x3 = Text7.Text
    // y3 = Text8.Text
    //
    // Picture1.Line (x1, y1)-(x2, y2)
    // Picture1.Line (x2, y2)-(x3, y3)
    // Picture1.Line (x3, y3)-(x1, y1)
    //
    // 'Ausrechnen der teilerverhältnisse:
    // teiler = Text1.Text
    // teilerx = teiler
    // teilery = teiler
    //
    // 'Zeichnen und berechnen der weiteren Seiten
    // Do While b = True
    //
    // DoEvents
    //
    // xt1 = x3 - (x3 - x2) / teilerx
    // yt1 = y3 + (y2 - y3) / teilery
    // xt2 = x2 + (x1 - x2) / teilerx
    // yt2 = y2 - (y2 - y1) / teilery
    // xt3 = x1 + (xt1 - x1) / teilerx
    // yt3 = y1 + (yt1 - y1) / teilery
    //
    // Picture1.Line (x1, y1)-(xt1, yt1), QBColor(color1)
    // Picture1.Line (xt1, yt1)-(xt2, yt2), QBColor(color2)
    // Picture1.Line (xt2, yt2)-(xt3, yt3), QBColor(color3)
    //
    // x1 = xt3
    // y1 = yt3
    // x2 = xt2
    // y2 = yt2
    // x3 = xt1
    // y3 = yt1
    //
    // If ProgressBar1.Value = ProgressBar1.Max Then
    //     b = False
    //     Exit Do
    // End If
    //
    // a1 = a1 + 1
    // ProgressBar1.Value = a1
    //
    // Loop
    //
    // End
  };
}
