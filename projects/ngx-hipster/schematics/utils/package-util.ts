import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { getBasePath, sortObjectByKeys, updateJsonInTree } from './utils';

const jsonFileName = 'package.json';

export function addDevDependency(
  tree: Tree,
  packageName: string,
  version: string,
  options: { path: string }
): Tree {
  const json = getPackageJson(tree, options);

  if (!json.devDependencies) {
    json.devDependencies = {};
  }

  if (!json.devDependencies[packageName]) {
    json.devDependencies[packageName] = version;
    json.devDependencies = sortObjectByKeys(json.devDependencies);
  }

  return updateJsonInTree(tree, jsonFileName, json, options);
}

export function addScript(
  tree: Tree,
  key: string,
  value: string,
  options: { path: string }
): Tree {
  const json = getPackageJson(tree, options);
  if (!json.scripts) {
    json.scripts = {};
  }

  json.scripts[key] = value;
  json.scripts = sortObjectByKeys(json.scripts);
  return updateJsonInTree(tree, jsonFileName, json, options);
}

export function getPackageJson(tree: Tree, options: { path: string }) {
  const packageJson = tree.read(`${getBasePath(options)}package.json`);

  if (!packageJson) {
    throw new SchematicsException('Could not find package.json');
  }

  return JSON.parse(packageJson.toString('utf-8'));
}
