#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "GimbalSpec.h"

@interface RtnGimbalPrivacyManager : NSObject <NativePrivacyManagerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbalPrivacyManager : NSObject <RCTBridgeModule>

#endif

@end
