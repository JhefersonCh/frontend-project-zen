export interface PermissionInterface {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  order: number;
}

export interface PermissionWithInterface extends PermissionInterface {
  authorized: boolean;
}
