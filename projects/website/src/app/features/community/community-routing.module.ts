import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityComponent } from './community/community.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'angular-zurich',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CommunityComponent,
    children: [
      {
        path: 'angular-zurich',
        loadChildren: () =>
          import('./angular-zurich/angular-zurich.module').then(
            (m) => m.AngularZurichModule
          ),
      },
      {
        path: 'release-butler',
        loadChildren: () =>
          import('./release-butler/release-butler.module').then(
            (m) => m.ReleaseButlerModule
          ),
      },
      {
        path: 'medium-enhanced-stats',
        loadChildren: () =>
          import('./medium-enhanced-stats/medium-enhanced-stats.module').then(
            (m) => m.MediumEnhancedStatsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
