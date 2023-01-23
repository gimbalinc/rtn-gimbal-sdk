import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  start(): void;
  stop(): void;
  isStarted(): Promise<boolean>;
  getApplicationInstanceIdentifier(): Promise<string | null>;
  resetApplicationInstanceIdentifier(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RtnGimbal');
