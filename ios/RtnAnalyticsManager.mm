#import "RtnAnalyticsManager.h"
#import "Gimbal/GMBLAnalyticsManager.h"

@implementation RtnGimbalAnalyticsManager
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setUserAnalyticsID:(NSString *)analyticsId) {
    [[GMBLAnalyticsManager sharedInstance] setUserAnalyticsID:analyticsId];
}

RCT_EXPORT_METHOD(deleteUserAnalyticsID) {
    [[GMBLAnalyticsManager sharedInstance] deleteUserAnalyticsID];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAnalyticsManagerSpecJSI>(params);
}
#endif

@end
