package com.gimbal.rtn;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

import java.util.Map;

@ReactModule(name = PlaceManagerModule.NAME)
abstract class PlaceManagerSpec extends ReactContextBaseJavaModule {

    PlaceManagerSpec(ReactApplicationContext context) {
        super(context);
    }

    public abstract void startMonitoring();
    public abstract void stopMonitoring();
    public abstract void isMonitoring(Promise promise);
    public abstract void getCurrentVisits(Promise promise);
    public abstract void addListener(String eventName);
    public abstract void removeListeners(double count);

    @Nullable
    public final Map<String, Object> getConstants() {
        return getTypedExportedConstants();
    }
    protected abstract Map<String, Object> getTypedExportedConstants();
}
