import { User } from "./user";

export class UserTask {
    UserTaskId: number;
    Name: string;
    Deadline: Date;
    User: User;
    Status: string;
}
