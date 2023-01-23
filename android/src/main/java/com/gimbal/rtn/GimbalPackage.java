package com.gimbal.rtn;

import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("unused")
public class GimbalPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        switch (name) {
            case GimbalModule.NAME:
                return new GimbalModule(reactContext);
            case PlaceManagerModule.NAME:
                return new PlaceManagerModule(reactContext);
            case GimbalDebuggerModule.NAME:
                return new GimbalDebuggerModule(reactContext);
            default:
                return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
            moduleInfos.put(GimbalModule.NAME,
                new ReactModuleInfo(GimbalModule.NAME, GimbalModule.class.getName(),
                    false,// canOverrideExistingModule
                    false, // needsEagerInit
                    false, // hasConstants
                    false, // isCxxModule
                    isTurboModule // isTurboModule
                ));
            moduleInfos.put(GimbalDebuggerModule.NAME,
                new ReactModuleInfo(GimbalDebuggerModule.NAME, GimbalDebuggerModule.class.getName(),
                    false,// canOverrideExistingModule
                    false, // needsEagerInit
                    false, // hasConstants
                    false, // isCxxModule
                    isTurboModule // isTurboModule
                ));
            moduleInfos.put(PlaceManagerModule.NAME,
                new ReactModuleInfo(PlaceManagerModule.NAME, PlaceManagerModule.class.getName(),
                    false,// canOverrideExistingModule
                    true, // needsEagerInit
                    true, // hasConstants
                    false, // isCxxModule
                    isTurboModule // isTurboModule
                ));
            return moduleInfos;
        };
    }
}
