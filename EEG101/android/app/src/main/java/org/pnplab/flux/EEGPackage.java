package org.pnplab.flux;

import android.util.Log;

import org.pnplab.flux.components.classifier.ClassifierModule;
import org.pnplab.flux.components.emitter.AppNativeEventEmitter;
import org.pnplab.flux.components.managers.FilterGraphManager;
import org.pnplab.flux.components.managers.EEGGraphManager;
import org.pnplab.flux.components.managers.PSDGraphManager;
import org.pnplab.flux.components.connector.ConnectorModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

public class EEGPackage implements ReactPackage {

    public MainApplication appState;

    @Override
    // Register Native Modules to JS
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        appState.eventEmitter = new AppNativeEventEmitter(reactApplicationContext);
        Log.w("eventEmitter", " " + appState.eventEmitter);
        return Arrays.<NativeModule>asList(
                new ConnectorModule(reactApplicationContext),
                new ClassifierModule(reactApplicationContext),
                appState.eventEmitter);
    }

    @Override
    // Registers Java ViewManagers to JS
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        return Arrays.<ViewManager>asList(
                new EEGGraphManager(),
                new FilterGraphManager(),
                new PSDGraphManager()
        );
    }
}
