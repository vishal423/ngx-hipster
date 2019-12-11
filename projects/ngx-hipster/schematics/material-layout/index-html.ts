import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { getProject } from '../utils/utils';
import { getHtmlChildElementByTagName } from '../utils/html-util';

export function addMaterialIconsAndFonts(options: { project?: string }) {
  return (tree: Tree) => {
    const project = getProject(tree, options);
    const projectIndexFiles = getIndexFilePath(project);

    const stylesheetPaths = [
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
      'https://fonts.googleapis.com/icon?family=Material+Icons'
    ];

    stylesheetPaths.forEach(stylesheetPath => {
      addStylesheet(tree, projectIndexFiles, stylesheetPath);
    });

    return tree;
  };
}

function getIndexFilePath(project: any): string {
  if (
    !project.architect ||
    !project.architect.build ||
    !project.architect.build.options
  ) {
    throw new SchematicsException(`Could not find the project build options`);
  }

  const buildOptions = project.architect.build.options;

  if (!buildOptions.index) {
    throw new SchematicsException(`Could not find the project index file`);
  }

  return buildOptions.index;
}

function addStylesheet(
  tree: Tree,
  htmlFilePath: string,
  stylesheetPath: string
) {
  const buffer = tree.read(htmlFilePath);

  if (!buffer) {
    throw new SchematicsException(`Could not read file ${htmlFilePath}`);
  }

  const content = buffer.toString();

  if (content.includes(stylesheetPath)) {
    return;
  }

  const linkTag = `<link href="${stylesheetPath}" rel="stylesheet">`;

  const headTag = getHtmlChildElementByTagName('head', content);

  if (!headTag) {
    throw new SchematicsException(
      `Could not find '<head>' element in HTML file: ${buffer}`
    );
  }

  if (!headTag.sourceCodeLocation) {
    throw new SchematicsException(
      `Could not get source code location in the AST tree`
    );
  }

  const endTagOffset = headTag.sourceCodeLocation.endTag.startOffset;

  const recordedChange = tree
    .beginUpdate(htmlFilePath)
    .insertRight(endTagOffset, `${linkTag}\n`);

  tree.commitUpdate(recordedChange);
}
