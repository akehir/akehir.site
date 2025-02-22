import { Injectable } from '@angular/core';

import { Style } from '../types';

@Injectable()
export class ConsoleService {
  public pastCommands: Array<{ message: string; style: Style }> = [];

  constructor() {}

  clear() {
    this.pastCommands.length = 0;
  }

  push(message: string, style?: Style) {
    // todo: clear oldest entries if length too big
    // if (this.pastCommands.length > 20) {
    //   this.clear();
    // }

    this.pastCommands.push({
      message: message,
      style: style || { colour: '#777' },
    });
  }

  printHelp() {
    this.pastCommands = [
      { message: 'Welcome!', style: { colour: '#777' } },
      {
        message: 'You can type the following commands:',
        style: { colour: '#777' },
      },
      { message: "'clear': Clear the console.", style: { colour: '#777' } },
      { message: "'ls': List directories.", style: { colour: '#777' } },
      { message: "'cd': Navigate.", style: { colour: '#777' } },
      {
        message: "'kubectl top': Kubernetes stats.",
        style: { colour: '#777' },
      },
      {
        message: "'mandelbrot': Draw a mandelbrot fractal.",
        style: { colour: '#777' },
      },
      {
        message: "'circle': Draw 3 colour circles.",
        style: { colour: '#777' },
      },
      { message: "'square': Draw colour squares.", style: { colour: '#777' } },
      { message: '', style: { colour: '#777' } },
    ];
  }
}
