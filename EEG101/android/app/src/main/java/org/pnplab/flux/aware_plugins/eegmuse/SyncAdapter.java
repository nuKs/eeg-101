package org.pnplab.flux.aware_plugins.eegmuse;

import android.app.Service;
import android.content.Intent;
import android.net.Uri;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.aware.syncadapters.AwareSyncAdapter;

/**
 * Created by denzilferreira on 01/09/2017.
 *
 * This class tells what data is synched to the server. The Uri[] needs to be in the same order as the database tables and tables fields (due to the index in the array).
 */
public class SyncAdapter extends Service {
    private AwareSyncAdapter sSyncAdapter = null;
    private static final Object sSyncAdapterLock = new Object();

    @Override
    public void onCreate() {
        Log.i("SyncAdapter", "syncAdapter #onCreate org.pnplab.flux.aware_plugins.eegmuse");

        /*
        if (android.os.Debug.isDebuggerConnected()) {
            android.os.Debug.waitForDebugger();
        }
        */

        super.onCreate();

        synchronized (sSyncAdapterLock) {
            if (sSyncAdapter == null) {
                sSyncAdapter = new AwareSyncAdapter(getApplicationContext(), true, true);
                sSyncAdapter.init(
                        Provider.DATABASE_TABLES, Provider.TABLES_FIELDS,
                        new Uri[]{
                                Provider.EEGMuse_Data.CONTENT_URI
                        }
                );
            }
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return sSyncAdapter.getSyncAdapterBinder();
    }
}