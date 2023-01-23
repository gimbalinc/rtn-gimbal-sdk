//
//  BeaconHelper.m
//  RNGimbal
//
//  Created by Andrew Tran on 3/31/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "BeaconHelper.h"

@implementation BeaconHelper

+ (NSString *) EVENT_MAP_KEY_BATTERY_LEVEL {
    return @"batteryLevel";
};
+ (NSString *) EVENT_MAP_KEY_BEACON {
    return @"beacon";
}
+ (NSString *) EVENT_MAP_KEY_ICON_URL {
    return @"iconURL";
}
+ (NSString *) EVENT_MAP_KEY_IDENTIFIER {
    return @"identifier";
}
+ (NSString *) EVENT_MAP_KEY_NAME {
    return @"name";
}
+ (NSString *) EVENT_MAP_KEY_RSSI {
    return @"rssi";
}
+ (NSString *) EVENT_MAP_KEY_TEMPERATURE {
    return @"temperature";
}
+ (NSString *) EVENT_MAP_KEY_TIME {
    return @"timeInMillis";
}
+ (NSString *) EVENT_MAP_KEY_UUID {
    return @"uuid";
}

+(NSMutableDictionary *)toMapFromBeacon:(GMBLBeacon *)beacon
{
    NSMutableDictionary *map = [NSMutableDictionary new];
    [self safelyAddObject:beacon.identifier andKey:[self EVENT_MAP_KEY_IDENTIFIER] toMap:&map];
    [self safelyAddObject:beacon.uuid andKey:[self EVENT_MAP_KEY_UUID] toMap:&map];
    [self safelyAddObject:beacon.name andKey:[self EVENT_MAP_KEY_NAME] toMap:&map];
    [self safelyAddObject:beacon.iconURL andKey:[self EVENT_MAP_KEY_ICON_URL] toMap:&map];
    [self safelyAddObject:@(beacon.batteryLevel) andKey:[self EVENT_MAP_KEY_BATTERY_LEVEL] toMap:&map];
    [self safelyAddObject:@(beacon.temperature) andKey:[self EVENT_MAP_KEY_TEMPERATURE] toMap:&map];
    
    return map;
}

+(NSDictionary *)toMapFromSighting:(GMBLBeaconSighting *)beaconSighting
{
    NSDictionary *map = @{
        [self EVENT_MAP_KEY_RSSI] : @(beaconSighting.RSSI),
        [self EVENT_MAP_KEY_TIME] : @([beaconSighting.date timeIntervalSince1970]*1000),
        [self EVENT_MAP_KEY_BEACON] : [self toMapFromBeacon:beaconSighting.beacon],
    };
    
    return map;
}

+(void)safelyAddObject:(id)object andKey:(NSString*)key toMap:(NSMutableDictionary**)map
{
    if (object == nil) {
        [*map setObject: [NSNull null] forKey:key];
    } else {
        [*map setObject: object forKey:key];
    }
}

@end
