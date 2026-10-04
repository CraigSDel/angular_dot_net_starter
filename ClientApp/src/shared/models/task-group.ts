import { UserTask } from "./user-task";

export class  TaskGroup {
    taskGroupId?: number;
    name = '';
    userTasks: UserTask[] = [];
}
