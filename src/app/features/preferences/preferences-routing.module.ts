import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Preference1Component } from './pages/preference1/preference1.component';
import { Preference2Component } from './pages/preference2/preference2.component';
import { Preference3Component } from './pages/preference3/preference3.component';
import { Preference4Component } from './pages/preference4/preference4.component';
import { Preference5Component } from './pages/preference5/preference5.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: '1', pathMatch: 'full' },
			{ path: '1', component: Preference1Component, data: { animation: 'preference1' } },
			{ path: '2', component: Preference2Component, data: { animation: 'preference2' } },
			{ path: '3', component: Preference3Component, data: { animation: 'preference3' } },
			{ path: '4', component: Preference4Component, data: { animation: 'preference4' } },
			{ path: '5', component: Preference5Component, data: { animation: 'preference5' } },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PreferencesRoutingModule { }
