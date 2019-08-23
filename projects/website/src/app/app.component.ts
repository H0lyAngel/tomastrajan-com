import { Router } from '@angular/router';
import { Component, OnInit, HostBinding } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, map, startWith, tap } from 'rxjs/operators';

import { ResponsiveLayoutService } from './core/layout/responsive-layout.service';

@Component({
  selector: 'tt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class')
  demoRootCssClass = '';

  navOpened: Observable<boolean>;
  navToggled = new BehaviorSubject(false);
  isSmallOrSmaller: Observable<boolean>;
  sidenavMode: Observable<string>;

  constructor(
    private router: Router,
    private responsiveLayoutService: ResponsiveLayoutService
  ) {}

  ngOnInit() {
    this.isSmallOrSmaller = combineLatest(
      this.responsiveLayoutService.isSmallOrSmaller,
      this.responsiveLayoutService.isLargeOrBigger,
      this.responsiveLayoutService.columnCount
    ).pipe(
      delay(1),
      tap(([isSmall, isLarge, columnCount]) => {
        this.demoRootCssClass = `cols-${columnCount}`;
        if (isSmall) {
          this.demoRootCssClass = `responsive cols-${columnCount}`;
        }
        if (isLarge) {
          this.demoRootCssClass = `responsive-large cols-${columnCount}`;
        }
      }),
      map(([isSmall]) => isSmall)
    );

    this.navOpened = combineLatest([
      this.isSmallOrSmaller,
      this.navToggled
    ]).pipe(
      map(([isSmallScreen, navToggled]) => (!isSmallScreen ? true : navToggled)),
      startWith(true)
    );

    this.sidenavMode = this.isSmallOrSmaller.pipe(
      map(isSmallOrSmaller => (isSmallOrSmaller ? 'push' : 'side'))
    );
  }

  onNavToggle() {
    this.navToggled.next(!this.navToggled.value);
  }

  onBackdropClick() {
    this.navToggled.next(false);
  }
}
