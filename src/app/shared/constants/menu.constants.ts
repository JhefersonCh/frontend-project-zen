import { MenuInterface } from '../interfaces/menu.interface';

export const MENU_CONST: MenuInterface[] = [
  {
    module: 'General',
    icon: 'settings',
    order: 1,
    items: [
      {
        name: 'Proyectos',
        route: '/general/projects',
        icon: 'assignment',
        order: 1
      },
      {
        name: 'Tareas',
        route: '/general/tasks',
        icon: 'checklist',
        order: 2
      }
    ]
  },
  {
    module: 'Organizacional',
    icon: 'work',
    order: 2,
    items: [
      {
        name: 'Usuarios',
        route: '/organizational/users/list',
        icon: 'person',
        order: 1
      },
      {
        name: 'Panel de Admin',
        route: '/organizational/panel',
        icon: 'security',
        order: 2
      },
      {
        name: 'Lista de Tareas',
        route: '/organizational/tasks',
        icon: 'list',
        order: 3
      }
    ]
  }
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: ['profile', 'Proyectos', 'Tareas']
};

export const ROUTE_MAP: Record<string, string> = {
  Proyectos: '/general/projects',
  Tareas: '/general/tasks',
  profile: '/profile'
};
