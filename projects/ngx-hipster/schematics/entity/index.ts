import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
  SchematicsException
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';

import { getProject } from '../utils/utils';
import { Schema } from './schema';
import { Entity } from './entity';

export function entity(options: Schema): Rule {
  return (tree: Tree) => {
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

    return chain([mergeWith(templateSource)]);
  };
}
