import { SchematicsException, Tree } from '@angular-devkit/schematics';
import {
  getBasePath,
  sortObjectByKeys,
  updateJsonInTree
} from '../utils/utils';

const specFileName = 'tsconfig.spec.json';

export function updateTsConfigToSupportJest(
  tree: Tree,
  options: { path: string }
): Tree {
  const json = getTsConfigJson(tree, specFileName, { path: options.path });

  if (!json.compilerOptions) {
    json.compilerOptions = {};
  }

  json.compilerOptions.emitDecoratorMetadata = true;
  json.compilerOptions.module = 'commonjs';

  if (json.compilerOptions.types) {
    json.compilerOptions.types = json.compilerOptions.types
      .filter((type: string) => type !== 'jasmine' && type !== 'jest')
      .concat(['jest'])
      .sort();
  } else {
    json.compilerOptions.types = ['jest', 'node'];
  }

  json.compilerOptions = sortObjectByKeys(json.compilerOptions);

  return updateJsonInTree(tree, specFileName, json, { path: options.path });
}

function getTsConfigJson(
  tree: Tree,
  filename: string,
  options: { path: string }
) {
  const filePath = `${getBasePath(options)}${filename}`;
  const tsConfigJson = tree.read(filePath);

  if (!tsConfigJson) {
    throw new SchematicsException(`Could not find ${filePath}`);
  }

  return JSON.parse(tsConfigJson.toString('utf-8'));
}
