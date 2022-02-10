import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferencesRoutingModule } from './preferences-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Preference1Component } from './pages/preference1/preference1.component';
import { Preference2Component } from './pages/preference2/preference2.component';
import { Preference3Component } from './pages/preference3/preference3.component';
import { Preference4Component } from './pages/preference4/preference4.component';
import { Preference5Component } from './pages/preference5/preference5.component';
import { InlineDropdownComponent } from './components/inline-dropdown/inline-dropdown.component';
import { PreferenceService } from './services/preference.service';


@NgModule({
	declarations: [
		Preference1Component,
		Preference2Component,
		Preference3Component,
		Preference4Component,
		Preference5Component,
		InlineDropdownComponent
	],
	imports: [
		CommonModule,
		PreferencesRoutingModule,
		SharedModule
	],
	providers: [
		PreferenceService
	]

})
export class PreferencesModule { }
