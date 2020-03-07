import { by, element } from 'protractor';

export class OverlayPage {
  overlay = element(by.css('.cdk-overlay-container'));
  overlayContainer = this.overlay.element(by.css('.cdk-overlay-pane'));

  options = this.overlayContainer.all(by.css('mat-option'));
  checkboxOptions = this.overlayContainer.all(
    by.css('mat-option mat-pseudo-checkbox')
  );

  editBtn = this.overlayContainer.element(by.css('button:first-child'));
  deleteBtn = this.overlayContainer.element(by.css('button:last-child'));
}
