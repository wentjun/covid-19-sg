import { createAction } from 'typesafe-actions';
import { ClusterLocation } from '../../shared/models/ClusterZones';

export const MAP_READY = '[Map] Set Map As Ready';
export const MAP_UPDATE_CURRENT_LOCATION = '[Map] Update Current Location';
export const MAP_UPDATE_TAXI_LOCATIONS = '[Map] Update Taxi Locations';
export const MAP_UPDATE_TAXI_LOCATIONS_ERROR =
  '[Map] Update Taxi Locations Error';
export const CONTROL_SET_TAXI_COUNT = '[Control] Set Taxi Count';
export const CONTROL_GET_TAXI_ETA = '[Control] Get Taxi ETA';
export const CONTROL_TOGGLE_DISPLAY_TRANSMISSION_CLUSTERS = '[Control] Toggle Display Transmission ClusterS';
export const CONTROL_SET_SELECTED_CLUSTER = '[Control] Set Selected Cluster';

export const mapReady = createAction(MAP_READY);

export const updateCurrentLocation = createAction(
  MAP_UPDATE_CURRENT_LOCATION,
  resolve => (longitude: number, latitude: number) =>
    resolve({ longitude, latitude })
);

export const toggleDisplayTransmissionClusters = createAction(
  CONTROL_TOGGLE_DISPLAY_TRANSMISSION_CLUSTERS,
  resolve => (displayTransmissionClusters: boolean) =>
    resolve({ displayTransmissionClusters })
);

export const setSelectedCluster = createAction(
  CONTROL_SET_SELECTED_CLUSTER,
  resolve => (selectedCluster: ClusterLocation) =>
    resolve({ selectedCluster })
);
