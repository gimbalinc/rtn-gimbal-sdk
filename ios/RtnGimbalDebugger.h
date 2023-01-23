#include <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "GimbalSpec.h"

@interface RtnGimbalDebugger : NSObject <NativeGimbalDebuggerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbalDebugger : NSObject <RCTBridgeModule>
#endif

@end
