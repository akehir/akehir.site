import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { timer } from 'rxjs';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import {
  FontAwesomeIconsModule,
  FontAwesomeIconsRegistry,
} from '@triangular/font-awesome-icons';
import { fontAwesomeIconTerminal } from '@triangular/font-awesome-icons/icons';
import { ConsoleService } from '@core/services/console.service';
import { NgForOf } from '@angular/common';
import { projectList } from '@core/data';

@Component({
  selector: 'ake-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, FontAwesomeIconsModule, NgForOf],
})
export class ConsoleComponent implements AfterViewInit {
  public command: string;
  private helpUsed = false;

  @ViewChild('consoleForm') consoleForm: NgForm;
  @ViewChild('inputArea') inputArea: ElementRef;

  constructor(
    private focusTrap: ConfigurableFocusTrapFactory,
    private router: Router,
    public console: ConsoleService,
    private registry: FontAwesomeIconsRegistry
  ) {
    this.registry.registerIcons([fontAwesomeIconTerminal]);
  }

  ngAfterViewInit() {
    const focusTrap = this.focusTrap.create(this.inputArea.nativeElement);
    timer(6000).subscribe(() => {
      focusTrap.focusInitialElement();
    });
  }

  onSubmit() {
    const newOrder = this.command;
    this.command = '';

    if (this.helpUsed) {
      this.helpUsed = false;
      this.console.clear();
    }
    this.console.push(newOrder);

    if (newOrder.startsWith('ls')) {
      if (newOrder.startsWith('ls projects')) {
        const projects = Object.keys(projectList);
        this.console.clear();
        this.console.push(newOrder);
        for (let i = 0; i < projects.length; i++) {
          this.console.push(projects[i]);
        }
      } /* ... todo */ else {
        this.console.clear();
        this.console.push(newOrder);
        this.console.push('about');
        this.console.push('blog');
        this.console.push('curriculum');
        this.console.push('demos');
        this.console.push('gadgets');
        this.console.push('home');
        this.console.push('projects');
        this.console.push('software');
        this.console.push('software');
        this.console.push('testimonials');
      }
    } else if (newOrder.startsWith('cd')) {
      if (newOrder.startsWith('cd projects')) {
        this.router.navigate(['/', 'projects']);
      } /* ... todo */ else {
        this.router.navigate(['/']);
      }
    }

    switch (newOrder) {
      case 'clear':
        this.console.clear();
        break;
      case 'r':
      case 'random':
        this.router.navigate(['/', 'demos', 'colour', 'random']);
        break;
      case 'm':
      case 'mandel':
      case 'mandelbrot':
        this.router.navigate(['/', 'demos', 'colour', 'legacy-mandelbrot']);
        break;
      case 'mm':
      case 'mandelbrot-2':
        this.router.navigate(['/', 'demos', 'colour', 'mandelbrot']);
        break;
      case 'c':
      case 'circle':
        this.router.navigate(['/', 'demos', 'colour', 'circle']);
        break;
      case 'c2':
      case 'circle2':
        this.router.navigate(['/', 'demos', 'colour', 'circle2']);
        break;
      case 'c3':
      case 'circle3':
        this.router.navigate(['/', 'demos', 'colour', 'circle3']);
        break;
      case 'c4':
      case 'circle4':
        this.router.navigate(['/', 'demos', 'colour', 'circle4']);
        break;
      case 'c5':
      case 'circle5':
        this.router.navigate(['/', 'demos', 'colour', 'circle5']);
        break;
      case 'c6':
      case 'circle6':
        this.router.navigate(['/', 'demos', 'colour', 'circle6']);
        break;
      case 's':
      case 'simple':
        this.router.navigate([
          '/',
          'demos',
          'colour',
          'circle-simple-algorithm',
        ]);
        break;
      case 'o':
      case 'ochsen':
        this.router.navigate(['/', 'demos', 'colour', 'ochsenbrot']);
        break;
      case 'sq':
      case 'square':
        this.router.navigate(['/', 'demos', 'colour', 'square-square']);
        break;
      case 't':
      case 'triangle':
        this.router.navigate(['/', 'demos', 'colour', 'triangle']);
        break;
      case 'h':
      case 'man':
      case 'help':
        this.printHelp();
        break;
      default:
      // this.router.navigate(['/']);
    }
  }

  printHelp() {
    this.helpUsed = true;
    this.console.printHelp();
  }
}
