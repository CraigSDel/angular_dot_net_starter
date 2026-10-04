import { User } from "./user";

export class UserTask {
    userTaskId?: number;
    name = '';
    deadline?: Date | string;
    user?: User;
    userId?: number;
    taskGroupId?: number;
    status = '';
}
