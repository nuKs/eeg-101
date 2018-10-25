
import UIKit
import AWAREFramework
import os
// import React

@UIApplicationMain
class AppDelegate: AWAREDelegate {
  var awareViewController: UIViewController?
  var reactViewController: UIViewController?
  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    // added code
    // Override point for customization after application launch.
    super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    // store the aware root view (set as main window in xcode project's general preferences)
    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.awareViewController = self.window.rootViewController
    
    // store react-native view
  #if DEBUG // requires xcode proj config => :configuration = Debug => SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG
    os_log("swift DEBUG flag *ON* !")
    let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.bimslab.ios", fallbackResource: nil) // debug
  #else
    os_log("swift DEBUG flag *OFF* !")
    let jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle") // release
  #endif
    let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "EEG101", initialProperties: nil, launchOptions: launchOptions)
    rootView!.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 1)
    let reactViewController = UIViewController()
    reactViewController.view = rootView
    self.reactViewController = reactViewController
    
    // use react-native by default
    self.window.rootViewController = self.reactViewController
    
    // put window in front (probably optional)
    self.window.makeKeyAndVisible()
        
    return true
  }
  
  // switch between react-native & aware controllers
  func switchViewController() {
    // switch back to aware view
    if (window?.rootViewController == self.reactViewController) {
      window?.rootViewController = self.awareViewController
    }
      // switch to react view
    else {
      window?.rootViewController = self.reactViewController
    }
  }
  
  override func applicationWillResignActive(_ application: UIApplication) {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    super.applicationWillResignActive(application)
    
    // Disconnect from currently connected muse
    MuseConnectionManagerImpl.sharedInstance.disconnect()
  }
  
  override func applicationDidEnterBackground(_ application: UIApplication) {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    super.applicationDidEnterBackground(application)
  }
  override func applicationWillEnterForeground(_ application:UIApplication) {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    super.applicationWillEnterForeground(application)
  }
  override func applicationDidBecomeActive(_ application: UIApplication) {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    super.applicationDidBecomeActive(application)
    
    // Reconnect from previously connected muse
    MuseConnectionManagerImpl.sharedInstance.reconnect()
  }
  override func applicationWillTerminate(_ application: UIApplication) {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    // Saves changes in the application's managed object context before the application terminates.
    super.applicationWillTerminate(application)
  }
  
}

