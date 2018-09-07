
#import <React/RCTBridgeModule.h>

#import "EEG101-Swift.h"

@interface Aware: NSObject <RCTBridgeModule>

@property (nonnull, nonatomic, strong) AwareModule *module;

@end

@implementation Aware

RCT_EXPORT_MODULE(Aware);

- (instancetype)init {
  self = [super init];
  if (self) {
    _module = [[AwareModule alloc] init];
  }
  return self;
}

RCT_EXPORT_METHOD(startPluginAndRecording) {
  [self.module startPluginAndRecording];
}

RCT_EXPORT_METHOD(stopPluginAndRecording) {
  [self.module stopPluginAndRecording];
}

@end


