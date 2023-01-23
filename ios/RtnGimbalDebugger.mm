#import "RtnGimbalDebugger.h"
#import "Gimbal/GMBLDebugger.h"

@implementation RtnGimbalDebugger
RCT_EXPORT_MODULE()

#pragma mark - Beacon Sightings Logging

RCT_EXPORT_METHOD(enableBeaconSightingsLogging) {
    [GMBLDebugger enableBeaconSightingsLogging];
}

RCT_EXPORT_METHOD(disableBeaconSightingsLogging) {
    [GMBLDebugger disableBeaconSightingsLogging];
}

RCT_EXPORT_METHOD(isBeaconSightingsLoggingEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL isBeaconSightingsLoggingEnabled = [GMBLDebugger isBeaconSightingsEnabled];
    resolve(@(isBeaconSightingsLoggingEnabled));
}

#pragma mark - Debug Logging

RCT_EXPORT_METHOD(enableDebugLogging) {
    [GMBLDebugger enableDebugLogging];
}

RCT_EXPORT_METHOD(disableDebugLogging) {
    [GMBLDebugger disableDebugLogging];
}

RCT_EXPORT_METHOD(isDebugLoggingEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL isDebugLoggingEnabled = [GMBLDebugger isDebugEnabled];
    resolve(@(isDebugLoggingEnabled));
}

#pragma mark - Place Logging

RCT_EXPORT_METHOD(enablePlaceLogging) {
    [GMBLDebugger enablePlaceLogging];
}

RCT_EXPORT_METHOD(disablePlaceLogging) {
    [GMBLDebugger disablePlaceLogging];
}

RCT_EXPORT_METHOD(isPlaceLoggingEnabled:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL isPlaceLoggingEnabled = [GMBLDebugger isPlaceLoggingEnabled];
    resolve(@(isPlaceLoggingEnabled));
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeGimbalDebuggerSpecJSI>(params);
}
#endif

@end
