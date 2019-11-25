import { User } from "./user";

export class UserTask {
    id: number;
    name: string;
    deadline: Date;
    user: User;
    status: string;
}
