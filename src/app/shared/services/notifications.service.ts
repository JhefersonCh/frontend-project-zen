import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  NotificationInterface,
  NotificationsTypes
} from '../interfaces/notifications.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _toastrService: ToastrService = inject(ToastrService);

  showNotification(
    type: NotificationsTypes,
    information: string,
    title?: string,
    enableHtml?: boolean
  ): void {
    const notification: NotificationInterface = {
      title,
      type,
      information,
      enableHtml
    };
    this._showToast(notification);
  }

  private _showToast(notification: NotificationInterface): void {
    const iconMap = {
      success: '<i class="fas fa-check-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      info: '<i class="fas fa-info-circle"></i>'
    };

    const template = `
      <div class='d-flex align-items-center'>
      <div class="toast-icon">${iconMap[notification.type]}</div>
      <div class="toast-body">
        <div class="toast-title">${notification.title || ''}</div>
        <div class="toast-message">${notification.information}</div>
      </div></div>
    `;

    this._toastrService.show(template, '', {
      timeOut: 3000,
      tapToDismiss: true,
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
      toastClass: `toast-container ngx-toastr brand-toast-${notification.type}`,
      positionClass: 'toast-top-right',
      extendedTimeOut: 3000
    });
  }
}
