import { Roles } from '../../auth/interfaces/login.interface';

export interface UsersInterface {
  id: string;
  identificationTypeId: number;
  roleId: number;
  identification: string;
  fullName: string;
  avatarUrl: string;
  username: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  identificationType: IdentificationType;
  role: Roles;
}

export interface IdentificationType {
  id: number;
  type?: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name?: string;
}
