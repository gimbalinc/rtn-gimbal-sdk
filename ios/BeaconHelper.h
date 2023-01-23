//
//  BeaconHelper.h
//  RNGimbal
//
//  Created by Andrew Tran on 3/31/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Gimbal/GMBLBeacon.h>
#import <Gimbal/GMBLBeaconSighting.h>

@interface BeaconHelper : NSObject

@property (class, readonly) NSString *EVENT_MAP_KEY_BATTERY_LEVEL;
@property (class, readonly) NSString *EVENT_MAP_KEY_BEACON;
@property (class, readonly) NSString *EVENT_MAP_KEY_ICON_URL;
@property (class, readonly) NSString *EVENT_MAP_KEY_IDENTIFIER;
@property (class, readonly) NSString *EVENT_MAP_KEY_NAME;
@property (class, readonly) NSString *EVENT_MAP_KEY_RSSI;
@property (class, readonly) NSString *EVENT_MAP_KEY_TEMPERATURE;
@property (class, readonly) NSString *EVENT_MAP_KEY_TIME;
@property (class, readonly) NSString *EVENT_MAP_KEY_UUID;

+(NSMutableDictionary *)toMapFromBeacon:(GMBLBeacon *)beacon;

+(NSDictionary *)toMapFromSighting:(GMBLBeaconSighting *)beaconSighting;

+(void)safelyAddObject:(id)object andKey:(NSString*)key toMap:(NSMutableDictionary**)map;
@end
