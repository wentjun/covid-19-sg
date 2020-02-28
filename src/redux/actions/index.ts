import { createAction } from 'typesafe-actions';
import { TransmissionClusterProperties } from '../../shared/models/ClusterZones';
import { Feature, Point, FeatureCollection, Polygon } from 'geojson';
import { PointProperties } from '../../shared/models/PointProperties';

export const MAP_READY = '[Map] Set Map As Ready';
export const MAP_UPDATE_CURRENT_LOCATION = '[Map] Update Current Location';
export const MAP_UPDATE_TAXI_LOCATIONS = '[Map] Update Taxi Locations';
export const MAP_UPDATE_TAXI_LOCATIONS_ERROR =
  '[Map] Update Taxi Locations Error';
export const MAP_SET_CLUSTER_DATA = '[MAP] Set Cluster Data';
export const CONTROL_SET_TAXI_COUNT = '[Control] Set Taxi Count';
export const CONTROL_GET_TAXI_ETA = '[Control] Get Taxi ETA';
export const CONTROL_TOGGLE_DISPLAY_TRANSMISSION_CLUSTERS = '[Control] Toggle Display Transmission Clusters';
export const CONTROL_TOGGLE_DISPLAY_CASE_CLUSTERS = '[Control] Toggle Display Case ClusterS';
export const CONTROL_SET_SELECTED_CLUSTER = '[Control] Set Selected Cluster';
export const CONTROL_SET_SELECTED_CASE = '[Control] Set Selected Case';
export const CONTROL_SET_END_DATE_RANGE = '[Control] Set End Date Range';
export const CONFIG_INITIALISE_SERVICE_WORKER = '[Config] Initialise Service Worker';
export const CONFIG_UPDATE_SERVICE_WORKER = '[Config] Update Service Worker';

export const mapReady = createAction(MAP_READY);

export const setClusterData = createAction(
  MAP_SET_CLUSTER_DATA,
  resolve => (clusterData: FeatureCollection<Point, PointProperties>) =>
    resolve({ clusterData })
);

export const toggleDisplayTransmissionClusters = createAction(
  CONTROL_TOGGLE_DISPLAY_TRANSMISSION_CLUSTERS,
  resolve => (displayTransmissionClusters: boolean) =>
    resolve({ displayTransmissionClusters })
);

export const toggleDisplayCaseClusters = createAction(
  CONTROL_TOGGLE_DISPLAY_CASE_CLUSTERS,
  resolve => (displayCaseClusters: boolean) =>
    resolve({ displayCaseClusters })
);

export const setSelectedCluster = createAction(
  CONTROL_SET_SELECTED_CLUSTER,
  resolve => (selectedCluster: Feature<Polygon, TransmissionClusterProperties>) =>
    resolve({ selectedCluster })
);

export const setSelectedCase = createAction(
  CONTROL_SET_SELECTED_CASE,
  resolve => (selectedCase: Feature<Point, PointProperties>) =>
    resolve({ selectedCase })
);

export const setDateRange = createAction(
  CONTROL_SET_END_DATE_RANGE,
  resolve => (numberOfDays: number) =>
    resolve({ numberOfDays })
);

export const initialiseServiceWorker = createAction(
  CONFIG_INITIALISE_SERVICE_WORKER,
  resolve => () =>
    resolve()
);

export const updateServiceWorker = createAction(
  CONFIG_UPDATE_SERVICE_WORKER,
  resolve => (serviceWorkerRegistration: ServiceWorkerRegistration) =>
    resolve({ serviceWorkerRegistration })
);
