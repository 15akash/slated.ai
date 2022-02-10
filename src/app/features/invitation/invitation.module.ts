import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvitationRoutingModule } from './invitation-routing.module';
import { InvitationComponent } from './invitation.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
	declarations: [
		InvitationComponent
	],
	imports: [
		CommonModule,
		InvitationRoutingModule,
		SharedModule
	]
})
export class InvitationModule { }
