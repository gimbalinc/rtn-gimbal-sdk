import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  disableBeaconSightingsLogging(): void;
  disablePlaceLogging(): void;
  disableDebugLogging(): void;
  enableBeaconSightingsLogging(): void;
  enablePlaceLogging(): void;
  enableDebugLogging(): void;

  isBeaconSightingsLoggingEnabled(): Promise<boolean>;
  isPlaceLoggingEnabled(): Promise<boolean>;
  isDebugLoggingEnabled(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RtnGimbalDebugger');
