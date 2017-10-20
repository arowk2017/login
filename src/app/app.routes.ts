import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  
  { path: '**',    redirectTo: '' },
  
];

export const ROUTES = RouterModule.forRoot(appRoutes);