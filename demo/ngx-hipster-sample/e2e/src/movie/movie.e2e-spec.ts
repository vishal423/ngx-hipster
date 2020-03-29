import { browser, logging } from 'protractor';

import { HeaderPage } from '../header.po';
import { LoginPage } from '../login/login.po';
import { MovieListPage } from './movie-list.po';
import { SidenavPage } from '../sidenav.po';
import { MovieDetailPage } from './movie-detail.po';
import { MovieDeletePage } from './movie-delete.po';

describe('Movie tests', () => {
  let headerPage: HeaderPage;
  let loginPage: LoginPage;
  let sidenavPage: SidenavPage;
  let listPage: MovieListPage;
  let detailPage: MovieDetailPage;
  let deletePage: MovieDeletePage;
  let initialCount: number;

  beforeAll(async () => {
    headerPage = new HeaderPage();
    loginPage = new LoginPage();
    sidenavPage = new SidenavPage();

    await headerPage.navigateTo();
    expect(await headerPage.loginMenu.isDisplayed()).toBeTruthy();

    await headerPage.loginMenu.click();
    await loginPage.login();

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
    deletePage = new MovieDeletePage();
  });

  beforeEach(async () => {
    await headerPage.appMenu.click();
    await sidenavPage.movieMenu.click();
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });

  it('should display the movies list page', async () => {
    expect(await listPage.getPageTitleText()).toEqual('Movies');

    expect(await listPage.createBtn.isEnabled()).toBeTruthy();

    if (await listPage.table.noRecords.isPresent()) {
      expect(await listPage.table.noRecords.isDisplayed()).toBeTruthy();
      expect(await listPage.table.noRecords.getText()).toEqual(
        'No records found'
      );
      initialCount = 0;
    } else {
      initialCount = await listPage.table.records.count();
      expect(await listPage.table.columns.count()).toEqual(4);

      const actionsMenu = listPage.table.getActionsBtn(initialCount - 1);
      await actionsMenu.click();
      expect(await listPage.editBtn.isEnabled()).toBeTruthy();
      expect(await listPage.deleteBtn.isEnabled()).toBeTruthy();
      await listPage.overlay.click();
    }
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
      'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
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
    await detailPage.writer.sendKeys('');
    await detailPage.writerAutocomplete.first().click();

    expect(await detailPage.releaseDateLabel.getText()).toEqual('Release Date');
    await detailPage.releaseDate.sendKeys('3/12/1965');

    expect(await detailPage.saveBtn.isEnabled()).toBeTruthy();
    await detailPage.saveBtn.click();

    const actualRecordsCount = await listPage.table.records.count();
    expect(await listPage.table.columns.count()).toEqual(4);
    expect(actualRecordsCount).toEqual(initialCount + 1);
  });

  it('should update movie', async () => {
    const lastRecordIndex = (await listPage.table.records.count()) - 1;
    const actionsMenu = listPage.table.getActionsBtn(lastRecordIndex);

    await actionsMenu.click();
    expect(await listPage.editBtn.isEnabled()).toBeTruthy();
    await listPage.editBtn.click();

    expect(await detailPage.pageTitle.getText()).toEqual('Movie');
    expect(await detailPage.pageSubTitle.getText()).toEqual(
      'Update an existing movie.'
    );
    expect(await detailPage.cancelBtn.isEnabled()).toBeTruthy();
    expect(await detailPage.saveBtn.isEnabled()).toBeTruthy();

    expect(await detailPage.titleLabel.getText()).toEqual('Title');
    expect(await detailPage.title.getAttribute('value')).toEqual('Lorem Ipsum');
    await detailPage.title.clear();
    await detailPage.title.sendKeys('Ipsum Lorem');

    expect(await detailPage.plotLabel.getText()).toEqual('Plot');
    expect(await detailPage.plot.getAttribute('value')).toEqual(
      'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
    );
    await detailPage.plot.clear();
    await detailPage.plot.sendKeys(
      'Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem'
    );

    await detailPage.rated.last().click();

    expect(await detailPage.genresLabel.getText()).toEqual('Genres');
    await detailPage.genres.click();

    await detailPage.genresOptions.last().click();
    await detailPage.overlay.click();

    expect(await detailPage.directorLabel.getText()).toEqual('Director');
    await detailPage.director.click();

    await detailPage.directorOptions.last().click();

    expect(await detailPage.writerLabel.getText()).toEqual('Writer');
    await detailPage.writer.sendKeys('');
    await detailPage.writerAutocomplete.last().click();

    expect(await detailPage.releaseDateLabel.getText()).toEqual('Release Date');
    expect(await detailPage.releaseDate.getAttribute('value')).toEqual(
      '3/12/1965'
    );

    expect(await detailPage.saveBtn.isEnabled()).toBeTruthy();
    await detailPage.saveBtn.click();

    const actualRecordsCount = await listPage.table.records.count();
    expect(await listPage.table.columns.count()).toEqual(4);
    expect(actualRecordsCount).toEqual(initialCount + 1);
  });

  it('should delete a movie', async () => {
    const lastRecordIndex = (await listPage.table.records.count()) - 1;
    const actionsMenu = listPage.table.getActionsBtn(lastRecordIndex);

    await actionsMenu.click();
    expect(await listPage.deleteBtn.isEnabled()).toBeTruthy();
    await listPage.deleteBtn.click();

    expect(await deletePage.title.getText()).toEqual('Delete movie');

    expect(await deletePage.noBtn.isEnabled()).toBeTruthy();
    expect(await deletePage.yesBtn.isEnabled()).toBeTruthy();
    await deletePage.yesBtn.click();

    if (initialCount === 0) {
      expect(await listPage.table.noRecords.isDisplayed()).toBeTruthy();
      expect(await listPage.table.noRecords.getText()).toEqual(
        'No records found'
      );
    } else {
      const afterPageRecords = await listPage.table.records.count();
      expect(afterPageRecords).toEqual(initialCount);
    }
  });
});
