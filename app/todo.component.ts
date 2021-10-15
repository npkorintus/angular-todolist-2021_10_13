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
  priority: Priority;
  // priority: number;
  // priorityLabel: string;
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
    // priority: undefined,
    // priorityLabel: '',
  };

  priorities: Priority[] = [
    { value: '0', viewValue: 'High' },
    { value: '1', viewValue: 'Medium' },
    { value: '2', viewValue: 'Low' },
  ];

  editValue: boolean = false;
  constructor(
    public afs: AngularFirestore,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this.todoCollection = this.afs.collection('Todolist');
    this.todoList = this.afs
      .collection('Todolist', (ref) => ref.orderBy('priority.value'))
      .snapshotChanges()
      .map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Todo;
          data.id = a.payload.doc.id;
          console.log('data: ', data);
          return data;
        });
      });
  }

  addNewItem() {
    if (this.inputValue.content != '') {
      console.log('added inputValue: ', this.inputValue);
      this.inputValue.datemodified = new Date();
      this.inputValue.isDone = false;
      this.todoCollection.add(this.inputValue);
      this.inputValue.content = '';
      this.inputValue.priority.value = '';
      this.inputValue.priority.viewValue = '';
      // this.inputValue.priority = undefined;
      // this.inputValue.priorityLabel = '';
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
    this.inputValue.priority = i.priority;
    this.editValue = true;
    this.inputId = i.id;
  }
  markItemAsDone(item) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = true;
    this.inputValue.priority.value = item.priority.value;
    this.inputValue.priority.value = 'done';
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = '';
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    // this.todoDoc.delete();
    this.openSnackBar('Item Done!', 'Dismiss');
  }
  markItemAsNotDone(item) {
    this.inputValue.content = item.content;
    this.inputValue.isDone = false;
    this.todoDoc = this.afs.doc(`Todolist/${item.id}`);
    this.todoDoc.update(this.inputValue);
    this.inputValue.content = '';
    this.inputValue.priority.value = '';
    this.inputValue.priority.viewValue = '';
    // this.inputValue.priority = undefined;
    // this.inputValue.priorityLabel = '';
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
      this.inputValue.priority.value = '';
      this.inputValue.priority.viewValue = '';
      // this.inputValue.priority = undefined;
      // this.inputValue.priorityLabel = '';
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
      if (result) {
        console.log('The dialog was closed');
        console.log('closed result: ', result);
        this.inputValue.content = result[0];
        this.inputValue.priority.value = result[1];
        this.inputValue.priority.viewValue = result[2];
        // this.inputValue.priority = result[1];
        // this.inputValue.priorityLabel = result[2];
        if (this.editValue) {
          console.log('inputValue: ', result);
          this.saveNewItem();
        } else {
          console.log('inputValue: ', result);
          this.addNewItem();
        }
      } else {
        this.inputValue.content = '';
        this.inputValue.priority.value = '';
      }
      // console.log('closed result: ', result);
      // console.log('The dialog was closed');
      // this.inputValue.content = result[0];
      // this.inputValue.priority.value = result[1];
      // this.inputValue.priority.viewValue = result[2];
      // if (this.editValue) {
      //   console.log('inputValue: ', result);
      //   this.saveNewItem();
      // } else {
      //   console.log('inputValue: ', result);
      //   this.addNewItem();
      // }
    });
  }
}

@Component({
  selector: 'todo-modal',
  templateUrl: './todo-modal.component.html',
})
export class TodoModal {
  // todoCollection: AngularFirestoreCollection<Todo>;
  priorities: Priority[] = [
    { value: '0', viewValue: 'High' },
    { value: '1', viewValue: 'Medium' },
    { value: '2', viewValue: 'Low' },
  ];
  editValue: boolean = false;
  constructor(
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TodoModal>,
    @Inject(MAT_DIALOG_DATA) public data: Todo
  ) {
    console.log('data: ', data);
  }

  onNoClick(): void {
    console.log('cancel clicked...');
    console.log('onClose data: ', this.data);
    this.data.content = '';
    this.dialogRef.close();
    // this.data.priority = undefined;
    // this.data.priorityLabel = '';
  }
}

// /** @title Select with 2-way value binding */
// @Component({
//   selector: 'priority-select',
//   templateUrl: 'priority-select.html',
//   // styleUrls: ['priority-select.css'],
// })
// export class PrioritySelect {
//   selectedPriority: {
//     value: string;
//     viewValue: string;
//   };
// }

export interface Priority {
  value: string;
  viewValue: string;
}

/**
 * @title Basic select
 */
@Component({
  selector: 'priority-select',
  templateUrl: 'priority-select.html',
  // styleUrls: ['select-overview-example.css'],
})
export class PrioritySelect {
  selectedPriority: string;

  priorities: Priority[] = [
    { value: '0', viewValue: 'High' },
    { value: '1', viewValue: 'Medium' },
    { value: '2', viewValue: 'Low' },
  ];
}

// @Component({
//   selector: 'priority-radio-group',
//   // templateUrl: 'priority-radio-group.html',
//   // styleUrls: ['priority-radio-group.css'],
// })
// export class PriorityRadioGroup {
//   selectedPriority: string;
//   priorities: string[] = ['High', 'Medium', 'Low'];
// }
