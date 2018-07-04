package com.eeg_project;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import com.aware.Aware;
import com.aware.Aware_Preferences;
import com.aware.plugin.eegmuse.Plugin;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class AwareModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext _reactContext;
    private Plugin _plugin;

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

    protected ServiceConnection mServerConn = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder binder) {
            Log.d("AwareModule", "onServiceConnected");
            /*
            Plugin.LocalBinder binder2 = binder;
            _plugin = binder.getService();
            */
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.d("AwareModule", "onServiceDisconnected");
        }
    };

    @ReactMethod
    public void startPlugin() {
        Log.i("AwareModule", "bridge/java: startRecord");
        Aware.startPlugin(this._reactContext, "com.aware.plugin.eegmuse");

        ComponentName componentName;
        componentName = new ComponentName(_reactContext.getPackageName(), "com.aware.plugin.eegmuse.Plugin");
        if (Aware.DEBUG)
            Log.d(Aware.TAG, "Initializing bundled: " + componentName.toString());

        /*
        if (packageInfo.versionName.equals("bundled")) {
        } else {
            componentName = new ComponentName("com.aware.plugin.eegmuse", "com.aware.plugin.eegmuse.Plugin");
            if (Aware.DEBUG)
                Log.d(Aware.TAG, "Initializing external: " + componentName.toString());
        }
        */

        Intent pluginIntent = new Intent();
        pluginIntent.setComponent(componentName);

        _reactContext.bindService(pluginIntent, mServerConn, Context.BIND_AUTO_CREATE);
    }

    @ReactMethod
    public void stopPlugin() {
        // @pre-cond stopRecord()
        Log.i("AwareModule", "bridge/java: stopRecord");
        Aware.stopPlugin(this._reactContext, "com.aware.plugin.eegmuse");
        _reactContext.unbindService(mServerConn);
    }

    @ReactMethod
    public void startRecord() {
        // @pre-cond startPlugin()
        _plugin.startRecording();
    }

    @ReactMethod
    public void stopRecord() {
        _plugin.stopRecording();
    }
}
