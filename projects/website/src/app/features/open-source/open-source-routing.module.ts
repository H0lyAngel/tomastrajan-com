import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenSourceComponent } from './open-source.component';

const routes: Routes = [
  {
    path: '',
    component: OpenSourceComponent,
    data: {
      title: 'Open source projects'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenSourceRoutingModule {}
