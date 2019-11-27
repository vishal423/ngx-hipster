import { chain, Rule, schematic, Tree } from '@angular-devkit/schematics';
import { Schema } from './schema';

export function proxy(options: Schema): Rule {
  return (tree: Tree) => {
    if (options.configureProxy) {
      return chain([schematic('proxy', { project: options.project })]);
    }
    return tree;
  };
}
