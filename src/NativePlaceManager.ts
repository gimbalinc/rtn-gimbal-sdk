import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export type Visit = {
  arrivalTimeInMillis: number;
  departureTimeInMillis: number;
  dwellTimeInMillis: number;
  visitId: string;
  place: Place;
  delay: number | null;
};

export type Place = {
  identifier: string;
  name: string;
  attributes: Map<string, string>;
};

export interface Spec extends TurboModule {
  startMonitoring(): void;
  stopMonitoring(): void;
  isMonitoring(): Promise<boolean>;
  getCurrentVisits(): Promise<Array<Visit>>;

  readonly getConstants: () => {
    BATTERY_LEVEL_LOW: string;
    BATTERY_LEVEL_MEDIUM_LOW: string;
    BATTERY_LEVEL_MEDIUM_HIGH: string;
    BATTERY_LEVEL_HIGH: string;
    EVENT_VISIT_START: string;
    EVENT_VISIT_START_WITH_DELAY: string;
    EVENT_VISIT_END: string;
    EVENT_PLACE_BEACON_SIGHTING: string;
    EVENT_LOCATION_DETECTED: string;
  };
  addListener(eventName: string): void;
  removeListeners(count: Int32): void;
}

export type BatteryLevelSpec = {
  readonly LOW: string;
  readonly MEDIUM_LOW: string;
  readonly MEDIUM_HIGH: string;
  readonly HIGH: string;
};

export type PlaceManagerEventSpec = {
  readonly VISIT_START: string;
  readonly VISIT_START_WITH_DELAY: string;
  readonly VISIT_END: string;
  readonly BEACON_SIGHTING: string;
  readonly LOCATION_DETECTED: string;
};

export default TurboModuleRegistry.getEnforcing<Spec>('RtnGimbalPlaceManager');
