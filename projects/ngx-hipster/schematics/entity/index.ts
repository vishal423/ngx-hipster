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
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { getProject, pluralize } from '../utils/utils';
import { Schema } from './schema';
import { Entity, Field } from './entity';
import {
  addModuleExport,
  applyChanges,
  addImportStatement,
  addAppRouteDeclaration
} from '../utils/module-util';
import { applyPrettier, applyPrettierOnFile } from '../utils/prettier-util';
import { getHtmlChildElementByTagName } from '../utils/html-util';

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

    const e2eSourcePath = normalize(`${project.root}/e2e/src`);

    if (!entity.primaryField) {
      entity.primaryField = 'id';
    }

    handleUnknownPrimaryField(entity);
    handleUnknownPageOptions(entity);

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

    addSidenavLink(
      tree,
      context,
      normalize(`${sourcePath}/layout/sidenav/sidenav.component.html`),
      entity
    );

    addSidenavLinkInE2EPageObject(
      tree,
      context,
      normalize(`${e2eSourcePath}/sidenav.po.ts`),
      entity
    );

    const containsSelectField =
      entity.fields.find((field: Field) => field.controlType === 'select') !==
      undefined;

    if (containsSelectField) {
      addModuleExport(
        tree,
        normalize(`${sourcePath}/material/material.module.ts`),
        'MatSelectModule',
        '@angular/material/select'
      );
    }

    const containsRadioField =
      entity.fields.find((field: Field) => field.controlType === 'radio') !==
      undefined;

    if (containsRadioField) {
      addModuleExport(
        tree,
        normalize(`${sourcePath}/material/material.module.ts`),
        'MatRadioModule',
        '@angular/material/radio'
      );
    }
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

    const containsAutocompleteField =
      entity.fields.find(
        (field: Field) => field.controlType === 'autocomplete'
      ) !== undefined;

    if (containsAutocompleteField) {
      addModuleExport(
        tree,
        normalize(`${sourcePath}/material/material.module.ts`),
        'MatAutocompleteModule',
        '@angular/material/autocomplete'
      );
    }

    const containsDateField =
      entity.fields.find((field: Field) => field.dataType === 'date') !==
      undefined;

    if (containsDateField) {
      addModuleExport(
        tree,
        normalize(`${sourcePath}/material/material.module.ts`),
        'MatDatepickerModule',
        '@angular/material/datepicker'
      );

      addModuleExport(
        tree,
        normalize(`${sourcePath}/material/material.module.ts`),
        'MatNativeDateModule',
        '@angular/material/core'
      );
    }

    const primaryKeyField = entity.fields.find(
      (field: Field) => field.name === entity.primaryField
    );

    const primaryKeyDataType =
      primaryKeyField !== undefined ? primaryKeyField.dataType : 'number';

    const templateSource = apply(url('./files'), [
      applyTemplates({
        dot: '.',
        ...strings,
        pluralize,
        entity,
        prefix,
        name: entity.name,
        primaryKey: entity.primaryField,
        primaryKeyDataType
      }),
      move(normalize(sourcePath))
    ]);

    const e2eTemplateSource = apply(url('./e2e-files'), [
      applyTemplates({
        dot: '.',
        ...strings,
        pluralize,
        entity,
        prefix,
        name: entity.name
      }),
      move(e2eSourcePath)
    ]);

    return chain([
      mergeWith(templateSource),
      mergeWith(e2eTemplateSource),
      applyPrettierOnFile({
        path: normalize(`${sourcePath}/app-routing.module.ts`)
      }),
      applyPrettierOnFile({
        path: normalize(`${sourcePath}/material/material.module.ts`)
      }),
      applyPrettier({
        path: normalize(`${sourcePath}/${strings.dasherize(entity.name)}`)
      }),
      applyPrettierOnFile({
        path: normalize(`${sourcePath}/layout/sidenav/sidenav.component.html`)
      }),
      applyPrettier({
        path: normalize(`${e2eSourcePath}/${strings.dasherize(entity.name)}`)
      }),
      applyPrettierOnFile({
        path: normalize(`${e2eSourcePath}/sidenav.po.ts`)
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

  if (
    moduleContent.indexOf(`path: '${pluralize(strings.dasherize(name))}'`) !==
    -1
  ) {
    context.logger.info('Skip route addition. Route path already exists.');
    return;
  }

  const change = addAppRouteDeclaration(
    source,
    normalize(`${filePath}/${fileName}`),
    `{
      path: '${pluralize(strings.dasherize(name))}',
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

function addSidenavLink(
  tree: Tree,
  context: SchematicContext,
  htmlFilePath: string,
  entity: any
) {
  const buffer = tree.read(htmlFilePath);

  if (!buffer) {
    throw new SchematicsException(
      `Could not read the sidenav html template file ${htmlFilePath}`
    );
  }

  const content = buffer.toString('utf-8');

  if (
    content.includes(
      `routerLink="/${pluralize(strings.dasherize(entity.name))}"`
    )
  ) {
    context.logger.info(
      'Skip navigation element in the sidenav. Navigation element already exists.'
    );
    return;
  }

  const navListTag = getHtmlChildElementByTagName('mat-nav-list', content);

  if (!navListTag) {
    throw new SchematicsException(
      `Could not find nav list element in the sidenav html template file: ${htmlFilePath}`
    );
  }

  if (!navListTag.sourceCodeLocation) {
    throw new SchematicsException(
      `Could not get source code location in the sidenav template AST tree`
    );
  }

  const endTagOffset = navListTag.sourceCodeLocation.endTag.startOffset;

  const recordedChange = tree.beginUpdate(htmlFilePath).insertRight(
    endTagOffset,
    `
    <a mat-list-item routerLink="/${pluralize(strings.dasherize(entity.name))}"
      class="nav-links__item"
      routerLinkActive="nav-links__item--active" >
      <span class="nav-links__item__text">
        ${strings.classify(entity.pageTitle)}
      </span>
    </a>
    `
  );

  tree.commitUpdate(recordedChange);
}

function addSidenavLinkInE2EPageObject(
  tree: Tree,
  context: SchematicContext,
  filePath: string,
  entity: Entity
) {
  const buffer = tree.read(filePath);

  if (!buffer) {
    throw new SchematicsException(`Could not read file ${filePath}`);
  }

  const sidenavContent = buffer.toString('utf-8');

  if (sidenavContent.indexOf(`${strings.camelize(entity.name)}Menu`) !== -1) {
    context.logger.info(
      `${strings.camelize(entity.name)} route menu already exists.`
    );
    return;
  }

  const source = ts.createSourceFile(
    normalize(`${filePath}`),
    sidenavContent,
    ts.ScriptTarget.Latest,
    true
  );

  const change = new InsertChange(
    normalize(`${filePath}`),
    source.getEnd() - 2,
    `${strings.camelize(
      entity.name
    )}Menu = this.root.element(by.css('a[routerLink="/${pluralize(
      strings.dasherize(entity.name)
    )}"]'));`
  );

  applyChanges(tree, [change], normalize(`${filePath}`));
}

function handleUnknownPrimaryField(entity: Entity) {
  if (!entity.primaryField) {
    entity.primaryField = 'id';
  }

  const primaryField = entity.fields.find(
    (field: Field) => field.name === entity.primaryField
  );
  if (!primaryField) {
    const field: Field = {
      name: 'id',
      label: 'id',
      controlType: 'text',
      dataType: 'number',
      validation: {}
    } as Field;
    entity.fields.unshift(field);
  }
}

function handleUnknownPageOptions(entity: Entity) {
  if (!entity.pageOptions) {
    entity.pageOptions = {};
  }

  if (!entity.pageOptions.list) {
    entity.pageOptions.list = {
      displayFields: entity.fields
        .filter((field: Field) => field.name !== entity.primaryField)
        .map((field: Field) => field.name)
    };
  }

  if (!entity.pageOptions.edit) {
    entity.pageOptions.edit = {
      hideFields: entity.fields
        .filter((field: Field) => field.name === entity.primaryField)
        .map((field: Field) => field.name)
    };
  }
}
