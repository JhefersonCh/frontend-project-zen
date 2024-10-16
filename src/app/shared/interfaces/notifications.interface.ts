export interface NotificationInterface {
  title?: string;
  information: string;
  type: NotificationsTypes;
  enableHtml?: boolean;
}

export type NotificationsTypes = 'success' | 'error';
