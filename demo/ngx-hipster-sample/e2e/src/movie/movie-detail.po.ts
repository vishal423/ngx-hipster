import { by, element, ElementFinder } from 'protractor';
import { OverlayPage } from '../overlay.po';

export class MovieDetailPage {
  private root: ElementFinder = element(by.css('.body app-movie-detail'));
  private actions: ElementFinder = this.root.element(
    by.css('mat-card-actions')
  );
  private overlayPage = new OverlayPage();
  overlay = this.overlayPage.overlay;

  pageTitle = this.root.element(by.css('.mat-card-title'));
  pageSubTitle = this.root.element(by.css('.mat-card-subtitle'));
  cancelBtn = this.actions.element(by.css('button:first-child'));
  saveBtn = this.actions.element(by.css('button:last-child'));

  title = this.root.element(by.css('input[formcontrolname="title"]'));
  titleLabel = this.root.element(
    by.css('input[formcontrolname="title"]+span mat-label')
  );

  plot = this.root.element(by.css('textarea[formcontrolname="plot"]'));
  plotLabel = this.root.element(
    by.css('textarea[formcontrolname="plot"]+span mat-label')
  );

  rated = this.root
    .element(by.css('mat-radio-group[formcontrolname="rated"]'))
    .all(by.css('mat-radio-button'));

  genres = this.root.element(by.css('mat-select[formcontrolname="genres"]'));
  genresLabel = this.root.element(
    by.css('mat-select[formcontrolname="genres"]+span mat-label')
  );

  genresOptions = this.overlayPage.checkboxOptions;

  director = this.root.element(
    by.css('mat-select[formcontrolname="director"]')
  );
  directorLabel = this.root.element(
    by.css('mat-select[formcontrolname="director"]+span mat-label')
  );

  directorOptions = this.overlayPage.options;

  writer = this.root.element(by.css('input[formcontrolname="writer"]'));
  writerAutocomplete = this.overlayPage.options;
  writerLabel = this.root.element(
    by.css('input[formcontrolname="writer"]+mat-autocomplete+span mat-label')
  );

  releaseDate = this.root.element(
    by.css('input[formcontrolname="releaseDate"]')
  );
  releaseDatePicker = this.root.element(by.css('mat-datepicker-toggle button'));
  releaseDateLabel = this.root.element(
    by.css('input[formcontrolname="releaseDate"]+mat-datepicker+span mat-label')
  );
}
