import { by, element } from 'protractor';

export class SidenavPage {
  private root = element(by.css('app-sidenav mat-nav-list'));
  movieMenu = this.root.element(by.css('a[routerLink="/movies"]'));
}
