import { by, element } from 'protractor';

export class LoginPage {
  private root = element(by.css('.body app-login'));

  username = this.root.element(by.css('input[formcontrolname="username"]'));
  password = this.root.element(by.css('input[formcontrolname="password"]'));

  loginBtn = this.root.element(by.css('mat-card-actions button'));

  getPageTitleText() {
    return this.root.element(by.css('mat-card-title')).getText() as Promise<
      string
    >;
  }

  getErrorMessage() {
    return this.root
      .element(by.css('.mat-card-title+.mat-error'))
      .getText() as Promise<string>;
  }

  async login(
    username: string = (process.env.E2E_USERNAME as string) || 'admin',
    password: string = (process.env.E2E_PASSWORD as string) || 'admin'
  ): Promise<void> {
    await this.username.sendKeys(username);
    await this.password.sendKeys(password);
    await this.loginBtn.click();
  }
}
