package com.eeg_project;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.PermissionChecker;
import android.view.WindowManager;

import com.aware.Applications;
import com.aware.Aware;
import com.aware.ui.PermissionsHandler;
import com.eeg_project.components.emitter.AppNativeEventEmitter;
import com.facebook.react.ReactActivity;

import java.util.ArrayList;

public class MainActivity extends ReactActivity {

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

        boolean permissions_ok = true;
        for (String p : REQUIRED_PERMISSIONS) { //loop to check all the required permissions.
            if (PermissionChecker.checkSelfPermission(this, p) != PermissionChecker.PERMISSION_GRANTED) {
                permissions_ok = false;
                break;
            }
        }

        if (permissions_ok) {
            if (!Aware.IS_CORE_RUNNING) {
                Intent aware = new Intent(getApplicationContext(), Aware.class);
                startService(aware);

                Applications.isAccessibilityServiceActive(getApplicationContext());
                Aware.isBatteryOptimizationIgnored(getApplicationContext(), getPackageName());
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

            finish();

            Intent permissions = new Intent(this, PermissionsHandler.class);
            permissions.putExtra(PermissionsHandler.EXTRA_REQUIRED_PERMISSIONS, REQUIRED_PERMISSIONS);
            permissions.putExtra(PermissionsHandler.EXTRA_REDIRECT_ACTIVITY, getPackageName() + "/" + getClass().getName());
            permissions.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(permissions);
        }
    }}
