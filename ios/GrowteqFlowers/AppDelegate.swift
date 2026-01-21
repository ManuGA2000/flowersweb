import UIKit
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate, RCTAppDependencyProviding {
  
  var window: UIWindow?
  
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    let delegate = RCTDefaultReactNativeFactoryDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    
    // Provide dependency provider (optional but recommended for new arch)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    
    window = UIWindow(frame: UIScreen.main.bounds)
    
    factory.startReactNative(
      withModuleName: "GrowteqFlowers",
      in: window!,
      launchOptions: launchOptions
    )
    
    window?.makeKeyAndVisible()
    
    return true
  }
  
  // Optional: Provide custom bundle URL (debug vs release)
  func sourceURL(for bridge: RCTBridge) -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}