import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setUserAnalyticsID(id: string): void;
  deleteUserAnalyticsID(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RtnGimbalAnalyticsManager');
