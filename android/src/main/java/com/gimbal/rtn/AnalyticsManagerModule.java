package com.gimbal.rtn;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.gimbal.android.AnalyticsManager;

public class AnalyticsManagerModule extends AnalyticsManagerSpec {
    public static final String NAME = "RtnGimbalAnalyticsManager";

    AnalyticsManagerModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    @ReactMethod
    public void setUserAnalyticsID(String id) {
        AnalyticsManager.getInstance().setUserAnalyticsID(id);
    }

    @Override
    @ReactMethod
    public void deleteUserAnalyticsID() {
        AnalyticsManager.getInstance().deleteUserAnalyticsID();
    }
}
