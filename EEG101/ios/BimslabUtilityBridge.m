// #import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

#import "Flux-Swift.h"

@interface BimslabUtility: NSObject <RCTBridgeModule>
// @interface BimslabUtility: RCTEventEmitter <RCTBridgeModule>

@property (nonnull, nonatomic, strong) BimslabUtilityModule *module;

@end

@implementation BimslabUtility

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        _module = [[BimslabUtilityModule alloc] init];
        // _module = [[BimslabUtilityModule alloc] init withEventEmitter: self];
        // [_module setEventEmitter: self]
    }
    return self;
}

RCT_EXPORT_METHOD(startDataRecording) {
    [self.module startDataRecording];
}

RCT_EXPORT_METHOD(stopDataRecording) {
    [self.module stopDataRecording];
}

// - (NSArray<NSString *> *)supportedEvents
// {
//     return @[
//         @"BIMSLAB_ISGOOD",
//         @"BIMSLAB_HSIPRECISION"
//     ];
// }

@end
