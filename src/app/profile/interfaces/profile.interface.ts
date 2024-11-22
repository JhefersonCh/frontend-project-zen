export interface StatisticsInterface {
  tasks: Tasks;
  projects: Projects;
}

export interface Projects {
  total: number;
  leader: number;
}

export interface Tasks {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}
