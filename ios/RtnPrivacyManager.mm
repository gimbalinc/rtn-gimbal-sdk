#import "RtnPrivacyManager.h"
#import "Gimbal/GMBLPrivacyManager.h"
#import <React/RCTConvert.h>

@implementation RtnGimbalPrivacyManager

RCT_EXPORT_MODULE()

#pragma mark - Constants
static NSString *GDPR_CONSENT_NOT_REQUIRED = @"GDPR_CONSENT_NOT_REQUIRED";
static NSString *GDPR_CONSENT_REQUIRED = @"GDPR_CONSENT_REQUIRED";
static NSString *GDPR_CONSENT_REQUIREMENT_UNKNOWN = @"GDPR_CONSENT_REQUIREMENT_UNKNOWN";
static NSString *CONSENT_TYPE_PLACES = @"CONSENT_TYPE_PLACES";
static NSString *CONSENT_STATE_UNKNOWN = @"CONSENT_STATE_UNKNOWN";
static NSString *CONSENT_STATE_GRANTED = @"CONSENT_STATE_GRANTED";
static NSString *CONSENT_STATE_REFUSED = @"CONSENT_STATE_REFUSED";

static NSInteger E_VALUE_UNKNOWN_STATE = -1;
static NSInteger E_VALUE_UNKNOWN_TYPE = -1;

#ifdef RCT_NEW_ARCH_ENABLED
- (facebook::react::ModuleConstants<JS::NativePrivacyManager::Constants>)getConstants
{
    __block facebook::react::ModuleConstants<JS::NativePrivacyManager::Constants> constants;
    constants = facebook::react::typedConstants<JS::NativePrivacyManager::Constants>({
       .GDPR_CONSENT_NOT_REQUIRED = GMBLGDPRConsentNotRequired,
       .GDPR_CONSENT_REQUIRED = GMBLGDPRConsentRequired,
       .GDPR_CONSENT_REQUIREMENT_UNKNOWN = GMBLGDPRConsentRequirementUnknown,
       .CONSENT_TYPE_PLACES = GMBLPlacesConsent,
       .CONSENT_STATE_UNKNOWN = GMBLConsentUnknown,
       .CONSENT_STATE_GRANTED = GMBLConsentGranted,
       .CONSENT_STATE_REFUSED = GMBLConsentRefused,
    });
    return constants;
}

-(facebook::react::ModuleConstants<JS::NativePrivacyManager::Constants>)constantsToExport
{
    return (facebook::react::ModuleConstants<JS::NativePrivacyManager::Constants>)[self getConstants];
}

#else

-(NSDictionary *)constantsToExport
{
    NSDictionary *constants = @{
        GDPR_CONSENT_NOT_REQUIRED : [NSNumber numberWithInteger: GMBLGDPRConsentNotRequired],
        GDPR_CONSENT_REQUIRED : [NSNumber numberWithInteger: GMBLGDPRConsentRequired],
        GDPR_CONSENT_REQUIREMENT_UNKNOWN : [NSNumber numberWithInteger: GMBLGDPRConsentRequirementUnknown],
        CONSENT_TYPE_PLACES : [NSNumber numberWithInteger: GMBLPlacesConsent],
        CONSENT_STATE_UNKNOWN : [NSNumber numberWithInteger: GMBLConsentUnknown],
        CONSENT_STATE_REFUSED : [NSNumber numberWithInteger: GMBLConsentRefused],
        CONSENT_STATE_GRANTED : [NSNumber numberWithInteger: GMBLConsentGranted],
    };
    
    return constants;
}

#endif

RCT_REMAP_METHOD(getGdprConsentRequirement, getGdprConsentRequirementWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    GDPRConsentRequirement consentRequirement = [GMBLPrivacyManager gdprConsentRequirement];
    resolve([NSNumber numberWithInteger:consentRequirement]);
}

RCT_EXPORT_METHOD(setUserConsent:(double)consentType
                  toState:(double)consentState)
{
    [GMBLPrivacyManager setUserConsentFor:(GMBLConsentType)consentType toState:(GMBLConsentState)consentState];
}

RCT_EXPORT_METHOD(getUserConsent:(double)consentType
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([NSNumber numberWithInteger:[GMBLPrivacyManager userConsentFor:(GMBLConsentType)consentType]]);
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // necessary because we're implementing constantsToExport
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativePrivacyManagerSpecJSI>(params);
}
#endif

@end

@implementation RCTConvert(GMBLConsentType)
     RCT_ENUM_CONVERTER(GMBLConsentType,
                        (@{ CONSENT_TYPE_PLACES : @(GMBLPlacesConsent)}),
                        E_VALUE_UNKNOWN_TYPE,
                        integerValue)
@end

@implementation RCTConvert(GMBLConsentState)
     RCT_ENUM_CONVERTER(GMBLConsentState,
                        (@{
                            CONSENT_STATE_UNKNOWN : @(GMBLConsentUnknown),
                            CONSENT_STATE_REFUSED : @(GMBLConsentRefused),
                            CONSENT_STATE_GRANTED : @(GMBLConsentGranted),
                        }),
                        E_VALUE_UNKNOWN_STATE,
                        integerValue)
@end
