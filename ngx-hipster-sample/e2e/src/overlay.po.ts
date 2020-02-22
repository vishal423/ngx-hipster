import { by, element } from 'protractor';

export class OverlayPage {
  overlay = element(by.css('.cdk-overlay-container'));
  overlayContainer = this.overlay.element(by.css('.cdk-overlay-pane'));
  editBtn = this.overlayContainer.element(by.css('button:first-child'));
  deleteBtn = this.overlayContainer.element(by.css('button:last-child'));
}
