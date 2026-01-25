#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

#if __has_include(<FirebaseCore/FirebaseCore.h>)
#import <FirebaseCore/FirebaseCore.h>
#elif __has_include(<Firebase/Firebase.h>)
#import <Firebase/Firebase.h>
#else
#import <Firebase.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Configure Firebase FIRST - before React Native initializes
  @try {
    [FIRApp configure];
    NSLog(@"✅ Firebase configured successfully in AppDelegate");
  } @catch (NSException *exception) {
    NSLog(@"⚠️ Firebase configuration error: %@", exception.reason);
  }
  
  self.moduleName = @"GrowteqFlowers";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
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