import { Epic } from 'redux-observable';
import { filter, withLatestFrom, concatMap } from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';
import * as actions from '../actions';
import { RootState } from '../reducers';
import covidData from '../../data/covid-sg.json';
import { Point, Feature, FeatureCollection } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';
import { of } from 'rxjs';

type Action = ActionType<typeof actions>;

const setDateRangeEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.setDateRange)),
    withLatestFrom(state$),
    concatMap(([, { control: { dateEndRange } }]) => {
      const covidDataFeatures = covidData.features as Array<Feature<Point, PointProperties>>;
      const features = covidDataFeatures
        .filter((feature) => (
          (new Date(feature.properties.confirmed)).setHours(0, 0, 0, 0) < +dateEndRange
        ))
        .map((feature) => {
          if (dateEndRange.toLocaleDateString('fr-CA') === feature.properties.confirmed) {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                isDateEndRange: true,
                hasRecoveredOnRangeDate: (new Date(feature.properties.discharged) <= dateEndRange)
              }
            };
          }

          return {
            ...feature,
            properties: {
              ...feature.properties,
              hasRecoveredOnRangeDate: (new Date(feature.properties.discharged) <= dateEndRange)
            }
          };
        });

      const clusterFeatureCollection: FeatureCollection<Point, PointProperties> = {
        type: 'FeatureCollection',
        features
      };
      const latestCase = features[features.length - 1];

      return of(
        actions.setClusterData(clusterFeatureCollection),
         actions.setSelectedCase(latestCase)
       );
    })
  );

export default [
  setDateRangeEpic
];
