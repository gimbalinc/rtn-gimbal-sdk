package com.gimbal.rtn;

import static com.gimbal.rtn.BridgeUtilities.fromJSValue;
import static com.gimbal.rtn.BridgeUtilities.toJSValue;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.gimbal.android.PrivacyManager;

import java.util.HashMap;
import java.util.Map;

public class PrivacyManagerModule extends PrivacyManagerSpec {
    public static final String NAME = "RtnGimbalPrivacyManager";

    private static final String GDPR_CONSENT_NOT_REQUIRED = "GDPR_CONSENT_NOT_REQUIRED";
    private static final String GDPR_CONSENT_REQUIRED = "GDPR_CONSENT_REQUIRED";
    private static final String GDPR_CONSENT_REQUIREMENT_UNKNOWN = "GDPR_CONSENT_REQUIREMENT_UNKNOWN";
    private static final String CONSENT_TYPE_PLACES = "CONSENT_TYPE_PLACES";
    private static final String CONSENT_STATE_UNKNOWN = "CONSENT_STATE_UNKNOWN";
    private static final String CONSENT_STATE_GRANTED = "CONSENT_STATE_GRANTED";
    private static final String CONSENT_STATE_REFUSED = "CONSENT_STATE_REFUSED";

    private static final String E_INVALID_CONSENT_VALUE = "E_INVALID_CONSENT_VALUE";

    PrivacyManagerModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    @ReactMethod
    public void getGdprConsentRequirement(Promise promise) {
        PrivacyManager.GdprConsentRequirement requirement = PrivacyManager.getInstance().getGdprConsentRequirement();
        promise.resolve(toJSValue(requirement));
    }

    @Override
    @ReactMethod
    public void setUserConsent(int consentType, int state) {
        PrivacyManager.ConsentType convertedConsentType = fromJSValue(PrivacyManager.ConsentType.class, consentType);
        PrivacyManager.ConsentState convertedConsentState = fromJSValue(PrivacyManager.ConsentState.class, state);

        PrivacyManager.getInstance().setUserConsent(convertedConsentType, convertedConsentState);
    }

    @Override
    @ReactMethod
    public void getUserConsent(int consentType, Promise promise) {
        PrivacyManager.ConsentType convertedConsentType = fromJSValue(PrivacyManager.ConsentType.class, consentType);
        if (convertedConsentType == null) {
            promise.reject(E_INVALID_CONSENT_VALUE, "Invalid consent type: " + consentType);
            return;
        }

        promise.resolve(toJSValue(PrivacyManager.getInstance().getUserConsent(convertedConsentType)));
    }

    @Override
    protected Map<String, Object> getTypedExportedConstants() {
        Map<String, Object> constants = new HashMap<>();

        constants.put(GDPR_CONSENT_NOT_REQUIRED, toJSValue(PrivacyManager.GdprConsentRequirement.NOT_REQUIRED));
        constants.put(GDPR_CONSENT_REQUIRED, toJSValue(PrivacyManager.GdprConsentRequirement.REQUIRED));
        constants.put(GDPR_CONSENT_REQUIREMENT_UNKNOWN, toJSValue(PrivacyManager.GdprConsentRequirement.REQUIREMENT_UNKNOWN));
        constants.put(CONSENT_TYPE_PLACES, toJSValue(PrivacyManager.ConsentType.PLACES_CONSENT));
        constants.put(CONSENT_STATE_UNKNOWN, toJSValue(PrivacyManager.ConsentState.CONSENT_UNKNOWN));
        constants.put(CONSENT_STATE_GRANTED, toJSValue(PrivacyManager.ConsentState.CONSENT_GRANTED));
        constants.put(CONSENT_STATE_REFUSED, toJSValue(PrivacyManager.ConsentState.CONSENT_REFUSED));

        return constants;
    }
}
