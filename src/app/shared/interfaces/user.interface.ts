import { Roles } from '../../auth/interfaces/login.interface';

export interface UserInterface {
  id?: string;
  fullName: string;
  identification: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role?: Roles;
  roleId?: number;
  identificationTypeId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  password?: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
