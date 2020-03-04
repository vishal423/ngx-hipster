import { browser, logging } from 'protractor';

import { HeaderPage } from './header.po';
import { HomePage } from './home.po';
import { FooterPage } from './footer.po';

describe('workspace-project App', () => {
  let headerPage: HeaderPage;
  let homePage: HomePage;
  let footerPage: FooterPage;

  beforeEach(() => {
    headerPage = new HeaderPage();
    homePage = new HomePage();
    footerPage = new FooterPage();
  });

  it('should display ngx-hipster application landing page', async () => {
    await headerPage.navigateTo();
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
