<div align="center">

# COVID-19 Singapore Tracker - Built with React, TypeScript, Redux, Redux Observable, and RxJS #

</div>

----
## Quick Start
1. Clone (`git clone git@github.com:wentjun/covid-19-sg.git`), or directly download this repository.
2. Install dependencies.

    ```
    npm i
    ```
3. Start the application in development mode. Opens the application on [http://localhost:3000](http://localhost:3000).

    ```
    npm start
    ```

----

## Upcoming Features

TODO

----

## Credits

1) Flaticon: Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

----

## Architecture & Libraries

1) Main application components

- [React.js](https://reactjs.org/), with Presentation and Container components.

- CSS in JS. This application uses [Styled Components](https://www.styled-components.com/) for that purpose.

- Reactive JavaScript ([RxJS](https://www.learnrxjs.io/)).

- [Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/) for rendering of the map.

2) State Management with [Redux](https://react-redux.js.org/). The following additional libraries help to manage the verbosity incurred from integrating TypeScript and RxJS with Redux.

- Usage of [typesafe actions](https://github.com/piotrwitek/typesafe-actions)

- Handling of effects (also known as 'epics') using [Redux-observables](https://github.com/redux-observable/redux-observable).

----
