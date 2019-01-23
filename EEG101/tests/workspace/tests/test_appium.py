
"""
Simple iOS tests.
NOTE: This is throwaway code to help testers get started with iOS automation
Appium binding doc: https://github.com/appium/python-client
Unit testing syntax: https://docs.python.org/2/library/unittest.html
Usage exemple: 
- `appium`
- `python test_appium.py "/Users/medullosuprarenal/Library/Developer/Xcode/Archives/2018-12-14/EEG101 14-12-2018, 18.50.xcarchive/Products/Applications/Flux.app"`

Req.:
- Appium
- Cartage
- brew install libimobiledevice (http://appium.io/docs/en/drivers/ios-xcuitest-real-devices/)
- brew install ios-deploy
- configure & source .env in root source folder

Troubleshooting ideas:
- Make sure iphone is unlocked 
- Make sure UDID is correct by checking it in Xcode Organizer or iTunes. It is a long string (20+ chars).
- Make sure that you can run your tests against the Simulator.
- Make sure UI Automation is enabled on your device. Settings -> Developer -> Enable UI Automation
- error: No profiles for 'com.facebook.WebDriverAgentRunner' were found: Xcode couldn't find any iOS App Development provisioning profiles matching 'com.facebook.WebDriverAgentRunner'.
   => check signing in /usr/local/lib/node_modules/appium/node_modules/appium-xcuitest-driver/WebDriverAgent/WebDriverAgent.xcodeproj
      see https://stackoverflow.com/questions/40484957/appium-error-xcode-couldnt-find-a-provisioning-profile-matching-com-facebook-w
- Use beta builds ! check `https://github.com/appium/appium/issues/6597#issuecomment-247038942`.

Please note:
- I wouldn't recommend using 32-bit devices with XCTest. There are several
  major known issues, which Apple will never fix. Use 64-bit real devices
  (iPhone 6 and later) where possible see
  https://github.com/appium/appium/issues/7063#issuecomment-299498150
- Appium support performance testing for android, see https://appiumpro.com/editions/5

"""
import unittest
from os import path, environ
from sys import argv # For argv
from appium import webdriver
from time import sleep
from selenium.common.exceptions import NoSuchElementException

class AppiumTest(unittest.TestCase):

    def setUp(self):
        # Set up appium
        # app = path.join(path.dirname(__file__),
        #                    'TableSearchwithUISearchController/Swift',
        #                    'Search.swift.app')

        if 'FLUX_TEST_DEVICENAME' in environ:
            print('Setup test_loading_dialogs test locally')

            app = path.abspath(argv[1])
            print(app)

            self.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            # @note doc http://appium.io/docs/en/writing-running-appium/caps/index.html
            desired_capabilities={
                'app': app,
                # 'bundleId': 'org.pnplab.flux',
                'fullReset': True, # Make sure we have the opening dialogs at launch
                'platformName': 'iOS',
                # 'platformVersion': '12.0.1',
                # 'deviceName': 'nuKs Phone', # @note type `instruments -s devices` or `xcrun simctl list` to gather available device list on your computer
                # 'udid': '8c7bbb8db239a29a402dfc6d79995b92347999ca',
                'deviceName': environ['FLUX_TEST_DEVICENAME'],
                'udid': environ['FLUX_TEST_DEVICEUDID'],
                'automationName': 'XCUITest', # fixes "A new session could not be created. Details: Appium's IosDriver does not support Xcode version 10.1. Apple has deprecated UIAutomation. Use the "XCUITest" automationName capability instead."
                # 'showXcodeLog': True,
                # 'showIOSLog': True,
                'xcodeOrgId': environ['FLUX_TEST_XCODEORGID'],
                'xcodeSigningId': environ['FLUX_TEST_XCODESIGNINID'],
                # fixes https://github.com/appium/appium/issues/9418
                'useNewWDA': True,
                'wdaLaunchTimeout': 240000,
                'wdaConnectionTimeout': 240000,
                'autoAcceptAlerts': False
            })

        elif 'DEVICEFARM_DEVICE_NAME' in environ:
            print('Setup test_loading_dialogs test in AWS Device Farm')

            self.driver = webdriver.Remote(
            command_executor='http://127.0.0.1:4723/wd/hub',
            # @note doc http://appium.io/docs/en/writing-running-appium/caps/index.html
            desired_capabilities={
                # 'app': path.abspath(environ['DEVICEFARM_APP_PATH']),
                # # 'bundleId': 'org.pnplab.flux',
                # 'fullReset': True, # Make sure we have the opening dialogs at launch
                # 'platformName': environ['DEVICEFARM_DEVICE_PLATFORM_NAME'],
                # # 'platformVersion': '12.0.1',
                # # 'deviceName': 'nuKs Phone', # @note type `instruments -s devices` or `xcrun simctl list` to gather available device list on your computer
                # # 'udid': '8c7bbb8db239a29a402dfc6d79995b92347999ca',
                # 'deviceName': environ['DEVICEFARM_DEVICE_NAME'],
                # 'udid': environ['DEVICEFARM_DEVICE_UDID'],
                # 'automationName': 'XCUITest', # fixes "A new session could not be created. Details: Appium's IosDriver does not support Xcode version 10.1. Apple has deprecated UIAutomation. Use the "XCUITest" automationName capability instead."
                # # 'showXcodeLog': True,
                # # 'showIOSLog': True,
                # # 'xcodeOrgId': environ['FLUX_TEST_XCODEORGID'],
                # # 'xcodeSigningId': environ['FLUX_TEST_XCODESIGNINID'],
                # # fixes https://github.com/appium/appium/issues/9418
                # 'useNewWDA': True,
                # 'wdaLaunchTimeout': 240000,
                # 'wdaConnectionTimeout': 240000,
                # # 'autoAcceptAlerts': True
            })
        else:
            raise RuntimeError("You must configure environment variables - see test source code's comments for doc")

    # Accept dialogs !
    # Manually develop the feature as appium's autoAcceptAlerts capability dismiss location background dialog .
    # @warning only works for specified locale (button name change depending on mobile locale) !
    def accept_dialogs(self):
        driver = self.driver

        for _ in range(5):
            driver.implicitly_wait(2)
            try:
                dialog = driver.find_element_by_class_name("XCUIElementTypeAlert")
            except NoSuchElementException:
                break

            button = None
            buttonNames = [
                "OK",
                "Allow",
                "Always Allow",
                "Autoriser",
                "Toujours autoriser",
            ]

            driver.implicitly_wait(0)

            for buttonName in buttonNames:
                try: 
                    button = driver.find_element_by_name(buttonName)
                    button.click()
                    # find_elements_by_xpath
                    break
                except NoSuchElementException:
                    pass

            if button == None:
                sleep(20)
                # device.switch_to.alert.accept()
                raise NoSuchElementException("Alert's button not found")

        driver.implicitly_wait(10)

    def test_loading_dialogs(self):
        print('Launch test_loading_dialogs test')

        driver = self.driver

        driver.implicitly_wait(10)

        # Accept bluetooth dialog which shows up on AWS device farm
        sleep(2)
        self.accept_dialogs()

        authorisationCodeInput = driver.find_element_by_xpath("(//XCUIElementTypeOther[@name=\"Mot de passe\"])[3]/XCUIElementTypeSecureTextField")
        authorisationCodeInput.click()
        authorisationCodeInput.send_keys("4wc2uw")

        authorisationButton = driver.find_element_by_xpath("(//XCUIElementTypeOther[@name=\"ACTIVATION\"])[2]")
        authorisationButton.click()

        self.accept_dialogs()

        # Sleep 1min so we got to have performance insight on sensor data acquisition
        sleep(60)
       

    def tearDown(self):
        try:
            self.driver.quit()
        except:
            # Prevent exception breaking the test on aws device farm.
            pass

    
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(AppiumTest)
    unittest.TextTestRunner(verbosity=2).run(suite)
