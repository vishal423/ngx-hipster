import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { OverlayPage } from '../overlay.po';
import { TablePage } from '../table.po';

export class MovieListPage {
  private root: ElementFinder = element(by.css('.body app-movie-list'));
  private overlayPage = new OverlayPage();

  overlay = this.overlayPage.overlay;
  table: TablePage = new TablePage(this.root);
  createBtn = this.root.element(
    by.css('.mat-card-title+div button.mat-raised-button')
  );
  editBtn = this.overlayPage.editBtn;
  deleteBtn = this.overlayPage.deleteBtn;

  getPageTitleText() {
    return this.root.element(by.css('.mat-card-title')).getText() as Promise<
      string
    >;
  }
}
