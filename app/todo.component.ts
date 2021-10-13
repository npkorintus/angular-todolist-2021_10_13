import { Component, OnInit, Inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { Priority } from './select/select.component';

export interface Todo {
  content: string;
  id?: string;
  datemodified?: Date;
  isDone?: boolean;
  // selectedPriority: string;
}
@Component({
  selector: 'todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  todoCollection: AngularFirestoreCollection<Todo>;
  todoList: Observable<Todo[]>;
  todoDoc: AngularFirestoreDocument<Todo>;
  inputId: string;
  inputValue: Todo = {
    content: '',
    // selectedPriority: '',
    // priority: {
    //   value: '',
    //   viewValue: '',
    // },
  };

  editValue: boolean = false;
  constructor(
    public afs: AngularFirestore,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.todoCollection = this.afs.collection('Todolist');
    this.todoList = this.afs
      .collection('Todolist', (ref) => ref.orderBy('datemodified'))
      .snapshotChanges()
      .map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Todo;
          data.id = a.payload.doc.id;
          return data;
        });
      });
  }

  addNewItem() {
    if (this.inputValue.content != '') {
      this.inputValue.datemodified = new Date();
      this.inputValue.isDone = false;
      this.todoCollection.add(this.inputValue);
      this.inputValue.content = '';
      this.openSnackBar('Added Successfuly!', 'Dismiss');
    }
  }

  deleteItem(i) {
    this.todoDoc = this.afs.doc(`Todolist/${i}`);
    this.todoDoc.delete();
    this.openSnackBar('Item Deleted!', 'Dismiss');
  }
  editItem(i) {
    this.openDialog();
    this.inputValue.content = i.content;
    this.editValue = true;
    this.inputId = i.id;
  }
  markItemAsDone(item) {
    // this.inputValue.content = item.content;
    // this.inputValue.isDone = true;
    // this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    // this.todoDoc.update(this.inputValue);
    // this.inputValue.content = '';
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.delete();
    this.openSnackBar('Item Done!', 'Dismiss');
  }
  markItemAsNotDone(item) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = false;
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = '';
    this.openSnackBar('Item Not Done!', 'Dismiss');
  }
  saveNewItem() {
    if (this.inputValue.content != '') {
      this.inputValue.isDone = false;
      this.inputValue.datemodified = new Date();
      this.todoDoc = this.afs.doc(`Todolist/${this.inputId}`);
      this.todoDoc.update(this.inputValue);
      this.editValue = false;
      this.inputValue.content = '';
      this.openSnackBar('Updated Successfuly!', 'Dismiss');
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
  toggleCheck(i) {}
  openDialog(): void {
    const dialogRef = this.dialog.open(TodoModal, {
      width: '250px',
      data: {
        inputValue: this.inputValue,
        // content: this.inputValue.content,
        // priority: this.inputValue.priority,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.inputValue.content = result;
      if (this.editValue) {
        console.log('inputValue: ', result);
        this.saveNewItem();
      } else {
        console.log('inputValue: ', result);
        this.addNewItem();
      }
    });
  }
}

@Component({
  selector: 'todo-modal',
  templateUrl: './todo-modal.component.html',
})
export class TodoModal {
  // todoCollection: AngularFirestoreCollection<Todo>;
  constructor(
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TodoModal>,
    @Inject(MAT_DIALOG_DATA) public data: Todo
  ) {
    console.log('data: ', data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
