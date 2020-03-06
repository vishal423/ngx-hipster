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

import { getPackageManager, getProject } from '../utils/utils';
import { addDevDependency, addScript } from '../utils/package-util';
import { updateTsConfigToSupportJest } from './tsconfig-util';
import { Schema } from './schema';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { normalize } from '@angular-devkit/core';
import { applyPrettierOnFile } from '../utils/prettier-util';

export function jest(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.configureJest) {
      const project = getProject(tree, options);

      const path = `${project.root}`;

      const pkgOptions = { ...options, path };
      const packageManager = getPackageManager(tree, pkgOptions);

      const scriptCmd =
        packageManager !== 'yarn' ? `${packageManager} run ` : packageManager;
      const scriptParamPrefix = packageManager !== 'yarn' ? `--` : '';

      addDevDependency(tree, 'jest', '25.1.0', pkgOptions);
      addDevDependency(tree, '@types/jest', '25.1.2', pkgOptions);
      addDevDependency(tree, 'jest-preset-angular', '8.0.0', pkgOptions);

      addScript(tree, 'test', 'jest --config src/jest.conf.js', pkgOptions);
      addScript(
        tree,
        'test:watch',
        `${scriptCmd} test ${scriptParamPrefix} --watch`,
        pkgOptions
      );
      addScript(
        tree,
        'test:ci',
        `${scriptCmd} test ${scriptParamPrefix} --runInBand`,
        pkgOptions
      );
      addScript(
        tree,
        'test:coverage',
        `${scriptCmd} test ${scriptParamPrefix} --coverage`,
        pkgOptions
      );

      updateTsConfigToSupportJest(tree, { path });

      context.addTask(new NodePackageInstallTask());

      const templatePath = path + '/src';

      const templateSource = apply(url('./files'), [
        applyTemplates({ dot: '.' }),
        move(normalize(templatePath))
      ]);

      context.addTask(new NodePackageInstallTask());

      return chain([
        mergeWith(templateSource),
        applyPrettierOnFile({
          path: normalize(`tsconfig.spec.json`)
        })
      ]);
    }

    return tree;
  };
}
