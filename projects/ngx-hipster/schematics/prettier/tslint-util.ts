import { Tree } from '@angular-devkit/schematics';
import { getJson, updateJsonInTree } from '../utils/utils';

export function updateTsLintConfigurations(
  tree: Tree,
  options: { path: string }
) {
  const json = getJson(tree, { ...options, filename: 'tslint.json' });
  if (!json.hasOwnProperty('extends')) {
    json.extends = [];
  }
  if (Array.isArray(json.extends)) {
    json.extends = json.extends.filter(
      (type: string) => type !== 'tslint-config-prettier'
    );
  } else {
    json.extends = [json.extends];
  }

  json.extends = [...json.extends, 'tslint-config-prettier'];

  if (!json.rules) {
    json.rules = {};
  }

  if (json.rules['max-line-length']) {
    delete json.rules['max-line-length'];
  }

  if (json.rules.quotemark) {
    delete json.rules.quotemark;
  }

  if (json.rules['object-literal-key-quotes']) {
    delete json.rules['object-literal-key-quotes'];
  }

  return updateJsonInTree(tree, 'tslint.json', json, options);
}
