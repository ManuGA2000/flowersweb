#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"GrowteqFlowers";
  self.initialProps = @{};

  // Call super FIRST to initialize React Native
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  // Initialize Firebase AFTER React Native is set up
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  return result;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end