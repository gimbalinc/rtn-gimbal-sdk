package com.gimbal.rtn;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

@SuppressWarnings("unused")
@ReactModule(name = GimbalModule.NAME, hasConstants = false)
abstract class GimbalSpec extends ReactContextBaseJavaModule {

    GimbalSpec(ReactApplicationContext context) {
        super(context);
    }

    public abstract void start();
    public abstract void stop();
    public abstract void isStarted(Promise promise);
    public abstract void getApplicationInstanceIdentifier(Promise promise);
    public abstract void resetApplicationInstanceIdentifier();
}
