import { Members, ProjectInterface } from './projects.interface';

export interface TasksRelatedData {
  priorities: Priority[];
  statuses: Priority[];
  tags: Priority[];
}

export interface Priority {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface BaseTaskInterface {
  title: string;
  description: string;
  projectId: number;
  priorityId: number;
  statusId: number;
  memberId: number;
  deadline: Date;
}

export interface TasksInterface extends BaseTaskInterface {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  project: ProjectInterface;
  priority: Priority;
  status: Priority;
  member: Members;
  taskTags?: TaskTags[];
  projectid?: number;
}

export interface TaskTags {
  id: number;
  taskId: number;
  tagId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  tag: Tag;
}

export interface Tag {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface CreateTaskInterface extends BaseTaskInterface {
  tagIds: number[];
}
