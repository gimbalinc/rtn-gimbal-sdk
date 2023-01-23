#include <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "GimbalSpec.h"

@interface RtnGimbal : NSObject <NativeGimbalSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbal : NSObject <RCTBridgeModule>
#endif

@end
