
#import <CoreLocation/CoreLocation.h>
#import "Gimbal/GMBLPlaceManager.h"
#import "Gimbal/GMBLVisit.h"
#import "Gimbal/GMBLPlace.h"
#import "Gimbal/GMBLAttributes.h"

#import "RtnPlaceManager.h"
#import "BeaconHelper.h"

@implementation RtnGimbalPlaceManager {
    GMBLPlaceManager *placeManager;
    bool hasListeners;
}
RCT_EXPORT_MODULE()

#pragma mark - String Constants
static NSString *BATTERY_LEVEL_LOW = @"BATTERY_LEVEL_LOW";
static NSString *BATTERY_LEVEL_MED_LOW = @"BATTERY_LEVEL_MEDIUM_LOW";
static NSString *BATTERY_LEVEL_MED_HIGH = @"BATTERY_LEVEL_MEDIUM_HIGH";
static NSString *BATTERY_LEVEL_HIGH = @"BATTERY_LEVEL_HIGH";

static NSString *EVENT_MAP_KEY_DELAY = @"delay";
static NSString *EVENT_MAP_KEY_PLACE = @"place";
static NSString *EVENT_MAP_KEY_VISIT_ID = @"visitId";
static NSString *EVENT_MAP_KEY_ARRIVAL_TIME = @"arrivalTimeInMillis";
static NSString *EVENT_MAP_KEY_DEPARTURE_TIME = @"departureTimeInMillis";
static NSString *EVENT_MAP_KEY_DWELL_TIME = @"dwellTimeInMillis";
static NSString *EVENT_MAP_KEY_BEACON_SIGHTING = @"beaconSighting";
static NSString *EVENT_MAP_KEY_VISITS = @"visits";
static NSString *EVENT_MAP_KEY_LATITUDE = @"latitude";
static NSString *EVENT_MAP_KEY_LONGITUDE = @"longitude";
static NSString *EVENT_MAP_KEY_ACCURACY = @"accuracy";
static NSString *EVENT_MAP_KEY_ATTRIBUTES = @"attributes";

static NSString *EVENT_NAME_VISIT_START = @"GIMBAL_EVENT_VISIT_START";
static NSString *EVENT_NAME_VISIT_START_WITH_DELAY = @"GIMBAL_EVENT_VISIT_START_WITH_DELAY";
static NSString *EVENT_NAME_VISIT_END = @"GIMBAL_EVENT_VISIT_END";
static NSString *EVENT_NAME_BEACON_SIGHTING = @"GIMBAL_EVENT_PLACE_BEACON_SIGHTING";
static NSString *EVENT_NAME_LOCATION_DETECTED = @"GIMBAL_EVENT_LOCATION_DETECTED";

#ifdef RCT_NEW_ARCH_ENABLED
- (facebook::react::ModuleConstants<JS::NativePlaceManager::Constants>)getConstants {
    __block facebook::react::ModuleConstants<JS::NativePlaceManager::Constants> constants;
    constants = facebook::react::typedConstants<JS::NativePlaceManager::Constants>({
        .BATTERY_LEVEL_LOW = @"LOW",
        .BATTERY_LEVEL_MEDIUM_LOW = @"MEDIUM_LOW",
        .BATTERY_LEVEL_MEDIUM_HIGH = @"MEDIUM_HIGH",
        .BATTERY_LEVEL_HIGH = @"HIGH",
        .EVENT_VISIT_START = EVENT_NAME_VISIT_START,
        .EVENT_VISIT_START_WITH_DELAY = EVENT_NAME_VISIT_START_WITH_DELAY,
        .EVENT_VISIT_END = EVENT_NAME_VISIT_END,
        .EVENT_PLACE_BEACON_SIGHTING = EVENT_NAME_BEACON_SIGHTING,
        .EVENT_LOCATION_DETECTED = EVENT_NAME_LOCATION_DETECTED,
    });
    return constants;
}

-(facebook::react::ModuleConstants<JS::NativePlaceManager::Constants>)constantsToExport {
    return (facebook::react::ModuleConstants<JS::NativePlaceManager::Constants>)[self getConstants];
}

#else

-(NSDictionary *)constantsToExport
{
    NSDictionary *constants = @{
        BATTERY_LEVEL_LOW : @"LOW",
        BATTERY_LEVEL_MED_LOW : @"MEDIUM_LOW",
        BATTERY_LEVEL_MED_HIGH : @"MEDIUM_HIGH",
        BATTERY_LEVEL_HIGH : @"HIGH",
        @"EVENT_VISIT_START" : EVENT_NAME_VISIT_START,
        @"EVENT_VISIT_START_WITH_DELAY" : EVENT_NAME_VISIT_START_WITH_DELAY,
        @"EVENT_VISIT_END" : EVENT_NAME_VISIT_END,
        @"EVENT_PLACE_BEACON_SIGHTING" : EVENT_NAME_BEACON_SIGHTING,
        @"EVENT_LOCATION_DETECTED" : EVENT_NAME_LOCATION_DETECTED
    };

    return constants;
}
#endif

#pragma mark - Init
-(instancetype) init
{
    self = [super init];
    if (self) {
        placeManager = [GMBLPlaceManager new];
        placeManager.delegate = self;
    }
    return self;
}

RCT_EXPORT_METHOD(startMonitoring) {
    [GMBLPlaceManager startMonitoring];
}

RCT_EXPORT_METHOD(stopMonitoring) {
    [GMBLPlaceManager stopMonitoring];
}

RCT_EXPORT_METHOD(getCurrentVisits:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject) {
    NSMutableArray *mappedVisits = [NSMutableArray new];
    GMBLVisit *visit;
    for (visit in [placeManager currentVisits]) {
        NSMutableDictionary *mappedVisit = [self toMapFromVisit:visit];
        [mappedVisits addObject:mappedVisit];
    }
    resolve(mappedVisits);
}

RCT_EXPORT_METHOD(isMonitoring:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject) {
    BOOL isMonitoring = [GMBLPlaceManager isMonitoring];
    resolve(@(isMonitoring));
}

//
//- (void)addListener:(NSString *)eventName {
//    [super addListener:eventName];
//}
//
//- (void)removeListeners:(double)count {
//    [super removeListeners:count];
//    // no additional action, I think
//}

#pragma mark - PlaceManagerDelegate Methods
- (void)placeManager:(GMBLPlaceManager *)manager didBeginVisit:(GMBLVisit *)visit {
    NSDictionary *eventBody = [self toMapFromVisit:visit];
    [self sendEventWithName:EVENT_NAME_VISIT_START body:eventBody];
}

- (void)placeManager:(GMBLPlaceManager *)manager didBeginVisit:(GMBLVisit *)visit withDelay:(NSTimeInterval)delayTime {
    NSMutableDictionary *eventBody = [self toMapFromVisit:visit];
    [self safelyAddObject:[NSNumber numberWithDouble:delayTime] andKey:EVENT_MAP_KEY_DELAY toMap:&eventBody];
    [self sendEventWithName:EVENT_NAME_VISIT_START_WITH_DELAY body: eventBody];
}

- (void)placeManager:(GMBLPlaceManager *)manager didReceiveBeaconSighting:(GMBLBeaconSighting *)sighting forVisits:(NSArray *)visits {
    NSDictionary *eventBody = [self toMap:sighting withVisits:visits];
    [self sendEventWithName:EVENT_NAME_BEACON_SIGHTING body:eventBody];
}

- (void)placeManager:(GMBLPlaceManager *)manager didEndVisit:(GMBLVisit *)visit {
    NSDictionary *eventBody = [self toMapFromVisit:visit];
    [self sendEventWithName:EVENT_NAME_VISIT_END body:eventBody];
}

- (void)placeManager:(GMBLPlaceManager *)manager didDetectLocation:(CLLocation *)location {
    NSDictionary *eventBody = [self toMapFromLocation:location];
    [self sendEventWithName:EVENT_NAME_LOCATION_DETECTED body:eventBody];
}

#pragma mark - Utility Methods
-(NSMutableDictionary *)toMapFromVisit:(GMBLVisit *)visit
{
    NSMutableDictionary *map = [NSMutableDictionary new];
    [self safelyAddObject:[self toMapFromPlace:visit.place] andKey:EVENT_MAP_KEY_PLACE toMap:&map];
    [self safelyAddObject:visit.visitID andKey:EVENT_MAP_KEY_VISIT_ID toMap:&map];
    [self safelyAddObject:@([visit.arrivalDate timeIntervalSince1970]*1000) andKey:EVENT_MAP_KEY_ARRIVAL_TIME toMap:&map];
    [self safelyAddObject:@([visit.departureDate timeIntervalSince1970]*1000) andKey:EVENT_MAP_KEY_DEPARTURE_TIME toMap:&map];
    [self safelyAddObject:@(visit.dwellTime) andKey:EVENT_MAP_KEY_DWELL_TIME toMap:&map];

    return map;
}

-(NSDictionary *)toMapFromPlace:(GMBLPlace *)place
{
    NSMutableDictionary *placeAttributesMap = [self toMapFromAttributes:place.attributes];

    NSDictionary *map = @{
        BeaconHelper.EVENT_MAP_KEY_NAME : place.name,
        BeaconHelper.EVENT_MAP_KEY_IDENTIFIER : place.identifier,
        EVENT_MAP_KEY_ATTRIBUTES : placeAttributesMap,
    };

    return map;
}

-(NSMutableDictionary *)toMapFromAttributes:(GMBLAttributes *)attributes
{
    NSMutableDictionary *map = [NSMutableDictionary new];
    NSArray *attributeKeys = attributes.allKeys;
    for (id key in attributeKeys) {
        [map setObject:[attributes stringForKey:key] forKey:key];
    }
    return map;
}

-(NSDictionary *)toMap:(GMBLBeaconSighting *)beaconSighting withVisits:(NSArray*)visits
{
    NSMutableArray *visitList = [NSMutableArray new];
    for (id visit in visits) {
        [visitList addObject:[self toMapFromVisit:visit]];
    }

    NSDictionary *sightingMap = [BeaconHelper toMapFromSighting:beaconSighting];
    NSDictionary *map = @{
        EVENT_MAP_KEY_BEACON_SIGHTING : sightingMap,
        EVENT_MAP_KEY_VISITS : visitList
    };

    return map;
}

-(NSDictionary *)toMapFromLocation:(CLLocation *)location {
    NSDictionary *map = @{
        EVENT_MAP_KEY_LATITUDE : @(location.coordinate.latitude),
        EVENT_MAP_KEY_LONGITUDE : @(location.coordinate.longitude),
        EVENT_MAP_KEY_ACCURACY : @(location.horizontalAccuracy)
    };

    return map;
}

-(void)safelyAddObject:(id)object andKey:(NSString*)key toMap:(NSMutableDictionary**)map {
    if (object == nil) {
        [*map setObject:[NSNull null] forKey:key];
    } else {
        [*map setObject:object forKey:key];
    }
}

#pragma mark - RN Overrides

- (NSArray<NSString *> *)supportedEvents {
    return @[
        EVENT_NAME_VISIT_START,
        EVENT_NAME_VISIT_START_WITH_DELAY,
        EVENT_NAME_VISIT_END,
        EVENT_NAME_BEACON_SIGHTING,
        EVENT_NAME_LOCATION_DETECTED
    ];
}

+ (BOOL)requiresMainQueueSetup { // necessary for constantsToExport
  return YES;
}

- (void)startObserving {
    // TODO: send queued place events
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativePlaceManagerSpecJSI>(params);
}
#endif

@end

