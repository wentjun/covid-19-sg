<div align="center">

# COVID-19 Singapore Tracker (https://covid-tracker.com/) - Visualising COVID-19/Wuhan virus/coronavirus cases and cluster zones in Singapore #

</div>

----
This is a website that tracks COVID-19 cases and clusters in Singapore.

Built with React, TypeScript, Redux, Redux Observable, RxJS, Styled Components, and Mapbox. Data is scraped from <a href="https://www.flaticon.com/" title="CNA">Channel NewsAsia</a>, and <a href="https://www.gov.sg/article/covid-19-cases-in-singapore" title="gov.sg">Gov.sg</a> using Cheerio and NodeJS. Polygon data is partially obtained from [nominatim](https://nominatim.openstreetmap.org/).

<h4>Data on this website is <a href="https://github.com/wentjun/covid-19-sg/tree/master/src/data" title="data">publicly available</a> (also accessible via `src/data`) for your usage.</h4>

- `covid-sg.json` (in GEOJSON `FeatureCollection` format) consists of meta data of each COVID-19 case in Singapore.

| fields        | description           |
| ------------- |:-------------|
| geometry.coordinates     | coordinates of the place of residence (other fallback values might include locations such as workplace, if the former is not made available) |
| properties.id      | unique ID of each case (for internal use) |
| properties.title | Alias for each case from official sources |    
| properties.confirmed | Date of confirmed diagnosis |   
| properties.discharged | Date of recovery/discharge |   
| properties.hospital | Location of hospitalisation     
| properties.source | news source URL |  
| properties.nationality | Nationality/Residency of the individual |  
| properties.residenceAreas | List of places of residence |  
| properties.placesVisited | List of places visited by the individual |  
| properties.age | Age of individual |  
| properties.death | Date of death |  

- `locations.json` (in GEOJSON `FeatureCollection` format) consists of meta data of transmission clusters and other notable COVID-19 locations (hotspots, hospitals etc) in Singapore.


| fields     | description |
| ------------- |:-------------|
| geometry.coordinates     | coordinates of the polygons of each location |
| properties.location      | name of each location      |
| properties.type | official transmission clusters (`cluster`), hospitals (`hospital`) or other notable locations (`other`)      |
| properties.cases | linked COVID-19 cases      |

- `news-content.json` consists of a short summary of each case in Singapore


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
