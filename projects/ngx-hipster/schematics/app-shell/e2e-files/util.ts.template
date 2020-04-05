import { ElementFinder, browser, ExpectedConditions as EC } from 'protractor';

const timeout = browser.params.waitTimeoutInMillis || 5000;

export async function waitUntilClickable(selector: ElementFinder) {
  await browser.wait(
    EC.elementToBeClickable(selector),
    timeout,
    `The '${selector.locator()}' is not clickable after a wait of ${timeout}ms.`
  );
}

export async function waitUntilHidden(selector: ElementFinder) {
  await browser.wait(
    EC.invisibilityOf(selector),
    timeout,
    `The '${selector.locator()}' is not hidden after a wait of ${timeout}ms.`
  );
}

export async function waitAndClick(selector: ElementFinder) {
  await waitUntilClickable(selector);
  await selector.click();
}
