package com.gimbal.rtn;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = GimbalDebuggerModule.NAME, hasConstants = false)
abstract class GimbalDebuggerSpec extends ReactContextBaseJavaModule {

    GimbalDebuggerSpec(ReactApplicationContext context) {
        super(context);
    }

    public abstract void disableBeaconSightingsLogging();
    public abstract void disablePlaceLogging();
    public abstract void disableDebugLogging();
    public abstract void enableBeaconSightingsLogging();
    public abstract void enablePlaceLogging();
    public abstract void enableDebugLogging();
    public abstract void isBeaconSightingsLoggingEnabled(Promise promise);
    public abstract void isPlaceLoggingEnabled(Promise promise);
    public abstract void isDebugLoggingEnabled(Promise promise);
}
