import { by, element, browser, ExpectedConditions } from 'protractor';

export class LoginPage {
  private root = element(by.css('.body app-login'));

  username = this.root.element(by.css('input[formcontrolname="username"]'));
  password = this.root.element(by.css('input[formcontrolname="password"]'));

  loginBtn = this.root.element(by.css('mat-card-actions button'));

  async getPageTitleText() {
    const title = this.root.element(by.css('mat-card-title'));
    await browser.wait(ExpectedConditions.visibilityOf(title), 2000);
    return title.getText() as Promise<string>;
  }

  getErrorMessage() {
    return this.root
      .element(by.css('.mat-card-title+.mat-error'))
      .getText() as Promise<string>;
  }
}
