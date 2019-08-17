import {
  Input,
  Inject,
  OnInit,
  Output,
  Renderer2,
  Component,
  EventEmitter,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ResponsiveLayoutService } from '../responsive-layout.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'tt-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() navOpened: boolean;
  @Output() toggle = new EventEmitter<void>();

  isLoading: Observable<boolean>;
  isResponsiveLayout: Observable<boolean>;
  isDarkMode = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private responsiveLayoutService: ResponsiveLayoutService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const hours = new Date().getHours();
    if ((hours < 7 || hours > 20) && isPlatformBrowser(this.platformId)) {
      this.toggleDarkMode();
    }
    this.isResponsiveLayout = this.responsiveLayoutService.isSmallOrSmaller.pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.isLoading = this.loadingService.isLoading;
  }

  toggleMenu() {
    this.toggle.emit();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark');
    }
  }
}
