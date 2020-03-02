<div align="center">

# COVID-19 Singapore Tracker (https://covid-tracker.com/) - Visualising COVID-19/Wuhan virus/coronavirus cases and cluster zones in Singapore #

</div>

----
This is a website that tracks COVID-19 cases and clusters in Singapore. 

Built with React, TypeScript, Redux, Redux Observable, RxJS, Styled Components, and Mapbox. Data is scraped from <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="CNA">Channel NewsAsia</a>, and <a href="https://www.gov.sg/article/covid-19-cases-in-singapore" title="gov.sg">Gov.sg</a> using Cheerio and NodeJS.

Data on this website is <a href="https://github.com/wentjun/covid-19-sg/tree/master/src/data" title="data">publicly available</a>.

----
## How to contribute

- Contributors/collaborators may open an issue, or email me at wentjun289@hotmail.com.

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

3) Data scraping using [cheerio](https://cheerio.js.org/)

----
