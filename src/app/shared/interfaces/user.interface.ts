import { Roles } from '../../auth/interfaces/login.interface';

export interface UserInterface {
  fullName: string;
  identification: string;
  username: string;
  email: string;
  createdAt: Date;
  phone: string;
  avatarUrl: string;
  role?: Roles;
  identificationTypeId: number;
}
