import { by, element } from 'protractor';

export class HomePage {
  private root = element(by.css('.body app-home'));

  getWelcomeText() {
    return this.root.element(by.css('div')).getText() as Promise<string>;
  }
}
