export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ApiTask {
  id: number;
  name: string;
  deadline: string;
  status: string;
  userId: number;
  taskGroupId?: number;
}

export interface ApiTaskGroup {
  id: number;
  name: string;
  tasks: ApiTask[];
}
