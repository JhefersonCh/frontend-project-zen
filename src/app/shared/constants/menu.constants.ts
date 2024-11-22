import { MenuInterface } from '../interfaces/menu.interface';

export const MENU_CONST: MenuInterface[] = [
  {
    module: 'General',
    icon: 'settings',
    order: 1,
    items: [
      {
        name: 'Mis Proyectos',
        route: '/general/projects',
        icon: 'folder',
        order: 1
      },
      {
        name: 'Mis Tareas',
        route: '/general/tasks',
        icon: 'pending_actions',
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
        name: 'Proyectos',
        route: '/organizational/projects',
        icon: 'summarize',
        order: 2
      },
      {
        name: 'Tareas',
        route: '/organizational/tasks',
        icon: 'playlist_add_check',
        order: 3
      },
      {
        name: 'Panel de Admin',
        route: '/organizational/panel',
        icon: 'security',
        order: 4
      }
    ]
  }
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: ['profile', 'Mis Proyectos', 'Mis Tareas']
};

export const ROUTE_MAP: Record<string, string> = {
  'Mis Proyectos': '/general/projects',
  'Mis Tareas': '/general/tasks',
  profile: '/profile'
};
