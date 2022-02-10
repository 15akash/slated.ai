import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantRoutingModule } from './assistant-routing.module';
import { AssistantComponent } from './components/assistant/assistant.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpeechBubbleComponent } from './components/speech-bubble/speech-bubble.component';
import { IntroComponent } from './views/intro/intro.component';
import { MeetingComponent } from './views/meeting/meeting.component';
import { PersonComponent } from './views/person/person.component';
import { SuggestionComponent } from './components/suggestion/suggestion.component';
import { PreviousMeetingComponent } from './components/previous-meeting/previous-meeting.component';
import { MeetingDetailComponent } from './components/meeting-detail/meeting-detail.component';
import { PeopleListItemComponent } from './components/people-list-item/people-list-item.component';

@NgModule({
  declarations: [
    AssistantComponent,
    SpeechBubbleComponent,
    IntroComponent,
    MeetingComponent,
    PersonComponent,
    SuggestionComponent,
    PreviousMeetingComponent,
    MeetingDetailComponent,
    PeopleListItemComponent
  ],
  imports: [
    CommonModule,
    AssistantRoutingModule,
    SharedModule,
  ],
  exports: [
    AssistantComponent
  ]
})
export class AssistantModule { }
