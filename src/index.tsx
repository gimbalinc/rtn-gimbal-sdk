import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rtn-gimbal-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

/* ============================================================================================= */

import type { Spec as GimbalSpec } from './NativeGimbal';

const GimbalModule = isTurboModuleEnabled
  ? require('./NativeGimbal').default
  : NativeModules.RtnGimbal;

export const Gimbal: GimbalSpec = GimbalModule
  ? GimbalModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/* ============================================================================================= */

import type {
  Spec as PlaceManagerSpec,
  Place,
  Visit,
  BatteryLevelSpec,
  PlaceManagerEventSpec,
} from './NativePlaceManager';
export type { Place, Visit };

const PlaceManagerModule = isTurboModuleEnabled
  ? require('./NativePlaceManager').default
  : NativeModules.RtnGimbalPlaceManager;

export const PlaceManager: PlaceManagerSpec = PlaceManagerModule
  ? PlaceManagerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const {
  BATTERY_LEVEL_LOW,
  BATTERY_LEVEL_MEDIUM_LOW,
  BATTERY_LEVEL_MEDIUM_HIGH,
  BATTERY_LEVEL_HIGH,
  EVENT_VISIT_START,
  EVENT_VISIT_START_WITH_DELAY,
  EVENT_VISIT_END,
  EVENT_PLACE_BEACON_SIGHTING,
  EVENT_LOCATION_DETECTED,
} = PlaceManager.getConstants!();

export const BatteryLevel: BatteryLevelSpec = {
  LOW: BATTERY_LEVEL_LOW,
  MEDIUM_LOW: BATTERY_LEVEL_MEDIUM_LOW,
  MEDIUM_HIGH: BATTERY_LEVEL_MEDIUM_HIGH,
  HIGH: BATTERY_LEVEL_HIGH,
};

export const PlaceManagerEvent: PlaceManagerEventSpec = {
  VISIT_START: EVENT_VISIT_START,
  VISIT_START_WITH_DELAY: EVENT_VISIT_START_WITH_DELAY,
  VISIT_END: EVENT_VISIT_END,
  BEACON_SIGHTING: EVENT_PLACE_BEACON_SIGHTING,
  LOCATION_DETECTED: EVENT_LOCATION_DETECTED,
};

/* ============================================================================================= */

import type { Spec as GimbalDebuggerSpec } from './NativeGimbalDebugger';

const GimbalDebuggerModule = isTurboModuleEnabled
  ? require('./NativeGimbalDebugger').default
  : NativeModules.RtnGimbalDebugger;

export const GimbalDebugger: GimbalDebuggerSpec = GimbalDebuggerModule
  ? GimbalDebuggerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/* ============================================================================================= */

import type { Spec as AnalyticsManagerSpec } from './NativeAnalyticsManager';

const AnalyticsManagerModule = isTurboModuleEnabled
  ? require('./NativeAnalyticsManager').default
  : NativeModules.RtnGimbalAnalyticsManager;

export const AnalyticsManager: AnalyticsManagerSpec = AnalyticsManagerModule
  ? AnalyticsManagerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
/* ============================================================================================= */

import type { Spec as PrivacyManagerSpec } from './NativePrivacyManager';

const PrivacyManagerModule = isTurboModuleEnabled
  ? require('./NativePrivacyManager').default
  : NativeModules.RtnGimbalPrivacyManager;

export const PrivacyManager: PrivacyManagerSpec = PrivacyManagerModule
  ? PrivacyManagerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
