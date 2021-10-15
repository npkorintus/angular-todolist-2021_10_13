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

export interface Priority {
  value: string;
  viewValue: string;
}

export interface Todo {
  content: string;
  id?: string;
  datemodified?: Date;
  isDone?: boolean;
  priority: Priority;
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
    priority: {
      value: '',
      viewValue: '',
    },
  };

  selected: string = 'content';
  editValue: boolean = false;

  constructor(
    public afs: AngularFirestore,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.todoCollection = this.afs.collection('Todolist');
    this.todoList = this.afs
      .collection('Todolist', (ref) => ref.orderBy(this.selected))
      .snapshotChanges()
      .map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Todo;
          data.id = a.payload.doc.id;
          return data;
        });
      });
  }

  sort() {
    this.todoList = this.afs
      .collection('Todolist', (ref) => ref.orderBy(this.selected))
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
      this.inputValue.priority.value = '';
      this.inputValue.priority.viewValue = '';
      this.openSnackBar('Added Successfuly!', 'Dismiss');
    }
  }

  deleteItem(i) {
    this.todoDoc = this.afs.doc(`Todolist/${i}`);
    this.todoDoc.delete();
    this.openSnackBar('Item Deleted!', 'Dismiss');
  }
  editItem(i) {
    this.editValue = true;
    this.openDialog();
    this.inputValue.content = i.content;
    this.inputValue.priority = i.priority;
    this.inputId = i.id;
  }
  markItemAsDone(item) {
    this.inputValue.isDone = true;
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.delete();
    this.openSnackBar('Item Done!', 'Dismiss');
  }
  saveNewItem() {
    if (this.inputValue.content != '') {
      this.inputValue.isDone = false;
      this.inputValue.datemodified = new Date();
      this.todoDoc = this.afs.doc(`Todolist/${this.inputId}`);
      this.todoDoc.update(this.inputValue);
      this.editValue = false;
      this.inputValue.content = '';
      this.inputValue.priority.value = '';
      this.inputValue.priority.viewValue = '';
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
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inputValue.content = result[0];
        this.inputValue.priority.value = result[1];
        this.inputValue.priority.viewValue = result[2];
        if (this.editValue) {
          this.saveNewItem();
        } else {
          this.addNewItem();
        }
      } else {
        this.inputValue.content = '';
        this.inputValue.priority = { value: '', viewValue: '' };
      }
    });
  }
}

@Component({
  selector: 'todo-modal',
  templateUrl: './todo-modal.component.html',
})
export class TodoModal {
  priorities: Priority[] = [
    { value: '0', viewValue: 'High' },
    { value: '1', viewValue: 'Medium' },
    { value: '2', viewValue: 'Low' },
  ];
  constructor(
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TodoModal>,
    @Inject(MAT_DIALOG_DATA) public data: Todo
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
