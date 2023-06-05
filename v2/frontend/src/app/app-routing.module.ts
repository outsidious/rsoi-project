import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsPageComponent } from './pages/hotels-page/hotels-page.component';
import { MePageComponent } from './pages/me-page/me-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';

const routes: Routes = [
  {
    path: 'hotels',
    component: HotelsPageComponent,
  },
  {
    path: 'me',
    component: MePageComponent,
  },
  {
    path: 'auth',
    component: AuthPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'hotels',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
