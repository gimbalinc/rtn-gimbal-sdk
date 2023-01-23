package com.gimbal.rtn;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.gimbal.android.GimbalDebugger;

public class GimbalDebuggerModule extends GimbalDebuggerSpec {
    public static final String NAME = "RtnGimbalDebugger";

    GimbalDebuggerModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    @ReactMethod
    public void disableBeaconSightingsLogging() {
        GimbalDebugger.disableBeaconSightingsLogging();
    }

    @Override
    @ReactMethod
    public void disablePlaceLogging() {
        GimbalDebugger.disablePlaceLogging();
    }

    @Override
    @ReactMethod
    public void disableDebugLogging() {
        GimbalDebugger.disableStatusLogging();
    }

    @Override
    @ReactMethod
    public void enableBeaconSightingsLogging() {
        GimbalDebugger.enableBeaconSightingsLogging();
    }

    @Override
    @ReactMethod
    public void enablePlaceLogging() {
        GimbalDebugger.enablePlaceLogging();
    }

    @Override
    @ReactMethod
    public void enableDebugLogging() {
        GimbalDebugger.enableStatusLogging();
    }

    @Override
    @ReactMethod
    public void isBeaconSightingsLoggingEnabled(Promise promise) {
        promise.resolve(GimbalDebugger.isBeaconSightingsLoggingEnabled());
    }

    @Override
    @ReactMethod
    public void isPlaceLoggingEnabled(Promise promise) {
        promise.resolve(GimbalDebugger.isPlaceLoggingEnabled());
    }

    @Override
    @ReactMethod
    public void isDebugLoggingEnabled(Promise promise) {
        promise.resolve(GimbalDebugger.isStatusLoggingEnabled());
    }
}
