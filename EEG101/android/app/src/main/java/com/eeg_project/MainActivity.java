package com.eeg_project;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.PermissionChecker;
import android.util.Log;
import android.view.WindowManager;

import com.aware.Applications;
import com.aware.Aware;
import com.aware.Aware_Preferences;
import com.aware.plugin.google.activity_recognition.Settings;
import com.aware.ui.PermissionsHandler;
import com.eeg_project.components.emitter.AppNativeEventEmitter;
import com.facebook.react.ReactActivity;

import java.util.ArrayList;

public class MainActivity extends ReactActivity {

    // Check https://medium.com/react-native-development/fixing-problems-in-react-native-caused-by-new-permission-model-on-android-1e547f754b8
    public static final int PERMISSION_REQ_CODE = 1234;
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235;


    private ArrayList<String> REQUIRED_PERMISSIONS;

    //Returns the name of the main component registered from JavaScript.
    //This is used to schedule rendering of the component.
    @Override
    protected String getMainComponentName() {
        return "EEG101";
    }

    // Overriding onCreate to add KEEP_SCREEN_ON flag so that phone doesn't turn off screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        //Since Android 5+ we need to check in runtime if the permissions were given, so we will check every time the user launches the main UI.
        REQUIRED_PERMISSIONS = new ArrayList<>();
        REQUIRED_PERMISSIONS.add(android.Manifest.permission.ACCESS_COARSE_LOCATION);
        REQUIRED_PERMISSIONS.add(android.Manifest.permission.ACCESS_FINE_LOCATION);
        REQUIRED_PERMISSIONS.add(android.Manifest.permission.WRITE_EXTERNAL_STORAGE);
        // REQUIRED_PERMISSIONS.add(android.Manifest.permission.READ_CALL_LOG);
        // REQUIRED_PERMISSIONS.add(android.Manifest.permission.READ_CONTACTS);
        // REQUIRED_PERMISSIONS.add(android.Manifest.permission.READ_SMS);
        REQUIRED_PERMISSIONS.add(android.Manifest.permission.READ_PHONE_STATE);
        // REQUIRED_PERMISSIONS.add(android.Manifest.permission.RECORD_AUDIO);
        REQUIRED_PERMISSIONS.add(android.Manifest.permission.CHANGE_WIFI_STATE);
        REQUIRED_PERMISSIONS.add(android.Manifest.permission.INTERNET);
    }



    @Override
    protected void onResume() {
        super.onResume();

        Log.i("AwareModule", "Iterating through Required_permissions");
        boolean permissions_ok = true;
        for (String p : REQUIRED_PERMISSIONS) { //loop to check all the required permissions.
            if (PermissionChecker.checkSelfPermission(this, p) != PermissionChecker.PERMISSION_GRANTED) {
                permissions_ok = false;
                break;
            }
        }

        if (permissions_ok) {
            Log.i("AwareModule", "Permission OK");

            if (!Aware.IS_CORE_RUNNING) {
                Log.i("AwareModule", "Aware Core not yet running, loading");

                Intent aware = new Intent(getApplicationContext(), Aware.class);
                startService(aware);

                //Ask accessibility to be enabled
                Applications.isAccessibilityServiceActive(getApplicationContext());
                //Ask doze to be disabled
                Aware.isBatteryOptimizationIgnored(getApplicationContext(), getPackageName());

                Aware.DEBUG = true;
                Aware.setSetting(getApplicationContext(), Aware_Preferences.DEBUG_FLAG, "true");
                Aware.setSetting(getApplicationContext(), Aware_Preferences.DEBUG_TAG, "AWARE");
                Aware.joinStudy(getApplicationContext(), "https://api.awareframework.com/index.php/webservice/index/1939/lA3beuWw3aYD");
                // @todo fix db location @warning breaks launch time // may have been done
                Log.i("AwareModule", "start com.aware.plugin.eegmuse");
                Aware.startPlugin(getApplicationContext(), "com.aware.plugin.eegmuse");
                Log.i("AwareModule", "start com.aware.plugin.bimsquestionnaire");
                Aware.startPlugin(getApplicationContext(), "com.aware.plugin.bimsquestionnaire");

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

                //Settings for data synching strategies
                Aware.setSetting(getApplicationContext(), Aware_Preferences.WEBSERVICE_SILENT, true); //don't show notifications of synching events
                Aware.setSetting(getApplicationContext(), Aware_Preferences.WEBSERVICE_WIFI_ONLY, true); //only sync over wifi
                Aware.setSetting(getApplicationContext(), Aware_Preferences.WEBSERVICE_FALLBACK_NETWORK, 6); //after 6h without being able to use Wifi to sync, fallback to 3G for syncing.
                Aware.setSetting(getApplicationContext(), Aware_Preferences.REMIND_TO_CHARGE, true); //remind participants to charge their phone when reaching 15% of battery left
                Aware.setSetting(getApplicationContext(), Aware_Preferences.FREQUENCY_CLEAN_OLD_DATA, 1); //weekly basis cleanup of local storage, otherwise we run out of space locally on the device
                Aware.setSetting(getApplicationContext(), Aware_Preferences.FREQUENCY_WEBSERVICE, 60); //try to sync data to the server every 1h

                Log.i("AwareModule", "CALL to sync data");
                Intent sync = new Intent(Aware.ACTION_AWARE_SYNC_DATA);
                sendBroadcast(sync);

            }

            /*
            if (Aware.isStudy(getApplicationContext())) {
                TextView welcome = findViewById(R.id.welcome);
                welcome.setText("AWARE Device ID: " + Aware.getSetting(this, Aware_Preferences.DEVICE_ID));

                if (cards_container.getVisibility() == View.INVISIBLE) {
                    cards_container.setVisibility(View.VISIBLE);
                    cards_container.addView(new com.aware.plugin.google.activity_recognition.ContextCard().getContextCard(getApplicationContext()));
                    //add more cards here
                }

                join.setVisibility(View.INVISIBLE);
                sync.setVisibility(View.VISIBLE);

            } else {
                IntentFilter joinFilter = new IntentFilter(Aware.ACTION_JOINED_STUDY);
                registerReceiver(joinObserver, joinFilter);

                join.setVisibility(View.VISIBLE);
                sync.setVisibility(View.INVISIBLE);
            }
            */
        } else {
            Log.i("AwareModule", "Permission not OK, finish!");

            finish();

            Intent permissions = new Intent(this, PermissionsHandler.class);
            permissions.putExtra(PermissionsHandler.EXTRA_REQUIRED_PERMISSIONS, REQUIRED_PERMISSIONS);
            permissions.putExtra(PermissionsHandler.EXTRA_REDIRECT_ACTIVITY, getPackageName() + "/" + getClass().getName());
            permissions.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(permissions);
        }
    }}
