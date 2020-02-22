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
      // @ts-ignore
      const features = covidData.features.filter((feature: Feature<Point, PointProperties>) => new Date(feature.properties.confirmed) <= dateEndRange.setHours(0, 0, 0, 0) );
      const clusterFeatureCollection: FeatureCollection<Point, PointProperties> = {
        type: 'FeatureCollection',
        features
      };

      return (actions.setClusterData(clusterFeatureCollection));
    }),
    // ignoreElements()
  );

export default [
  setDateRangeEpic
];
