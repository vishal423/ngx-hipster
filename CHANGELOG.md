# Change Log

All notable changes to the "ngx-hipster" project will be documented in this file.

## [Unreleased]

### Added

- Support the `JHipster` `OIDC` authentication type.

### Changed

- Refactoring of `app-shell` schematic to prompt selection of user authentication type. Defaults to `session`.

## [0.4.0] - 2020-01-15

### Added

- Support `select`, `autocomplete`, and `date` control types
- Create a changelog file to provide more visibility on the notable changes.

### Changed

- Add `select`, `autocomplete`, and `date` control type examples in the demo application.

## [0.3.0] - 2019-12-15

### Added

- Integrate GitHub actions.
- Include a demo application and host it on the GitHub

### Changed

- Pluralize list variables and the `api` endpoint urls
- Externalize the primary key. Defaults to `Id`
- Allow customizing fields on the `List`, and `Create`/`Edit` page

## [0.2.1] - 2019-12-12

### Fixed

- Fix `prettier` transformation issue

## [0.2.0] - 2019-12-11

### Added

- Schematic to generate entity Create, Update, List, and Delete screens
- Support `text`, `textarea`, and `radio` control types
- Add lazy loading of entity routes as default
- Use sidenav navigation to display the entity menu

### Changed

- Upgrade angular dependencies.

## [0.1.0] - 2019-12-02

### Added

- Schematic to configure `Jest`
- Schematic to configure `Prettier`
- Schematic to configure `http proxy`
- Schematic to generate a shell `Angular Material` application
