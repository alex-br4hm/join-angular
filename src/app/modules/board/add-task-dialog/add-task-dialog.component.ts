import {Component, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AddTaskComponent} from '../../tasks/add-task/add-task.component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-add-task-dialog',
  imports: [
    AddTaskComponent,
    MatIcon
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {

// data is state (todo etc)
  constructor(public dialogRef: MatDialogRef<AddTaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
