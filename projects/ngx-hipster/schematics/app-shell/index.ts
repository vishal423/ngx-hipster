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
import { addTsConfigOption } from '../jest/tsconfig-util';
import { addTslintRuleConfig } from '../prettier/tslint-util';

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

    const e2eSourcePath = normalize(`${project.root}/e2e/src`);

    deleteGeneratedApplicationFiles(
      tree,
      [
        'app.component.html',
        'app.component.scss',
        'app.component.spec.ts',
        'app.component.ts',
        'app.module.ts',
        'app-routing.module.ts'
      ],
      { path: sourcePath }
    );

    deleteGeneratedApplicationFiles(tree, ['app.po.ts', 'app.e2e-spec.ts'], {
      path: e2eSourcePath
    });

    // enable strict typescript checks
    addTsConfigOption(tree, 'noImplicitAny', true, {
      path: project.root
    });
    addTsConfigOption(tree, 'noImplicitReturns', true, {
      path: project.root
    });
    addTsConfigOption(tree, 'noImplicitThis', true, {
      path: project.root
    });
    addTsConfigOption(tree, 'noFallthroughCasesInSwitch', true, {
      path: project.root
    });
    addTsConfigOption(tree, 'strictNullChecks', true, {
      path: project.root
    });

    addTslintRuleConfig(tree, 'no-non-null-assertion', false, {
      path: project.root
    });

    const templateSource = apply(url('./files'), [
      applyTemplates({
        dot: '.',
        prefix,
        ...strings,
        authenticationType: options.authenticationType
      }),
      move(sourcePath)
    ]);

    const e2eTemplateSource = apply(url('./e2e-files'), [
      applyTemplates({
        dot: '.',
        prefix,
        ...strings,
        authenticationType: options.authenticationType
      }),
      move(e2eSourcePath)
    ]);

    const templateRules = [
      mergeWith(templateSource),
      mergeWith(e2eTemplateSource)
    ];

    if (options.authenticationType === 'session') {
      const sessionAuthenticationTemplateSource = apply(
        url('./session-files'),
        [applyTemplates({ dot: '.', prefix, ...strings }), move(sourcePath)]
      );

      const e2eTemplateSource = apply(url('./session-e2e-files'), [
        applyTemplates({
          dot: '.',
          prefix,
          ...strings
        }),
        move(e2eSourcePath)
      ]);

      templateRules.push(mergeWith(sessionAuthenticationTemplateSource));
      templateRules.push(mergeWith(e2eTemplateSource));
    }

    return chain(templateRules);
  };
}

function deleteGeneratedApplicationFiles(
  tree: Tree,
  files: string[],
  options: { path: string }
) {
  files.forEach(file => {
    if (tree.exists(getAbsolutePath(options, file))) {
      tree.delete(getAbsolutePath(options, file));
    }
  });
}

function getAbsolutePath(options: { path: string }, filename: string) {
  return getBasePath({ path: options.path }) + filename;
}
