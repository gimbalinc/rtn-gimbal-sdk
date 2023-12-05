package com.gimbal.rtn;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = AnalyticsManagerModule.NAME, hasConstants = false)
abstract class AnalyticsManagerSpec extends ReactContextBaseJavaModule {
    AnalyticsManagerSpec(ReactApplicationContext context) {
        super(context);
    }

    public abstract void setUserAnalyticsID(String id);
    public abstract void deleteUserAnalyticsID();
}
