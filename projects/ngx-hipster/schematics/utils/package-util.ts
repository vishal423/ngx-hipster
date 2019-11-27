import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { getBasePath, sortObjectByKeys, updateJsonInTree } from './utils';

const jsonFileName = 'package.json';

export function addDevDependency(
  tree: Tree,
  packageName: string,
  version: string,
  options: { path: string }
): Tree {
  return addPackageDependency(
    tree,
    packageName,
    version,
    'devDependencies',
    options
  );
}

export function addDependency(
  tree: Tree,
  packageName: string,
  version: string,
  options: { path: string }
): Tree {
  return addPackageDependency(
    tree,
    packageName,
    version,
    'dependencies',
    options
  );
}

function addPackageDependency(
  tree: Tree,
  packageName: string,
  version: string,
  collection: string,
  options: { path: string }
): Tree {
  const json = getPackageJson(tree, options);

  if (!json[collection]) {
    json[collection] = {};
  }

  if (!json[collection][packageName]) {
    json[collection][packageName] = version;
    json[collection] = sortObjectByKeys(json[collection]);
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
