import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleSelectionComponent } from './components/people-selection/people-selection.component';
import { AccountComponent } from './pages/account/account.component';
import { HomeComponent } from './pages/home/home.component';
import { PeopleComponent } from './pages/people/people.component';
import { PreviewComponent } from './pages/preview/preview.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'preview', component: PreviewComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'account', component: AccountComponent },
  //{ path: 'location', loadChildren: () => import('../location/location.module').then(m => m.LocationModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
