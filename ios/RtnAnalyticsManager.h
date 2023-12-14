#include <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "GimbalSpec.h"

@interface RtnGimbalAnalyticsManager : NSObject <NativeAnalyticsManagerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbalAnalyticsManager : NSObject <RCTBridgeModule>
#endif

@end
