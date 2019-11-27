import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import { getProject, readFile } from './utils';

export function addRootModuleImport(
  tree: Tree,
  moduleName: string,
  moduleImportPath: string,
  options: { project?: string }
) {
  const filePath = getAppModulePath(
    tree,
    getMainFilePath(getProject(tree, options))
  );

  addModuleImport(tree, filePath, moduleName, moduleImportPath);
}

export function addModuleImport(
  tree: Tree,
  filePath: string,
  moduleName: string,
  moduleImportPath: string
) {
  const buffer = readFile(tree, filePath);
  const file = ts.createSourceFile(
    filePath,
    buffer.toString(),
    ts.ScriptTarget.Latest,
    true
  );

  const changes = addImportToModule(
    file,
    filePath,
    moduleName,
    moduleImportPath
  );
  const recorder = tree.beginUpdate(filePath);

  changes.forEach(change => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(recorder);
}

export function getMainFilePath(project: any): string {
  if (
    !project.architect ||
    !project.architect.build ||
    !project.architect.build.options
  ) {
    throw new SchematicsException(
      `Could not find the project build options file`
    );
  }

  const buildOptions = project.architect.build.options;

  if (!buildOptions.main) {
    throw new SchematicsException(`Could not find the project main file`);
  }

  return buildOptions.main;
}
