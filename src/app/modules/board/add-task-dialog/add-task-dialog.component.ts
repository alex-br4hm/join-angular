import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TaskFormComponent} from '../../task-form/task-form.component';
import {MatIcon} from '@angular/material/icon';
import {AddTaskStatePipe} from '../../../shared/utils/add-task-state.pipe';

@Component({
  selector: 'app-add-task-dialog',
  imports: [
    TaskFormComponent,
    MatIcon,
    AddTaskStatePipe
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
