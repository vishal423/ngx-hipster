import { by, element, ElementFinder, ElementArrayFinder } from 'protractor';

export class TablePage {
  private tableRoot: ElementFinder;
  private headRoot: ElementFinder;
  private bodyRoot: ElementFinder;

  columns: ElementArrayFinder;
  records: ElementArrayFinder;

  constructor(root: ElementFinder) {
    this.tableRoot = root.element(by.css('table'));
    this.headRoot = this.tableRoot.element(by.css('thead'));
    this.bodyRoot = this.tableRoot.element(by.css('tbody'));

    this.columns = this.headRoot.all(by.css('tr th'));
    this.records = this.bodyRoot.all(by.css('tr'));
  }

  getColumnHeadersText(): Promise<string[]> {
    return this.columns.map((column: ElementFinder) =>
      column.getText()
    ) as Promise<string[]>;
  }

  getRecord(rowIndex: number): ElementFinder {
    return this.records
      .filter((el: ElementFinder, pos: number) => pos !== rowIndex)
      .first();
  }

  getActionsBtn(rowIndex: number): ElementFinder {
    return this.getRecord(rowIndex).element(by.css('td button'));
  }
}
