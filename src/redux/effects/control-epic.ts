import { Epic } from 'redux-observable';
import {
  filter,
  withLatestFrom,
  concatMap,
  map,
} from 'rxjs/operators';
import { ActionType, isActionOf } from 'typesafe-actions';
import { Point, FeatureCollection } from 'geojson';
import { of } from 'rxjs';
import * as actions from '../actions';
import { RootState } from '../reducers';
import covidData from '../../data/covid-sg.json';
import { PointProperties } from '../../shared/models/PointProperties';

const {
  setClusterData, setSelectedCluster, setSelectedCase, setDateRange,
} = actions;

type Action = ActionType<typeof actions>;

const setDateRangeEpic: Epic<Action, Action, RootState> = (action$, state$) => action$.pipe(
  filter(isActionOf(setDateRange)),
  withLatestFrom(state$),
  concatMap(([, { control: { dateEndRange, selectedCase } }]) => {
    const covidDataFeatures = (covidData as FeatureCollection<Point, PointProperties>).features;
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
              hasRecoveredOnRangeDate: (new Date(feature.properties.discharged) <= dateEndRange),
            },
          };
        }

        return {
          ...feature,
          properties: {
            ...feature.properties,
            isActive: selectedCase?.properties.isActive && selectedCase?.properties.id === feature.properties.id,
            hasRecoveredOnRangeDate: (new Date(feature.properties.discharged) <= dateEndRange),
          },
        };
      });

    const clusterFeatureCollection: FeatureCollection<Point, PointProperties> = {
      type: 'FeatureCollection',
      features,
    };

    if (selectedCase?.properties.isActive) {
      return of(setClusterData(clusterFeatureCollection));
    }
    // only update selected cases if no cases were selected by user
    const latestCase = features[features.length - 1];
    return of(
      setClusterData(clusterFeatureCollection),
      setSelectedCase(latestCase),
    );
  }),
);

const setSelectedCaseEpic: Epic<Action, Action, RootState> = (action$, state$) => action$.pipe(
  filter(isActionOf(setSelectedCase)),
  withLatestFrom(state$),
  concatMap(([{ payload: { selectedCase } }, { map: { clusterData } }]) => {
    let features;
    if (selectedCase) {
      const { properties: { id } } = selectedCase;
      features = clusterData.features.map((feature) => {
        const { properties } = feature;
        if (id === properties.id) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              isActive: true,
            },
          };
        }
        const { isActive, ...otherProperties } = feature.properties;
        return {
          ...feature,
          properties: {
            ...otherProperties,
          },
        };
      });
    } else {
      features = clusterData.features.map((feature) => {
        const { isActive, ...otherProperties } = feature.properties;
        return {
          ...feature,
          properties: {
            ...otherProperties,
          },
        };
      });
    }

    // if (!features) {
    //   return null;
    // }

    if (selectedCase) {
      return of(
        setSelectedCluster(null),
        setClusterData({
          type: 'FeatureCollection',
          features,
        }),
      );
    }
    return of(
      setClusterData({
        type: 'FeatureCollection',
        features,
      }),
    );
  }),
);

const setSelectedClusterEpic: Epic<Action, Action, RootState> = (action$) => action$.pipe(
  filter(isActionOf(setSelectedCluster)),
  filter((epic) => !!epic.payload.selectedCluster),
  map(() => setSelectedCase(null)),
);

export default [
  setDateRangeEpic,
  setSelectedCaseEpic,
  setSelectedClusterEpic,
];
