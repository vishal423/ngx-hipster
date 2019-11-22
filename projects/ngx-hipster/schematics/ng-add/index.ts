import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  schematic,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { Schema } from './schema';
import { getProject } from '../utils/utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    if (options.configureNgx) {
      const project = getProject(tree, options);

      const path = `${project.root}`;

      const templateSource = apply(url('./files'), [
        applyTemplates({}),
        move(normalize(path))
      ]);

      return chain([
        schematic('jest', { project: options.project }),
        schematic('prettier', { project: options.project }),
        mergeWith(templateSource)
      ]);
    } else {
      return tree;
    }
  };
}
