// #import <Foundation/Foundation.h> // for NSNumber
#import <React/RCTBridgeModule.h>

#import "EEG101-Swift.h"

@interface Classifier: NSObject <RCTBridgeModule>
  
  @property (nonnull, nonatomic, strong) ClassifierModule *module;
  
  @end

@implementation Classifier
  
  RCT_EXPORT_MODULE();
  
- (instancetype)init {
  self = [super init];
  if (self) {
    _module = [[ClassifierModule alloc] init];
  }
  return self;
}

  RCT_EXPORT_METHOD(startClassifier: (nonnull NSNumber*)notchFrequency) {
    [self.module startClassifier:notchFrequency];
  }
  RCT_EXPORT_METHOD(stopClassifier) {
    [self.module stopClassifier];
  }

  RCT_EXPORT_METHOD(startNoiseListener) {
    [self.module startNoiseListener];
  }
  RCT_EXPORT_METHOD(stopNoiseListener) {
    [self.module stopNoiseListener];
  }

/*
  RCT_REMAP_METHOD(getMuses,
                   getMusesWithResolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject) {
    [self.module getMusesWithResolver:resolve rejecter:reject];
  }
  
  RCT_EXPORT_METHOD(refreshMuseList) {
    [self.module refreshMuseList];
  }
  
  RCT_EXPORT_METHOD(connectToMuseWithIndex:(int)index) {
    [self.module connectToMuseWithIndex:index];
  }
 */

@end

