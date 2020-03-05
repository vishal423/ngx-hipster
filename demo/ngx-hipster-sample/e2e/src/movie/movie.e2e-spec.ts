import { browser, logging } from 'protractor';

import { HeaderPage } from '../header.po';
import { LoginPage } from '../login/login.po';
import { MovieListPage } from './movie-list.po';
import { SidenavPage } from '../sidenav.po';

describe('Movie tests', () => {
  let headerPage: HeaderPage;
  let loginPage: LoginPage;
  let sidenavPage: SidenavPage;
  let listPage: MovieListPage;

  beforeAll(async () => {
    headerPage = new HeaderPage();
    loginPage = new LoginPage();
    sidenavPage = new SidenavPage();

    await headerPage.navigateTo();
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

  afterAll(async () => {
    expect(await headerPage.accountMenu.isDisplayed()).toBeTruthy();

    await headerPage.accountMenu.click();
    await headerPage.logoutMenu.click();

    expect(await headerPage.loginMenu.isDisplayed()).toBeTruthy();
    expect(await headerPage.appMenu.isPresent()).toBeFalsy();
    expect(await headerPage.accountMenu.isPresent()).toBeFalsy();
  });

  beforeEach(() => {
    headerPage = new HeaderPage();
    sidenavPage = new SidenavPage();
    listPage = new MovieListPage();
  });

  beforeEach(async () => {
    await headerPage.appMenu.click();
    await sidenavPage.movieMenu.click();
  });

  afterEach(async () => {
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

  it('should display the movies list page', async () => {
    expect(await listPage.getPageTitleText()).toEqual('Movies');

    expect(await listPage.createBtn.isEnabled()).toBeTruthy();

    expect(await listPage.table.noRecords.isDisplayed()).toBeTruthy();
    expect(await listPage.table.noRecords.getText()).toEqual(
      'No records found'
    );
  });
});
