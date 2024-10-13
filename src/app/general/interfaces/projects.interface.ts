import { UserInterface } from '../../shared/interfaces/user.interface';

export interface ProjectCategory {
  id: number;
  projectId: number;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  category: ProjectInterface;
}

export interface ProjectInterface {
  id?: number;
  title: string;
  description: string;
  createdAt?: Date;
  finishDate?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  projectCategories?: ProjectCategory[];
  members?: Members[];
}

export interface ProjectRelatedData {
  categories: ProjectInterface[];
  roles: ProjectRoles[];
}

export interface ProjectRoles {
  id: number;
  roleName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateProjectInterface {
  title: string;
  description: string;
  finishDate?: Date;
  categoryIds: number[];
}

export interface Members {
  id: number;
  userId: string;
  projectId: number;
  projectRoleId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  user: UserInterface;
  projectRole: ProjectRoles;
}
