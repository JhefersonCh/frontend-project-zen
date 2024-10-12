export interface ProjectCategory {
  id: number;
  projectId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  category: ProjectInterface;
}

export interface ProjectInterface {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  finishDate?: Date;
  updatedAt: Date;
  deletedAt: null;
  projectCategories?: ProjectCategory[];
}
