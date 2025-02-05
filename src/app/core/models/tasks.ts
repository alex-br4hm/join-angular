export interface Task {
  assigned_user: AssignedUser[];
  category: string;
  description: string;
  due_date: string;
  due_date_unix: number;
  id: number;
  name: string;
  priority: string;
  state: string;
  subtasks: Subtask[];
}

export interface Subtask {
  isDone: boolean;
  name: string;
}

export interface AssignedUser {
  name: string;
  first_two_letters: string;
}
