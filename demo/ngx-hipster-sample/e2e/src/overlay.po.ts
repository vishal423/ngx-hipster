import { by, element, ElementFinder, protractor } from 'protractor';
import { waitAndClick, waitUntilHidden } from './util';

export class OverlayPage {
  overlay = element(by.css('.cdk-overlay-container'));
  overlayContainer = this.overlay.element(by.css('.cdk-overlay-pane'));

  options = this.overlayContainer.all(by.css('mat-option'));
  textOptions = this.overlayContainer.all(by.css('.mat-option-text'));
  checkboxOptions = this.overlayContainer.all(
    by.css('mat-option mat-pseudo-checkbox')
  );

  editBtn = this.overlayContainer.element(by.css('button:first-child'));
  deleteBtn = this.overlayContainer.element(by.css('button:last-child'));

  async selectAnOption(selector: ElementFinder) {
    await waitAndClick(selector);
    await this.hideOptionsOverlay();
  }

  async hideOptionsOverlay() {
    await element(by.css('body')).sendKeys(protractor.Key.ESCAPE);
    await waitUntilHidden(this.overlayContainer);
  }

  async hideOverlay() {
    await this.overlay.click();
    await waitUntilHidden(this.overlayContainer);
  }
}
