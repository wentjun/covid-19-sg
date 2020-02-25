import { Epic } from 'redux-observable';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';
import * as actions from '../actions';
import { RootState } from '../reducers';
import covidData from '../../data/covid-sg.json';
import { Point, Feature, FeatureCollection } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';

type Action = ActionType<typeof actions>;

const setDateRangeEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.setDateRange)),
    withLatestFrom(state$),
    map((epic) => {
      const { control: { dateEndRange } } = epic[1];
      const covidDataFeatures = covidData.features as Array<Feature<Point, PointProperties>>;
      const features = covidDataFeatures.filter((feature) => (
        (new Date(feature.properties.confirmed)).setHours(0, 0, 0, 0) < +dateEndRange
      ));
      const clusterFeatureCollection: FeatureCollection<Point, PointProperties> = {
        type: 'FeatureCollection',
        features
      };

      return (actions.setClusterData(clusterFeatureCollection));
    })
  );

export default [
  setDateRangeEpic
];
