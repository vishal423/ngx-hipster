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

  if (json.rules.semicolon) {
    delete json.rules.semicolon;
  }

  return updateJsonInTree(tree, 'tslint.json', json, options);
}

export function addTslintRuleConfig(
  tree: Tree,
  key: string,
  value: string | boolean,
  options: { path: string }
) {
  const json = getJson(tree, { ...options, filename: 'tslint.json' });
  json.rules[key] = value;
  return updateJsonInTree(tree, 'tslint.json', json, options);
}
