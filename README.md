# filmsfr-web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.8.

## Start

#### Important
  This project uses [goldengate24k](https://github.com/patchedsox/goldengate24k) as interface to communicate with [filmsfr-api](https://github.com/patchedsox/filmsfr-api)

Click here for [yarn](https://yarnpkg.com/en/docs/install) 

To start this project, use:
```
yarn build && yarn start
```

Unit tests:
```
yarn test
```

e2e tests
```
yarn e2e
```

To run the project in a simple docker container, use:
```
yarn up
```

##### Note: 
with ```yarn up``` it is served on localhost:80

## Ideas

#### Current features:

1. Home page with a map
2. Load points within a predefined radius
3. Given the center of the map as your current location, optimize a route of most optimal 11 points nearby
4. Text search locations


#### Pending features & improvements:

1. Better overall UX/UI design
2. Radius slider to select range
3. Visualize current radius
4. Introduce fuzzy search
5. Plan a route of selected points
6. User profile / login
7. User settings
8. Advanced search
9. Route planning based on advanced search
10. Suggest points based on user preferences


## Technical
- This project is an @angular/cli project for convenience
- It supports unit and e2e testing

#### Folder structure
```
_ app
    |__ pages /
    |   |__ <page-name>
    |   |   |__ <page-name>.component.html
    |   |   |__ <page-name>.component.scss
    |   |   |__ <page-name>.component.spec.ts
    |   |   |__ <page-name>.component.ts
    |__ components /
    |   |__ <component-name>
    |   |   |__ <component-name>.component.html
    |   |   |__ <component-name>.component.scss
    |   |   |__ <component-name>.component.spec.ts
    |   |   |__ <component-name>.component.ts
    |__ app.component.html
    |__ app.component.scss
    |__ app.component.spec.ts
    |__ app.component.ts
    |__ app.module.ts
    |__ app-routing.module.ts
    |__ app.store-actions.ts
    |__ app.store.ts
    ...
    ..
    .
```

#### Notes & technical improvements

In this project, you can find:
- Basic Angular project structure
- Testing
- Basic flux pattern with redux store without epics (side effects)
- Usage of observables
- Modular approach

Awaiting improvements are:
- Improved test configuration
- Separation of representation logic between route planner and locations
- Global test configurations
- Redux observables (epics)
- Improved map visualization performance
  - e.g. Clustering points etc...
- Cancellation triggers of repeatable requests
- Tracing and merging of request loop
- Full mobile support