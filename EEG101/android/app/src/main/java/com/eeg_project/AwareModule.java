package com.eeg_project;

import android.util.Log;

import com.aware.Aware;
import com.aware.Aware_Preferences;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class AwareModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext _reactContext;

    public AwareModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this._reactContext = reactContext;

        // @todo permission (or within js)

        Aware.DEBUG = true;
        Aware.setSetting(reactContext, Aware_Preferences.DEBUG_FLAG, "true");
        Aware.setSetting(reactContext, Aware_Preferences.DEBUG_TAG, "AWARE");
        Aware.joinStudy(reactContext, "https://api.awareframework.com/index.php/webservice/index/1801/C7DzyHpq2phjd"); //TODO: UPDATE to UCLA server dashboard study endpoint

        // @todo fix db location @warning breaks launch time // may have been done
        /*
        Log.i("AwareModule", "start com.aware.plugin.eegmuse");
        Aware.startPlugin(reactContext, "com.aware.plugin.eegmuse");
        */
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

    @ReactMethod
    public void startRecord() {
        Log.i("AwareModule", "bridge/java: startRecord");
        Aware.startPlugin(this._reactContext, "com.aware.plugin.eegmuse");
    }

    @ReactMethod
    public void stopRecord() {
        Aware.
        Log.i("AwareModule", "bridge/java: stopRecord");
    }

    /*
    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
    */
}
