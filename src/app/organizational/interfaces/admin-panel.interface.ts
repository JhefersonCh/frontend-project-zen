import { IdentificationType } from '../users/interfaces/users.interface';

export interface AdminPanelElementInterface {
  identificationTypes: IdentificationType[];
  categories: ElementType[];
  tags: ElementType[];
  projectRoles: ElementType[];
  stauses: ElementType[];
}

export interface ElementType {
  id: number;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  roleName?: string;
}
