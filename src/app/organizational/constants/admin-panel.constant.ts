export const elements: Record<string, string> = {
  priorities: 'priority',
  identificationTypes: 'identificationType',
  categories: 'category',
  tags: 'tag',
  stauses: 'status',
  projectRoles: 'projectRole'
};

export interface AllowedElements {
  element:
    | 'priority'
    | 'status'
    | 'tag'
    | 'projectRole'
    | 'category'
    | 'identificationType';
}
