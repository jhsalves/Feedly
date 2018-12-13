import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CommentPage } from './comment.page';
import { TimeAgoModule } from 'src/app/modules/time-ago.module';

const routes: Routes = [
  {
    path: ':id',
    component: CommentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TimeAgoModule
  ],
  declarations: [CommentPage]
})
export class CommentPageModule {}
