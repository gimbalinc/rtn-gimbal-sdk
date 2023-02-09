package com.gimbal.rtn;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

import java.util.Map;

@ReactModule(name = PrivacyManagerModule.NAME)
abstract class PrivacyManagerSpec extends ReactContextBaseJavaModule {
    PrivacyManagerSpec(ReactApplicationContext context) {
        super(context);
    }

    public abstract void getGdprConsentRequirement(Promise promise);

    public abstract void setUserConsent(double consentType, double state);

    public abstract void getUserConsent(double consentType, Promise promise);

    @Nullable
    public final Map<String, Object> getConstants() {
        return getTypedExportedConstants();
    }

    protected abstract Map<String, Object> getTypedExportedConstants();
}
