package com.gimbal.rtn;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.gimbal.android.Gimbal;

public class GimbalModule extends GimbalSpec {
    public static final String NAME = "RtnGimbal";

    GimbalModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    @ReactMethod
    public void start() {
        Gimbal.start();
    }

    @Override
    @ReactMethod
    public void stop() {
        Gimbal.stop();
    }

    @Override
    @ReactMethod
    public void isStarted(Promise promise) {
        promise.resolve(Gimbal.isStarted());
    }

    @Override
    @ReactMethod
    public void getApplicationInstanceIdentifier(Promise promise) {
        promise.resolve(Gimbal.getApplicationInstanceIdentifier());
    }

    @Override
    @ReactMethod
    public void resetApplicationInstanceIdentifier() {
        Gimbal.resetApplicationInstanceIdentifier();
    }
}
