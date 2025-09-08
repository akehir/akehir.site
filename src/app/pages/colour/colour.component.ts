import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  NgZone,
  ChangeDetectionStrategy,
  DOCUMENT,
  inject,
} from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

import { fromEvent } from 'rxjs';

import { switchMap, takeUntil, pairwise, delay, repeat } from 'rxjs/operators';
import { ColourService } from '@core/services/colour.service';
import { ConsoleService } from '@core/services/console.service';
import { Colour, getColourValue, Position } from '@core/types';
import { copyToClipboard } from '@core/util';

@Component({
  selector: 'ake-colour',
  templateUrl: './colour.component.html',
  styleUrls: ['./colour.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColourComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private colours = inject(ColourService);
  private console = inject(ConsoleService);
  private zone = inject(NgZone);
  private document = inject<Document>(DOCUMENT);

  @ViewChild('canvas') canvas: ElementRef;

  private context: CanvasRenderingContext2D;

  private colourMax = 255;

  private drawWidth = 1;
  private drawHeight = 1;

  private redValueComponent: number;
  private greenValueComponent: number;
  private blueValueComponent: number;

  public width: number;
  public height: number;

  private red: getColourValue;
  private green: getColourValue;
  private blue: getColourValue;

  private redValue = 255;
  private greenValue = 255;
  private blueValue = 255;

  private redOffsetX = 127.5;
  private redOffsetY = 0;
  private greenOffsetX = 0;
  private greenOffsetY = 221;
  private blueOffsetX = 255;
  private blueOffsetY = 221;

  getColour(position: Position): Colour {
    // Get the color data of the canvas version of our element at that location
    const rgba = this.context.getImageData(position.x, position.y, 1, 1).data;

    let r = rgba[0].toString(16);
    let g = rgba[1].toString(16);
    let b = rgba[2].toString(16);
    let a = rgba[3].toString(16);

    // todo: dry
    if (r.length === 1) {
      r = '0' + r;
    }
    // todo: dry
    if (g.length === 1) {
      g = '0' + g;
    }
    // todo: dry
    if (b.length === 1) {
      b = '0' + b;
    }
    // todo: dry
    if (a.length === 1) {
      a = '0' + a;
    }

    const hex = '#' + r + g + b;

    copyToClipboard(hex);

    this.console.push(`${hex} has been copied to the clipboard.`, {
      colour: hex,
    });

    return {
      rgba: rgba,
      hex: hex,
    };
  }

  clickColour($event) {
    this.getColour({ x: $event.offsetX, y: $event.offsetY });
  }

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');

    this.height = window
      ? Math.floor(window.innerHeight / 10) * 10
      : this.canvas.nativeElement.height;
    this.width = window
      ? Math.floor(window.innerWidth / 10) * 10
      : this.canvas.nativeElement.width;
    this.canvas.nativeElement.height = this.height;
    this.canvas.nativeElement.width = this.width;

    // set some default properties about the line
    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#fff';

    this.route.params.subscribe((params: Params) => {
      const drawing = params['drawing'] ? params['drawing'] : 'random';
      this.zone.runOutsideAngular(() => {
        this.draw(drawing);
      });
    });

    // todo: draw or do things by drawing.
    this.zone.runOutsideAngular(() => {
      this.captureEvents();
    });
  }

  draw(algorithm: string) {
    this.setup(algorithm);
    this.pixelLoop(
      this.redValueComponent,
      this.greenValueComponent,
      this.blueValueComponent
    );
  }

  clear(): void {
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.width, this.height);
  }

  setup(algorithm: string) {
    const rox = Number(this.redOffsetX || 0);
    const roy = Number(this.redOffsetY || 0);
    const gox = Number(this.greenOffsetX || 0);
    const goy = Number(this.greenOffsetY || 0);
    const box = Number(this.blueOffsetX || 0);
    const boy = Number(this.blueOffsetY || 0);

    this.redValueComponent = Number(this.redValue || this.colourMax);
    this.greenValueComponent = Number(this.greenValue || this.colourMax);
    this.blueValueComponent = Number(this.blueValue || this.colourMax);

    this.red = this.getRedValueFactory(algorithm, rox, roy);
    this.green = this.getGreenValueFactory(algorithm, gox, goy);
    this.blue = this.getBlueValueFactory(algorithm, box, boy);
  }

  putSquare(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    w: number,
    h: number,
    a: number = 1
  ): void {
    this.context.fillStyle = `rgba(${r},${g},${b},${a})`;
    this.context.fillRect(x, y, w, h);
  }

  private getRedValueFactory(
    variant: string,
    xoffset: number = 127.5,
    yoffset: number = 0
  ): getColourValue {
    return this.colours.pixelFactory(
      variant,
      xoffset,
      yoffset,
      this.width,
      this.height
    );
  }

  private getGreenValueFactory(
    variant: string,
    xoffset: number = 0,
    yoffset: number = 221
  ): getColourValue {
    return this.colours.pixelFactory(
      variant,
      xoffset,
      yoffset,
      this.width,
      this.height
    );
  }

  private getBlueValueFactory(
    variant: string,
    xoffset: number = this.colourMax,
    yoffset: number = 221
  ): getColourValue {
    return this.colours.pixelFactory(
      variant,
      xoffset,
      yoffset,
      this.width,
      this.height
    );
  }

  private pixelLoop(
    rr: number = this.colourMax,
    gg: number = this.colourMax,
    bb: number = this.colourMax
  ): void {
    // console.log(this.width, this.height);
    const w: number = this.drawWidth;
    const h: number = this.drawHeight;
    let p = 0;
    let q = 0;
    let ops = 0;

    for (let i = 0; i <= this.height; i += h) {
      for (let j = 0; j <= this.width; j += w) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ops += 1;

        const R: number = this.red(p, q, rr);
        const G: number = this.green(p, q, gg);
        const B: number = this.blue(p, q, bb);

        this.putSquare(p, q, R, G, B, w, h);

        p = p + w;
      }

      q = q + h;
      p = 0;
    }
  }

  // to draw etc...
  private captureEvents() {
    fromEvent(this.canvas.nativeElement, 'mousedown')
      .pipe(
        delay(32),
        takeUntil(fromEvent(this.canvas.nativeElement, 'mouseup')),
        repeat(),
        switchMap(() => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(this.canvas.nativeElement, 'mousemove').pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(this.canvas.nativeElement, 'mouseup')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(this.canvas.nativeElement, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = this.canvas.nativeElement.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: Position, currentPos: Position) {
    // incase the context is not set
    if (!this.context) {
      return;
    }

    // start our drawing path
    this.context.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.context.moveTo(prevPos.x, prevPos.y); // from
      // draws a line from the start pos until the current position
      this.context.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.context.stroke();
    }
  }
}
