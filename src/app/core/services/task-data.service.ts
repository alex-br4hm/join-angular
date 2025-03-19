import {inject, Injectable} from '@angular/core';
import {Database, push, ref, remove, set, update} from '@angular/fire/database';
import {Task} from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  private db         = inject(Database);
  taskState: string             = 'todo';



  constructor() { }

  addTask(task: Task) {
    const tasksRef   = ref(this.db, 'tasks');
    const newTaskRef = push(tasksRef);
    console.log(task);
    task.state = this.taskState;
    task.due_date_unix = this.getUnixTimeStamp(task.due_date);

    if (newTaskRef.key != null) {
      task.id = newTaskRef.key;
    }

    set(newTaskRef, task)
      .then(() => {
        console.log('Task added successfully');
      })
      .catch((error) => {
        console.error('Error adding contact: ', error);
      });
  }

  deleteTask(taskID: string) {
    const taskRef = ref(this.db, `tasks/${taskID}`);
    console.log(taskID);

    remove(taskRef)
      .then(() => {
        console.log('Task deleted', taskRef);
      })
      .catch((error) => {
        console.error('Error deleting contact: ', error);
      });
  }

  patchTask(task: Task) {
    const taskRef = ref(this.db, `tasks/${task.id}`);

    update(taskRef, task)
      .then(() => {
        console.log('Task successfully updated', task);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  }

  getUnixTimeStamp(dateStr: string) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date               = new Date(year, month - 1, day);
    return Math.floor(date.getTime() / 1000);
  }
}
