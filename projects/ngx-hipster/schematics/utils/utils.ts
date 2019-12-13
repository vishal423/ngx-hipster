import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { experimental } from '@angular-devkit/core';

export function updateJsonInTree(
  tree: Tree,
  filename: string,
  json: any,
  options: { path: string }
): Tree {
  tree.overwrite(
    `${getBasePath({ path: options.path })}${filename}`,
    JSON.stringify(json, null, 2)
  );
  return tree;
}

export function getBasePath(options: { path: string }) {
  return options.path.trim() === '' ? '' : options.path + '/';
}

export function getProject(
  tree: Tree,
  options: { project?: string }
): experimental.workspace.WorkspaceProject {
  const workspace = getWorkspace(tree);

  if (!options.project) {
    options.project = workspace.defaultProject;
  }

  const projectName = options.project as string;
  const project: experimental.workspace.WorkspaceProject =
    workspace.projects[projectName];

  if (!project) {
    throw new SchematicsException(
      `Could not find project in workspace: ${projectName}`
    );
  }
  return project;
}

export function sortObjectByKeys(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as any);
}

export function getPackageManager(tree: Tree, options: { path: string }) {
  const cliConfig = getWorkspace(tree).cli;
  if (cliConfig && cliConfig.packageManager) {
    return cliConfig.packageManager;
  }

  const yarnLock = tree.read(`${getBasePath(options)}yarn.lock`);

  return yarnLock ? 'yarn' : 'npm';
}

export function getJson(
  tree: Tree,
  options: { filename: string; path: string }
) {
  const json = readFile(
    tree,
    `${getBasePath({ path: options.path })}${options.filename}`
  );
  return JSON.parse(json.toString('utf-8'));
}

export function readFile(tree: Tree, filePath: string) {
  const file = tree.read(filePath);

  if (!file) {
    throw new SchematicsException(`Could not find file ${filePath}`);
  }
  return file;
}

export function pluralize(name: string) {
  if (name.length > 1) {
    const tempStr = name.substring(name.length - 2).toLowerCase();
    if (['ch', 'sh'].findIndex((val: string) => val === tempStr) !== -1) {
      return name + 'es';
    } else {
      if (
        ['s', 'z', 'x'].findIndex(
          (val: string) => val === tempStr.charAt(tempStr.length - 1)
        ) !== -1
      ) {
        return name + 'es';
      }
      return name + 's';
    }
  } else if (name.length == 1) {
    const tempStr = name.substring(name.length - 1).toLowerCase();
    if (
      ['s', 'z', 'x'].findIndex(
        (val: string) => val === tempStr.charAt(tempStr.length - 1)
      ) !== -1
    ) {
      return name + 'es';
    }
    return name + 's';
  }

  return 's';
}
