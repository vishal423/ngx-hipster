# Ngx Hipster

> Angular schematics to scaffold production ready angular material applications

# Demo

You can try out demo application at https://vishal423.github.io/ngx-hipster/index.html (login with username: `admin` and password: `admin` to access the protected pages)

Demo application uses angular in-memory-api to intercept all back-end api calls.

# Pre-requisites

This guide assumes that you have already created a new angular cli application with `SCSS` styles.

# Usage

Install `ngx-hipster` dependency in your project. Default `ng-add` schematic will prompt to configure your application with recommended setup.

```bash
ng add ngx-hipster
```

### Default configurations:

- Scaffold angular material shell application with login support. Default security is compatible with `JHipster` session authentication.
- Configure `prettier`
- Configure `Jest`
- Configure `proxy`

### Entity Schematic

- Scaffold `Create`, `Update`, and `List` (and `Delete` dialog) screens.
- Create new `json` file to describe your entity structure and place that in the project root directory. As an example, consider the following `entity.json` that represents the structure of a `movie` entity.

```json
{
  "name": "movie",
  "pageTitle": "Movies",
  "fields": [
    {
      "label": "Title",
      "name": "title",
      "dataType": "string",
      "controlType": "text",
      "validation": {
        "required": true,
        "minlength": 2,
        "maxlength": 20
      }
    },
    {
      "label": "Plot",
      "name": "plot",
      "dataType": "string",
      "controlType": "textarea",
      "validation": {
        "minlength": 100
      }
    },
    {
      "label": "Genre",
      "name": "genre",
      "dataType": "string",
      "controlType": "radio",
      "validation": {},
      "options": [
        {
          "name": "adventure",
          "label": "Adventure"
        },
        {
          "name": "drama",
          "label": "Drama"
        },
        {
          "name": "sci-fi",
          "label": "Science Fiction"
        }
      ]
    },
    {
      "label": "Release Date",
      "name": "releaseDate",
      "dataType": "date",
      "controlType": "text",
      "format": "MM/dd/yy",
      "validation": {}
    }
  ]
}
```

- Execute following command from the project root directory to generate entity layout screens. When prompted, specify path to the entity json file (created in the above step):

```bash
$  ng g ngx-hipster:entity
? Provide relative path to the entity Json filename movie.json
```

## Acknowledgements

- [Angular Material](https://github.com/angular/components) schematics - Code references and inspiration.

## License

MIT © [Vishal Mahajan](https://twitter.com/vishal423)
