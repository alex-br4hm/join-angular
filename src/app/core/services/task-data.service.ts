import {inject, Injectable} from '@angular/core';
import {Database, push, ref, set} from '@angular/fire/database';
import {Task} from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  private db = inject(Database);

  constructor() { }

  addTask(task: Task, state: string) {
    console.log(task);
    const tasksRef    = ref(this.db, 'tasks');
    const newTaskRef  = push(tasksRef);

    if (newTaskRef.key != null) {
      task.id = newTaskRef.key;
    }

    task.state = state;

    set(newTaskRef, task)
      .then(() => {
        console.log('Task added successfully');
      })
      .catch((error) => {
        console.error('Error adding contact: ', error);
      });
  }
}
