import {
  chain,
  Rule,
  schematic,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getProject } from '../utils/utils';
import { normalize } from 'path';
import { applyPrettier } from '../utils/prettier-util';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    const project = getProject(tree, options);
    let sourcePath = `${project.sourceRoot}`;

    if (project.projectType === 'application') {
      sourcePath = normalize(`${sourcePath}/app`);
    } else {
      sourcePath = normalize(`${sourcePath}/lib`);
    }

    if (options.configureNgx) {
      return chain([
        schematic('jest', {
          project: options.project,
          configureJest: options.configureJest
        }),
        schematic('prettier', { project: options.project }),
        schematic('proxy-confirm', {
          project: options.project,
          configureProxy: options.configureProxy
        }),
        schematic('app-shell', { project: options.project }),
        schematic('material-layout', { project: options.project }),
        applyPrettier({ path: sourcePath })
      ]);
    }
    return tree;
  };
}
