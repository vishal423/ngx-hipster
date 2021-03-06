import { browser, by, element } from 'protractor';

export class HeaderPage {
  private root = element(by.css('app-header'));
  appMenu = this.root.element(by.css('.app-menu'));
  loginMenu = this.root.element(by.css('.app-login'));

  accountMenu = this.root.element(by.css('.app-account'));
  logoutMenu = element(by.css('.mat-menu-panel .app-logout'));

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return this.root.element(by.css('.logo + span')).getText() as Promise<
      string
    >;
  }
}
