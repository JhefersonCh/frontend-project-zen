export interface MenuInterface {
  module: string;
  icon: string;
  order: number;
  items: ItemInterface[];
}

export interface ItemInterface {
  name: string;
  route: string;
  icon: string;
  order: number;
  subItems?: SubItemInterface[];
}

export interface SubItemInterface {
  name: string;
  route: string;
}

export interface MenuItemSelectedInterface {
  moduleName: string;
  itemRoute: string;
}
