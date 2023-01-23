#import "RtnGimbal.h"
#import "Gimbal/Gimbal.h"

@implementation RtnGimbal
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(start) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [Gimbal start];
    });
}

RCT_EXPORT_METHOD(stop) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [Gimbal stop];
    });
}

RCT_EXPORT_METHOD(isStarted:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
//    dispatch_async(dispatch_get_main_queue(), ^{
        resolve([NSNumber numberWithBool:[Gimbal isStarted]]);
//    });
}

RCT_EXPORT_METHOD(getApplicationInstanceIdentifier:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
//    dispatch_async(dispatch_get_main_queue(), ^{
        resolve(@[[NSString stringWithFormat: @"%@", [Gimbal applicationInstanceIdentifier]]]);
//    });
}

RCT_EXPORT_METHOD(resetApplicationInstanceIdentifier) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [Gimbal resetApplicationInstanceIdentifier];
    });
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeGimbalSpecJSI>(params);
}
#endif

@end
