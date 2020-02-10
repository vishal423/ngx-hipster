import { browser, logging } from 'protractor';

import { HeaderPage } from './po/header.po';
import { HomePage } from './po/home.po';
import { FooterPage } from './po/footer.po';
import { LoginPage } from './po/login.po';

describe('workspace-project App', () => {
  let headerPage: HeaderPage;
  let homePage: HomePage;
  let footerPage: FooterPage;
  let loginPage: LoginPage;

  beforeEach(() => {
    headerPage = new HeaderPage();
    homePage = new HomePage();
    footerPage = new FooterPage();
    loginPage = new LoginPage();
  });

  it('should display ngx-hipster application landing page', async () => {
    headerPage.navigateTo();
    expect(await headerPage.getTitleText()).toEqual('Angular Hipster');
    expect(await headerPage.loginMenu.isDisplayed()).toBeTruthy();
    expect(await homePage.getWelcomeText()).toEqual('home works!');
    expect(await footerPage.getFooterText()).toEqual(
      'Powered by ngx-hipster © 2019-2020'
    );

    expect(await headerPage.appMenu.isPresent()).toBeFalsy();
    expect(await headerPage.logoutMenu.isPresent()).toBeFalsy();
    expect(await headerPage.accountMenu.isPresent()).toBeFalsy();
  });

  describe('login-logout tests', () => {
    it('should not allow login with invalid credentials', async () => {
      headerPage.navigateTo();
      expect(await headerPage.loginMenu.isDisplayed()).toBeTruthy();

      await headerPage.loginMenu.click();

      expect(await loginPage.getPageTitleText()).toEqual('Sign In');
      expect(await loginPage.loginBtn.isEnabled()).toBeFalsy();

      await loginPage.username.sendKeys('admin');
      await loginPage.password.sendKeys('invalid');

      expect(await loginPage.loginBtn.isEnabled()).toBeTruthy();

      await loginPage.loginBtn.click();

      expect(await headerPage.loginMenu.isPresent()).toBeTruthy();
      expect(await loginPage.getErrorMessage()).toEqual(
        'Invalid username or password.'
      );
    });

    it('should allow login with valid credentials', async () => {
      headerPage.navigateTo();
      expect(await headerPage.loginMenu.isDisplayed()).toBeTruthy();

      await headerPage.loginMenu.click();

      expect(await loginPage.getPageTitleText()).toEqual('Sign In');
      expect(await loginPage.loginBtn.isEnabled()).toBeFalsy();

      await loginPage.username.sendKeys('admin');
      await loginPage.password.sendKeys('admin');

      expect(await loginPage.loginBtn.isEnabled()).toBeTruthy();

      await loginPage.loginBtn.click();

      expect(await headerPage.loginMenu.isPresent()).toBeFalsy();
      expect(await headerPage.appMenu.isDisplayed()).toBeTruthy();
      expect(await headerPage.accountMenu.isDisplayed()).toBeTruthy();
    });

    it('should logout the logged in user', async () => {
      expect(await headerPage.accountMenu.isDisplayed()).toBeTruthy();

      await headerPage.accountMenu.click();
      await headerPage.logoutMenu.click();

      expect(await headerPage.loginMenu.isDisplayed()).toBeTruthy();
      expect(await headerPage.appMenu.isPresent()).toBeFalsy();
      expect(await headerPage.accountMenu.isPresent()).toBeFalsy();
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE
      } as logging.Entry)
    );
  });
});
