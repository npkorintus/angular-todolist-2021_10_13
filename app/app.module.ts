import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatListModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatToolbarModule,
  MatIconModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatDialogModule,
  MatSelectModule,
} from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AppComponent } from './app.component';
import { TodoComponent, TodoModal, PrioritySelect } from './todo.component';
// import { SelectComponent } from './select/select.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyCysz8O0EuHgF8VNQMaC3aXRWb7uGAwHVI',
      authDomain: 'todolistapp-stackblitz.firebaseapp.com',
      databaseURL: 'https://todolistapp-stackblitz.firebaseio.com',
      projectId: 'todolistapp-stackblitz',
      storageBucket: 'todolistapp-stackblitz.appspot.com',
      messagingSenderId: '907624983083',
    }),
  ],
  declarations: [AppComponent, TodoComponent, TodoModal, PrioritySelect],
  bootstrap: [AppComponent],
  entryComponents: [TodoComponent, TodoModal, PrioritySelect],
})
export class AppModule {}
