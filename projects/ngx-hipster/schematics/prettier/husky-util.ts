import { Tree } from '@angular-devkit/schematics';
import { updateJsonInTree } from '../utils/utils';
import { getPackageJson } from '../utils/package-util';

export function addHuskyPreCommitHook(tree: Tree, options: { path: string }) {
  const json = getPackageJson(tree, options);
  if (!json.husky) {
    json.husky = {};
  }

  if (!json.husky.hooks) {
    json.husky.hooks = {};
  }

  if (!json.husky.hooks['pre-commit']) {
    json.husky.hooks['pre-commit'] = 'pretty-quick --staged';
  }

  return updateJsonInTree(tree, 'package.json', json, options);
}
