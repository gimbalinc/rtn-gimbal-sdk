package com.gimbal.rtn;

import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

class BridgeUtilities {

    static <E extends Enum<E>> E fromJSValue(@Nonnull Class<E> type, int ordinal) {
        try {
            //noinspection ConstantConditions
            return type.getEnumConstants()[ordinal];
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    static Object toJSValue(@Nonnull Object javaValue) {
        if (javaValue instanceof Enum) {
            //noinspection rawtypes
            return ((Enum)javaValue).ordinal();
        }
        return javaValue;
    }

    static void sendEvent(@Nonnull ReactContext reactContext,
                          @Nonnull String eventName,
                          @Nullable WritableMap data) {
        Runnable emitterRunnable = createEmitterRunnable(reactContext, eventName, data, 10);
        emitterRunnable.run();
    }

    private static Runnable createEmitterRunnable(@Nonnull ReactContext reactContext,
                                                  @Nonnull String eventName,
                                                  @Nullable WritableMap data,
                                                  int retries) {
        return () -> {
            if (reactContext.hasActiveReactInstance()) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, data);
            } else if (retries > 0) {
                Runnable retry = createEmitterRunnable(reactContext, eventName, data, retries - 1);
                new Handler(Looper.getMainLooper()).postDelayed(retry, 1000);
            }
        };
    }
}
