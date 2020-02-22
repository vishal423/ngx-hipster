import { by, element } from 'protractor';

export class NotificationPage {
  notifications = element.all(by.css('snack-bar-container simple-snack-bar'));
}
