import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
    getGdprConsentRequirement(): Promise<Int32>;
    setUserConsent(consentType: Int32, state: Int32): void;
    getUserConsent(consentType: Int32): Promise<Int32>;

    readonly getConstants: () => {
        CONSENT_STATE_UNKNOWN: Int32,
        CONSENT_STATE_GRANTED: Int32,
        CONSENT_STATE_REFUSED: Int32,
        CONSENT_TYPE_PLACES: Int32,
        GDPR_CONSENT_REQUIREMENT_UNKNOWN: Int32,
        GDPR_CONSENT_NOT_REQUIRED: Int32, 
        GDPR_CONSENT_REQUIRED: Int32
    };
}

export type ConsentStateSpec = {
    GRANTED: Int32,
    REFUSED: Int32,
    UNKNOWN: Int32
};

export type GDPRConsentRequirementSpec = {
    NOT_REQUIRED: Int32,
    REQUIRED: Int32,
    UNKNOWN: Int32
};

export type ConsentTypeSpec = {
    PLACES: Int32
};

export default TurboModuleRegistry.getEnforcing<Spec>('RtnGimbalPrivacyManager');