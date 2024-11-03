import { IdentificationType } from '../users/interfaces/users.interface';

export interface AdminPanelElementInterface {
  identificationTypes: IdentificationType[];
  categories: Element[];
  tags: Element[];
  projectRoles: Element[];
  stauses: Element[];
}

export interface Element {
  id: number;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  roleName?: string;
}
