export interface Task {
  assigned_user: AssignedUser[];
  category:      string;
  description:   string;
  due_date:      string;
  due_date_unix: number;
  id:            string;
  title:         string;
  priority:      string;
  state:         string;
  subtasks?:     Subtask[];
}

export interface TaskCategories {
  name: string;
  state: string;
  list: Task[];
}

export interface Subtask {
  isDone: boolean;
  title:  string;
}

export interface AssignedUser {
  id:        string;
  firstname: string;
  lastname:  string;
  email:     string;
  color:     string;
  phone:     string;
}
