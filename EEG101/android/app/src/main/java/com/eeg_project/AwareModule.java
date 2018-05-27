package com.eeg_project;

import android.util.Log;

import com.aware.Aware;
import com.aware.Aware_Preferences;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

public class AwareModule extends ReactContextBaseJavaModule {

    public AwareModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // @todo permission (or within js)

        // @todo fix db location @warning breaks launch time // may have been done
        Aware.DEBUG = true;
        Aware.setSetting(reactContext, Aware_Preferences.DEBUG_FLAG, "true");
        Aware.setSetting(reactContext, Aware_Preferences.DEBUG_TAG, "AWARE");
        Aware.joinStudy(reactContext, "https://api.awareframework.com/index.php/webservice/index/1553/ZDaTuBFymPPF"); //TODO: UPDATE to UCLA server dashboard study endpoint
        Log.i("AwareModule", "start com.aware.plugin.eegmuse (does it works ?)");
        Aware.startPlugin(reactContext, "com.aware.plugin.eegmuse");

    }

    @Override
    public String getName() {
        return "Aware";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        /*
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        */
        return constants;
    }

    /*
    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
    */
}
