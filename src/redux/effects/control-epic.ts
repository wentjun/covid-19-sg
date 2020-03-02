import { Epic } from 'redux-observable';
import { filter, withLatestFrom, concatMap, map } from 'rxjs/operators';
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
    concatMap(([, { control: { dateEndRange, selectedCase } }]) => {
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
                isActive: selectedCase?.properties.isActive && selectedCase?.properties.id === feature.properties.id,
                isDateEndRange: true,
                hasRecoveredOnRangeDate: (new Date(feature.properties.discharged) <= dateEndRange)
              }
            };
          }

          return {
            ...feature,
            properties: {
              ...feature.properties,
              isActive: selectedCase?.properties.isActive && selectedCase?.properties.id === feature.properties.id,
              hasRecoveredOnRangeDate: (new Date(feature.properties.discharged) <= dateEndRange)
            }
          };
        });

      const clusterFeatureCollection: FeatureCollection<Point, PointProperties> = {
        type: 'FeatureCollection',
        features
      };

      if (selectedCase?.properties.isActive) {
        return of(actions.setClusterData(clusterFeatureCollection));
      }
      // only update selected cases if no cases were selected by user
      const latestCase = features[features.length - 1];
      return of(
        actions.setClusterData(clusterFeatureCollection),
        actions.setSelectedCase(latestCase)
      );
    })
  );

const setSelectedCaseEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.setSelectedCase)),
    filter(epic => !!epic.payload.selectedCase.properties.isActive),
    withLatestFrom(state$),
    map(([{ payload: { selectedCase: { properties : { id }} }}, { map: { clusterData } } ]) => {
      const features = clusterData.features.map(feature => {
        const { properties } = feature;
        if (id === properties.id) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              isActive: true
            }
          };
        }
        const { isActive, ...otherProperties } = feature.properties;
        return {
          ...feature,
          properties: {
            ...otherProperties
          }
        };
      });
      return actions.setClusterData({
        type: 'FeatureCollection',
        features
      });
    })
  );

export default [
  setDateRangeEpic,
  setSelectedCaseEpic
];
