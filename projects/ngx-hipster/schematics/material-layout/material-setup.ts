import {
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { experimental } from '@angular-devkit/core';

import { getProject, readFile } from '../utils/utils';
import { addRootModuleImport } from '../utils/module-util';
import { Schema } from './schema';

export function addAnimationsModuleImport(options: Schema) {
  return (tree: Tree) => {
    addRootModuleImport(
      tree,
      'BrowserAnimationsModule',
      '@angular/platform-browser/animations',
      options
    );
  };
}

export function addMaterialAppStyles(options: Schema) {
  return (tree: Tree, context: SchematicContext) => {
    const styleFilePath = getProjectStyleFile(tree, options);
    const stylesContent = readFile(tree, styleFilePath).toString();

    if (stylesContent.includes('@angular/material/theming')) {
      context.logger.info('Skip update of global styles');
      return;
    }

    const styles = '\n' + getCustomStyle();

    const recorder = tree.beginUpdate(styleFilePath);
    recorder.insertLeft(stylesContent.length, styles);
    tree.commitUpdate(recorder);
  };
}

function getCustomStyle() {
  return `@import '~@angular/material/theming';
@import './scss/variables';

html,
body {
	height: 100%;
}
body {
	margin: 0;
	font-family: Roboto, 'Helvetica Neue', sans-serif;
}

mat-icon.mat-icon + span {
	padding-left: 0.35rem;
}

@include mat-core();
$theme: mat-light-theme($primary-palette, $accent-palette, $warn-palette);
@include angular-material-theme($theme);`;
}

function getProjectStyleFile(tree: Tree, options: Schema): string {
  const project: experimental.workspace.WorkspaceProject = getProject(
    tree,
    options
  );

  if (
    !project.architect ||
    !project.architect.build ||
    !project.architect.build.options
  ) {
    throw new SchematicsException(
      `Could not find the project build options file`
    );
  }

  const buildOptions = project.architect.build.options;

  if (!buildOptions.styles && !buildOptions.styles.length) {
    throw new SchematicsException(`Could not find the project styles file`);
  }

  const scssStyles = buildOptions.styles.filter((style: string) =>
    style.endsWith('.scss')
  );
  if (!scssStyles.length) {
    throw new SchematicsException(`Could not find scss styles file`);
  }

  return scssStyles[0];
}
