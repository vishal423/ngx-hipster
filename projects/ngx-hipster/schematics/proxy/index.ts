import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';
import { experimental, normalize } from '@angular-devkit/core';
import { Schema } from './schema';
import { getJson } from '../utils/utils';
import { applyPrettierOnFile } from '../utils/prettier-util';

export function proxy(options: Schema): Rule {
  return (tree: Tree) => {
    const workspace = getJson(tree, {
      filename: 'angular.json',
      path: ''
    }) as experimental.workspace.WorkspaceSchema;

    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    const projectName = options.project as string;
    const project: experimental.workspace.WorkspaceProject =
      workspace.projects[projectName];

    if (
      !project.architect ||
      !project.architect.serve ||
      !project.architect.serve.options
    ) {
      throw new SchematicsException(
        `Could not find project development server configurations`
      );
    }

    project.architect.serve.options.proxyConfig = 'proxy.conf.js';

    const path = `${project.root}`;

    tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));

    const proxyPaths: string[] = options.proxyPath.split(',');

    const templateSource = apply(url('./files'), [
      applyTemplates({ ...options, proxyPaths }),
      move(normalize(path))
    ]);

    return chain([
      mergeWith(templateSource),
      applyPrettierOnFile({
        path: normalize(`angular.json`)
      }),
      applyPrettierOnFile({
        path: normalize(`proxy.conf.js`)
      })
    ]);
  };
}
