package com.eeg_project;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.content.PermissionChecker;
import android.util.Log;
import android.view.WindowManager;

import com.aware.Applications;
import com.aware.Aware;
import com.aware.Aware_Preferences;
import com.aware.plugin.google.activity_recognition.Settings;

import java.util.Timer;
import java.util.TimerTask;


/**
 * This class is not used in the app. It is used as MainActivity while developing
 * the aware plugins, as a way to bypass react native launch and thus fasten debug
 * cycles.
 **/

public class AwareDebugActivity extends Activity {

    private static final int AWARE_LAUNCH_DELAY = 0; // MS

    public final String[] REQUIRED_PERMISSIONS = {
            android.Manifest.permission.ACCESS_COARSE_LOCATION,
            android.Manifest.permission.ACCESS_FINE_LOCATION,
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
            // @note we don't use the next one anymore - it crashes the app at launch w/ "couldn't find "libaudioclassifier.so""
            // android.Manifest.permission.RECORD_AUDIO,
            android.Manifest.permission.INTERNET,

            android.Manifest.permission.VIBRATE,
            android.Manifest.permission.READ_CALL_LOG,
            android.Manifest.permission.READ_PHONE_STATE,
            android.Manifest.permission.ACCESS_WIFI_STATE,
            android.Manifest.permission.RECORD_AUDIO,
            android.Manifest.permission.READ_CONTACTS,
            android.Manifest.permission.READ_SMS,
            android.Manifest.permission.CHANGE_WIFI_STATE,

            // android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
            android.Manifest.permission.INTERNET,
            // android.Manifest.permission.INSTANT_APP_FOREGROUND_SERVICE,

            android.Manifest.permission.WRITE_SYNC_SETTINGS,

            // perms coming from I don't know where
            android.Manifest.permission.BLUETOOTH,
            android.Manifest.permission.BLUETOOTH_ADMIN,
            android.Manifest.permission.CAMERA,

            android.Manifest.permission.READ_EXTERNAL_STORAGE,

            // perms that doesn't seems to exists
            // android.Manifest.permission.FLASHLIGHT,
            // android.Manifest.permission.WRITE_INTERNAL_STORAGE,
            // android.Manifest.permission.READ_INTERNAL_STORAGE,
    };

    // Overriding onCreate to add KEEP_SCREEN_ON flag so that phone doesn't turn off screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.i("MainActivity", "onCreate (react)");

        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    protected boolean checkPermissions() {
        Log.i("MainActivity", "checkPermissions");

        for (String p : REQUIRED_PERMISSIONS) { //loop to check all the required permissions.
            if (PermissionChecker.checkSelfPermission(this, p) != PermissionChecker.PERMISSION_GRANTED) {
                return false;
            }
        }

        return true;
    }

    protected final int REQUEST_CODE = 112;
    @RequiresApi(api = Build.VERSION_CODES.M)
    protected void requestPermissionsAndResumeOnGranted() {
        // Since Android 5+ we need to check in runtime if the permissions were given, so we will check every time the user launches the main UI.
        // @warning The same process of adding required perm is done in each aware sensor (check source code), however UPMC repo does add them manually as well (but last update is from 2016)..
        // @warning EEG101 *js* code already contains a location request to be able to use muse 2016 for android
        // @warning com.aware.ui.PermissionsHandler can't be used as it doesn't use ReactActivity#requestPermissions and makes the app crashes on intent redirection (even with PermissionsHandler.EXTRA_REDIRECT_ACTIVITY)
        // @warning listener has to be defined in #requestPermissions (even if null) as ReactActivity does not override the method declaration without it

        Log.i("MainActivity", "requestPermissions");

        this.requestPermissions(REQUIRED_PERMISSIONS, REQUEST_CODE); // requestCode number has been copied from com.aware.ui.PermissionsHandler, I don't know what it does, I think it's arbitrary to filter results in callback #onRequestPermissionsResult
        // @note #onRequestPermissionsResult will be called asynchronously once finished.
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode != REQUEST_CODE) {
            // Receiving #onRequestPermissionsResult callback from unexpected sender
            Log.e("MainActivity","Receiving #onRequestPermissionsResult callback from unexpected sender");
            assert(false);
        }
        else {
            // Check all the permissions have been granted
            boolean permissionsGranted = true;
            for (int r : grantResults) { //loop to check all the required permissions.
                if (r != PackageManager.PERMISSION_GRANTED) {
                    permissionsGranted = false;
                    break;
                }
            }

            // Start the app if all the permissions have been granted, quit otherwise.
            if (permissionsGranted) {
                resumeOnPermissionsGranted();
            }
            else {
                finish();
            }
        }
    }

    protected void resumeOnPermissionsGranted() {
        // @warning random crashes may occur due to `https://github.com/facebook/react-native/pull/18996`
        //          see https://github.com/facebook/react-native/pull/18996
        Log.i("MainActivity", "#resumeOnPermissionsGranted");

        // Launch & setup aware if not already running.
        if (!Aware.IS_CORE_RUNNING) {
            // this.getReactInstanceManager().getCurrentReactContext();
            Log.i("MainActivity", "Aware Core not yet running, loading");

            // Launch aware
            Intent aware = new Intent(getApplicationContext(), Aware.class);
            startService(aware);

            // Setup debug mode
            // @warning this trigger ANR (in this case, crash due to service timeout/slowliness)
            Aware.DEBUG = true;
            Aware.setSetting(getApplicationContext(), Aware_Preferences.DEBUG_FLAG, "true");
            Aware.setSetting(getApplicationContext(), Aware_Preferences.DEBUG_TAG, "AWARE");

            // Setup study
            // @warning this trigger Attempted to add a toast window with unknown token android.os.Binder / android.view.WindowManager$BadTokenException: Unable to add window -- token android.os.BinderProxy
            // (unrelated to ANR) - May occur when trying to sync the db or issue may be unrelated to #joinStudy
            // Aware.joinStudy(getApplicationContext(), "https://api.awareframework.com/index.php/webservice/index/1939/lA3beuWw3aYD");

            // @warning this 10s timer prevent the app from crashing when joining study. It's
            // possible the issue is aware is not yet loaded when joining the study.
            // @warning !!!! this is unsafe !!!! @todo find a callback to join the study only once aware is loaded
            // also, 3s is enough for joinStudy, but more is required for the rest of setSetting & startPlugins...
            Timer timer = new Timer();
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    Log.i("AwareModule", "!!!A");
                    Aware.startPlugin(getApplicationContext(), "com.eeg_project.aware_plugins.eegmuse");
                    Log.i("AwareModule", "!!!B");

                    /*

                    Log.i("AwareModule", "Joining study");
                    Aware.joinStudy(getApplicationContext(), "https://api.awareframework.com/index.php/webservice/index/1939/lA3beuWw3aYD");

                    Log.i("AwareModule", "start com.eeg_project.aware_plugins.eegmuse");
                    Aware.startPlugin(getApplicationContext(), "com.eeg_project.aware_plugins.eegmuse");

                    // Log.i("AwareModule", "start com.aware.plugin.eegmuse");
                    // Aware.startPlugin(getApplicationContext(), "com.aware.plugin.eegmuse");
                    // Log.i("AwareModule", "start com.aware.plugin.bimsquestionnaire");
                    // Aware.startPlugin(getApplicationContext(), "com.aware.plugin.bimsquestionnaire");

                    // This makes the app crash `Attempted to add a toast window with unknown token android.os.Binder` / Perhaps because of syncing reminder
                    //Settings for data synching strategies
                    Aware.setSetting(getApplicationContext(), Aware_Preferences.WEBSERVICE_SILENT, true); //don't show notifications of synching events
                    Aware.setSetting(getApplicationContext(), Aware_Preferences.WEBSERVICE_WIFI_ONLY, true); //only sync over wifi
                    Aware.setSetting(getApplicationContext(), Aware_Preferences.WEBSERVICE_FALLBACK_NETWORK, 6); //after 6h without being able to use Wifi to sync, fallback to 3G for syncing.
                    Aware.setSetting(getApplicationContext(), Aware_Preferences.REMIND_TO_CHARGE, true); //remind participants to charge their phone when reaching 15% of battery left
                    Aware.setSetting(getApplicationContext(), Aware_Preferences.FREQUENCY_CLEAN_OLD_DATA, 1); //weekly basis cleanup of local storage, otherwise we run out of space locally on the device
                    Aware.setSetting(getApplicationContext(), Aware_Preferences.FREQUENCY_WEBSERVICE, 60); //try to sync data to the server every 1h

                    //Activity Recognition settings
                    Aware.setSetting(getApplicationContext(), Settings.STATUS_PLUGIN_GOOGLE_ACTIVITY_RECOGNITION, true);
                    //this is actually controlled by Google's algorithm. We want every 10 seconds, but this is not guaranteed. Recommended value is 60 s.
                    Aware.setSetting(getApplicationContext(), Settings.FREQUENCY_PLUGIN_GOOGLE_ACTIVITY_RECOGNITION, 60);
                    Aware.startPlugin(getApplicationContext(), "com.aware.plugin.google.activity_recognition"); //initialise plugin and set as active

                    //fused location
                    Aware.setSetting(getApplicationContext(), com.aware.plugin.google.fused_location.Settings.STATUS_GOOGLE_FUSED_LOCATION, true);
                    Aware.setSetting(getApplicationContext(), com.aware.plugin.google.fused_location.Settings.FREQUENCY_GOOGLE_FUSED_LOCATION, 300); //every 5 minutes.
                    Aware.setSetting(getApplicationContext(), com.aware.plugin.google.fused_location.Settings.MAX_FREQUENCY_GOOGLE_FUSED_LOCATION, 60); //every 60 s if mobile
                    Aware.setSetting(getApplicationContext(), com.aware.plugin.google.fused_location.Settings.ACCURACY_GOOGLE_FUSED_LOCATION, 102);
                    Aware.setSetting(getApplicationContext(), com.aware.plugin.google.fused_location.Settings.FALLBACK_LOCATION_TIMEOUT, 20); //if not moving for 20 minutes, new location captured
                    Aware.setSetting(getApplicationContext(), com.aware.plugin.google.fused_location.Settings.LOCATION_SENSITIVITY, 5); //need to move 5 meter to assume new location
                    Aware.startPlugin(getApplicationContext(), "com.aware.plugin.google.fused_location");

                    //conversations
                    // we don't use it anymore - it crashes the app at launch w/ "couldn't find "libaudioclassifier.so""
                    // Aware.startPlugin(getApplicationContext(), "com.aware.plugin.studentlife.audio_final");
                    // there are no settings on this one... duty cycle is set to every 3 minutes, listen for 1 minute.

                    //Ask accessibility to be enabled
                    Applications.isAccessibilityServiceActive(getApplicationContext());
                    //Ask doze to be disabled
                    Aware.isBatteryOptimizationIgnored(getApplicationContext(), getPackageName());
                    */

                    /* commented out as I hope this is what make the start of the app incredibly slow.. :p be patient ! probably .debug ON is the issue too
                    Log.i("AwareModule", "CALL to sync data");
                    Intent sync = new Intent(Aware.ACTION_AWARE_SYNC_DATA);
                    sendBroadcast(sync);
                    */
                }
            }, AWARE_LAUNCH_DELAY);


        }

        // @warning @todo make sure study has been joined, use a observer to do so (see ucla source code) and reload the app if not
    }

    @Override
    protected void onResume() {
        Log.i("MainActivity", "onResume");

        super.onResume();

        // @warning We have to manually check all permissions before requesting them, as
        // #request call pauses the app even if no request is made, thus launching an infinite
        // #onResume loop.
        if (!checkPermissions()) {
            requestPermissionsAndResumeOnGranted();
        }
        else {
            resumeOnPermissionsGranted();
        }
    }
}
