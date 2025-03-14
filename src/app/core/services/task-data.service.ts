import {inject, Injectable} from '@angular/core';
import {Database, push, ref, set} from '@angular/fire/database';
import {Task} from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  private db         = inject(Database);
  taskState: string             = 'todo';
  tasksRef   = ref(this.db, 'tasks');
  newTaskRef = push(this.tasksRef);


  constructor() { }

  addTask(task: Task) {
    console.log(task);
    task.state = this.taskState;
    task.due_date_unix = this.getUnixTimeStamp(task.due_date);

    if (this.newTaskRef.key != null) {
      task.id = this.newTaskRef.key;
    }

    set(this.newTaskRef, task)
      .then(() => {
        console.log('Task added successfully');
      })
      .catch((error) => {
        console.error('Error adding contact: ', error);
      });
  }

  getUnixTimeStamp(dateStr: string) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date               = new Date(year, month - 1, day);
    return Math.floor(date.getTime() / 1000);
  }
}
