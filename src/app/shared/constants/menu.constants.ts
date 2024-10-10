import { MenuInterface } from '../interfaces/menu.interface';

export const MENU_CONST: MenuInterface[] = [
  {
    module: 'General',
    icon: 'settings',
    order: 1,
    items: [
      {
        name: 'Proyectos',
        route: '/projects',
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
  }
];

export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export type RolesType = 'Admin' | 'User';

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['Proyectos', 'Test'],
  user: ['Test']
};
