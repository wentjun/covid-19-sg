<div align="center">

# Taxi Status App - Built with React, TypeScript, Redux, Redux Observable, and RxJS #

</div>

----
## Quick Start
1. Clone (`git clone git@github.com:wentjun/taxi-app.git`), or directly download this repository.
2. Install dependencies.

    ```
    npm i
    ```
3. Start the application in development mode. Opens the application on [http://localhost:3000](http://localhost:3000).

    ```
    npm start
    ```
4. Due to CORS restrictions from the API endpoint, you may need to install an additional plugin to ensure that the application can run smoothly on localhost. 

     If you are running the application on Chrome, simply download a plugin such as [this](https://chrome.google.com/webstore/detail/moesif-orign-cors-changer/digfbfaphojjndkpccljibejjbppifbc/related), which will overwrite CORS headers and perform cross-domain requests.

     If you are running the safari on Safari, enable Developer mode by going to 'Preferences', followed by 'Advanced'. On the 'Develop' section on the top menu, check 'Disable Cross-Origin Restrictions'.

----

## Current Features

1) Selecting the number of drivers to be rendered on the map. The input can be changed via the range slider, or input text box. Do take note of the zoom levels will result in 'clustering', or 'declustering' of the markers which represent the drivers.

2) Updating of the user's current location by double clicking on the map.

3) Viewing of driver's ETA, relative to the user's current location.

----

## Upcoming Features

1) Implementation of Service Workers and Progressive Web Application for improved performance, and refined experience for mobile users.

2) Additional option of updating the user's current location using forward, and reverse geocoding.


----

## Credits

1) Map markers: Icon made by [mynamepong](https://www.flaticon.com/authors/mynamepong) from [https://www.flaticon.com](https://www.flaticon.com).

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


## Advanced References & Documentation

For those who are already familiar with React.js, the following resources will greatly help you in implementing TypeScript, Redux, and Reactive JavaScript (RxJS) into your application.

1) [The complete guide to static typing in "React & Redux" apps using TypeScript](https://github.com/piotrwitek/react-redux-typescript-guide)
