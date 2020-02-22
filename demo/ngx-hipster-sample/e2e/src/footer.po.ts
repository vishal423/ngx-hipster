import { by, element } from 'protractor';

export class FooterPage {
  private root = element(by.css('app-root .footer'));

  getFooterText() {
    return this.root.element(by.css('span')).getText() as Promise<string>;
  }
}
