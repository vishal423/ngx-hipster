import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { normalize } from '@angular-devkit/core';

import { Schema } from './schema';
import { getProject } from '../utils/utils';
import { addDependency } from '../utils/package-util';
import {
  addAnimationsModuleImport,
  addMaterialAppStyles
} from './material-setup';
import { addMaterialIconsAndFonts } from './index-html';

export function materialLayout(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getProject(tree, options);
    const pkgOptions = { ...options, path: `${project.root}` };

    // add  dependencies
    addDependency(tree, '@angular/cdk', '9.1.3', pkgOptions);
    addDependency(tree, '@angular/material', '9.1.3', pkgOptions);
    addDependency(tree, '@angular/animations', '9.0.7', pkgOptions);

    context.addTask(new NodePackageInstallTask());

    const srcPath = `${project.root}/${project.sourceRoot}`;

    const templateSource = apply(url('./files'), [
      applyTemplates({}),
      move(normalize(srcPath))
    ]);

    return chain([
      addAnimationsModuleImport(options),
      addMaterialIconsAndFonts(options),
      addMaterialAppStyles(options),
      mergeWith(templateSource)
    ]);
  };
}
