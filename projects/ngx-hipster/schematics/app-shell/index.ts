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
import { normalize, strings } from '@angular-devkit/core';

import { getBasePath, getProject } from '../utils/utils';
import { Schema } from './schema';

export function appShell(options: Schema): Rule {
  return (tree: Tree) => {
    const project = getProject(tree, options);

    let sourcePath = `${project.sourceRoot}`;
    const prefix = `${project.prefix}`;

    if (project.projectType === 'application') {
      sourcePath = normalize(`${sourcePath}/app`);
    } else {
      throw new SchematicsException(
        `Project type : ${project.projectType} is not supported by this schematic`
      );
    }

    deleteGeneratedApplicationFiles(tree, { path: sourcePath });

    const templateSource = apply(url('./files'), [
      applyTemplates({ dot: '.', prefix, ...strings }),
      move(sourcePath)
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

function deleteGeneratedApplicationFiles(
  tree: Tree,
  options: { path: string }
) {
  const files = [
    'app.component.html',
    'app.component.scss',
    'app.component.spec.ts',
    'app.component.ts',
    'app.module.ts',
    'app-routing.module.ts'
  ];

  files.forEach(file => {
    if (tree.exists(getAbsolutePath(options, file))) {
      tree.delete(getAbsolutePath(options, file));
    }
  });
}

function getAbsolutePath(options: { path: string }, filename: string) {
  return getBasePath({ path: options.path }) + filename;
}
