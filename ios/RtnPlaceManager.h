#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "GimbalSpec.h"

@interface RtnGimbalPlaceManager : RCTEventEmitter <NativePlaceManagerSpec, GMBLPlaceManagerDelegate>
#else
#import <React/RCTBridgeModule.h>

@interface RtnGimbalPlaceManager : RCTEventEmitter <RCTBridgeModule, GMBLPlaceManagerDelegate>
#endif

@end
