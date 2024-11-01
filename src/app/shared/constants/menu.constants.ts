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
        name: 'Test',
        route: '/test',
        icon: 'grid_view',
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
        // subItems: [
        //   {
        //     name: 'Crear usuario',
        //     route: '/organizational/users/create'
        //   },
        //   {
        //     name: 'Ver usuarios',
        //     route: '/organizational/users/list'
        //   }
        // ]
      },
      {
        name: 'Roles',
        route: '/organizacional/roles',
        icon: 'security',
        order: 2
      }
    ]
  }
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: ['profile', 'Proyectos']
};

export const ROUTE_MAP: Record<string, string> = {
  Proyectos: '/general/projects',
  profile: '/profile'
};
