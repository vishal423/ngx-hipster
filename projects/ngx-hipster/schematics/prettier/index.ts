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
import { addDevDependency } from '../utils/package-util';
import { Schema } from './schema';
import { addHuskyPreCommitHook } from './husky-util';
import { normalize } from '@angular-devkit/core';
import { getProject } from '../utils/utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { updateTsLintConfigurations } from './tslint-util';

export function prettier(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getProject(tree, options);

    const path = `${project.root}`;

    const pkgOptions = { ...options, path };
    // add  dependencies
    addDevDependency(tree, 'husky', '4.2.1', pkgOptions);
    addDevDependency(tree, 'prettier', '1.19.1', pkgOptions);
    addDevDependency(tree, 'pretty-quick', '2.0.1', pkgOptions);
    addDevDependency(tree, 'tslint-config-prettier', '1.18.0', pkgOptions);

    // configure pre-commit hook
    addHuskyPreCommitHook(tree, { path });

    updateTsLintConfigurations(tree, { path });

    const templateSource = apply(url('./files'), [
      applyTemplates({ dot: '.' }),
      move(normalize(path))
    ]);

    context.addTask(new NodePackageInstallTask());

    return chain([mergeWith(templateSource)]);
  };
}
