import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
  SchematicsException,
  SchematicContext
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { getProject } from '../utils/utils';
import { Schema } from './schema';
import { Entity } from './entity';
import {
  addModuleExport,
  applyChanges,
  addImportStatement,
  addAppRouteDeclaration
} from '../utils/module-util';
import { applyPrettier, applyPrettierOnFile } from '../utils/prettier-util';

export function entity(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const entityJson = tree.read(options.entityJson);

    if (!entityJson) {
      throw new SchematicsException(
        `Could not read file ${options.entityJson}`
      );
    }

    const entity = JSON.parse(entityJson.toString('utf-8')) as Entity;

    const project = getProject(tree, options);
    let sourcePath = `${project.sourceRoot}`;
    const prefix = `${project.prefix}` || 'hip';

    if (project.projectType === 'application') {
      sourcePath = normalize(`${sourcePath}/app`);
    } else {
      throw new SchematicsException(
        `Project type : ${project.projectType} is not supported by this schematic`
      );
    }

    addImportStatement(
      tree,
      normalize(`${sourcePath}/app-routing.module.ts`),
      'AuthenticatedUserGuard',
      './security/authenticated-user.guard'
    );

    addLazyLoadModuleRoute(
      tree,
      context,
      entity.name,
      sourcePath,
      'app-routing.module.ts'
    );

    addModuleExport(
      tree,
      normalize(`${sourcePath}/material/material.module.ts`),
      'MatRadioModule',
      '@angular/material/radio'
    );
    addModuleExport(
      tree,
      normalize(`${sourcePath}/material/material.module.ts`),
      'MatDialogModule',
      '@angular/material/dialog'
    );
    addModuleExport(
      tree,
      normalize(`${sourcePath}/material/material.module.ts`),
      'MatProgressSpinnerModule',
      '@angular/material/progress-spinner'
    );
    addModuleExport(
      tree,
      normalize(`${sourcePath}/material/material.module.ts`),
      'MatTooltipModule',
      '@angular/material/tooltip'
    );

    const templateSource = apply(url('./files'), [
      applyTemplates({
        dot: '.',
        ...strings,
        entity,
        prefix,
        name: entity.name
      }),
      move(normalize(sourcePath))
    ]);

    return chain([
      mergeWith(templateSource),
      applyPrettierOnFile({
        path: normalize(`${sourcePath}/app-routing.module.ts`)
      }),
      applyPrettierOnFile({
        path: normalize(`${sourcePath}/material/material.module.ts`)
      }),
      applyPrettier({
        path: normalize(`${sourcePath}/${strings.dasherize(entity.name)}`)
      })
    ]);
  };
}

function addLazyLoadModuleRoute(
  tree: Tree,
  context: SchematicContext,
  name: string,
  filePath: string,
  fileName: string
) {
  const buffer = tree.read(normalize(`${filePath}/${fileName}`));

  if (!buffer) {
    throw new SchematicsException(
      `Could not read file ${filePath}/${fileName}`
    );
  }

  const moduleContent = buffer.toString('utf-8');

  const source = ts.createSourceFile(
    normalize(`${filePath}/${fileName}`),
    moduleContent,
    ts.ScriptTarget.Latest,
    true
  );

  if (moduleContent.indexOf(`path: '${strings.dasherize(name)}'`) !== -1) {
    context.logger.info('Route path already exists.');
    return;
  }

  const change = addAppRouteDeclaration(
    source,
    normalize(`${filePath}/${fileName}`),
    `{
      path: '${strings.dasherize(name)}',
      canActivateChild: [AuthenticatedUserGuard],
      loadChildren: () => import('./${strings.dasherize(
        name
      )}/${strings.dasherize(name)}.module').then(m => m.${strings.classify(
      name
    )}Module)
      },
    `
  );

  applyChanges(tree, [change], normalize(`${filePath}/${fileName}`));
}
