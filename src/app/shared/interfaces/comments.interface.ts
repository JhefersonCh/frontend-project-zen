import { UsersInterface } from '../../organizational/users/interfaces/users.interface';

export interface CommentsInterface {
  id: number;
  content: string;
  rowTable: string;
  rowId: string;
  createdAt: Date;
  user: UsersInterface;
}

// export interface User {
//     id:       string;
//     fullName: string;
// }
