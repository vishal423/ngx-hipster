import {
  chain,
  Rule,
  schematic,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    if (options.configureNgx) {
      return chain([
        schematic('jest', { project: options.project }),
        schematic('prettier', { project: options.project }),
        schematic('proxy-confirm', { project: options.project }),
        schematic('app-shell', { project: options.project }),
        schematic('material-layout', { project: options.project })
      ]);
    }
    return tree;
  };
}
