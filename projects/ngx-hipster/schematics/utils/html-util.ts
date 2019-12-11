import { DefaultTreeDocument, DefaultTreeElement, parse } from 'parse5';

export function getHtmlChildElementByTagName(
  tagName: string,
  htmlContent: string
): DefaultTreeElement | null {
  const document = parse(htmlContent, {
    sourceCodeLocationInfo: true
  }) as DefaultTreeDocument;

  const childNodes = [...document.childNodes];

  while (childNodes.length) {
    const node = childNodes.shift() as DefaultTreeElement;
    if (node.nodeName.toLowerCase() === tagName) {
      return node;
    } else if (node.childNodes) {
      childNodes.push(...node.childNodes);
    }
  }

  return null;
}
