import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupPage } from './pages/signup/signup.page';
import { LoginPage } from './pages/login/login.page';
import { FeedPage } from './pages/feed/feed.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage},
  { path: 'signup', component: SignupPage },
  { path: 'feed', component: FeedPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
