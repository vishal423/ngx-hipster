import { Tree, Rule } from '@angular-devkit/schematics';
const prettier = require('prettier');
import { normalize } from 'path';
import * as fs from 'fs';

export function applyPrettierOnFile(options: { path: string }): Rule {
  return (tree: Tree) => {
    prettierApply(tree, options.path);
    return tree;
  };
}

export function applyPrettier(options: { path: string }): Rule {
  return (tree: Tree) => {
    tree.getDir(options.path).visit(filePath => {
      prettierApply(tree, filePath);
    });
    return tree;
  };
}

function prettierApply(tree: Tree, filePath: string) {
  if (
    !(
      filePath.endsWith('.ts') ||
      filePath.endsWith('.scss') ||
      filePath.endsWith('.html') ||
      filePath.endsWith('.json') ||
      filePath.endsWith('.js')
    )
  ) {
    return;
  }
  const buffer = tree.read(filePath);
  if (!buffer) {
    return;
  }

  let prettierOptions: any = {};
  if (fs.existsSync(normalize('.prettierrc'))) {
    prettierOptions = prettier.resolveConfig.sync(filePath, {
      editorconfig: true,
      config: normalize('.prettierrc')
    });
  } else {
    prettierOptions = prettier.resolveConfig.sync(filePath, {
      editorconfig: true,
      config: normalize('node_modules/ngx-hipster/.prettierrc')
    });
  }

  prettierOptions.filepath = normalize(filePath);

  tree.overwrite(
    filePath,
    prettier.format(buffer.toString('utf-8'), prettierOptions)
  );
}
