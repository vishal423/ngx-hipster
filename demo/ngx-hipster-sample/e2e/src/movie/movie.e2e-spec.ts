import { browser, logging } from 'protractor';

import { HeaderPage } from '../header.po';
import { LoginPage } from '../login/login.po';
import { MovieListPage } from './movie-list.po';
import { SidenavPage } from '../sidenav.po';
import { MovieDetailPage } from './movie-detail.po';

describe('Movie tests', () => {
  let headerPage: HeaderPage;
  let loginPage: LoginPage;
  let sidenavPage: SidenavPage;
  let listPage: MovieListPage;
  let detailPage: MovieDetailPage;
  let initialCount: number;

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
    detailPage = new MovieDetailPage();
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
    initialCount = 0;
  });

  it('should create a new movie', async () => {
    await listPage.createBtn.click();

    expect(await detailPage.pageTitle.getText()).toEqual('Movie');
    expect(await detailPage.pageSubTitle.getText()).toEqual(
      'Creates a new movie.'
    );
    expect(await detailPage.cancelBtn.isEnabled()).toBeTruthy();
    expect(await detailPage.saveBtn.isEnabled()).toBeFalsy();

    expect(await detailPage.titleLabel.getText()).toEqual('Title');
    await detailPage.title.sendKeys('Lorem Ipsum');

    expect(await detailPage.plotLabel.getText()).toEqual('Plot');
    await detailPage.plot.sendKeys(
      'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    );

    await detailPage.rated.first().click();

    expect(await detailPage.genresLabel.getText()).toEqual('Genres');
    await detailPage.genres.click();

    await detailPage.genresOptions.first().click();
    await detailPage.overlay.click();

    expect(await detailPage.directorLabel.getText()).toEqual('Director');
    await detailPage.director.click();

    await detailPage.directorOptions.last().click();

    expect(await detailPage.writerLabel.getText()).toEqual('Writer');
    await detailPage.writer.sendKeys('ge');
    await detailPage.writerAutocomplete.first().click();

    expect(await detailPage.releaseDateLabel.getText()).toEqual('Release Date');
    await detailPage.releaseDate.sendKeys('3/12/1965');
    await detailPage.releaseDatePicker.click();
    await detailPage.overlay.click();

    expect(await detailPage.saveBtn.isEnabled()).toBeTruthy();
    await detailPage.saveBtn.click();

    expect(await listPage.table.columns.count()).toEqual(4);
    expect(await listPage.table.getColumnHeadersText()).toEqual([
      'title',
      'director',
      'releaseDate',
      ''
    ]);

    const actualRecordsCount = await listPage.table.records.count();
    expect(actualRecordsCount).toEqual(initialCount + 1);

    const actionsMenu = listPage.table.getActionsBtn(actualRecordsCount - 1);

    await actionsMenu.click();
    expect(await listPage.editBtn.isEnabled()).toBeTruthy();
    expect(await listPage.deleteBtn.isEnabled()).toBeTruthy();
    await listPage.overlay.click();
  });
});
