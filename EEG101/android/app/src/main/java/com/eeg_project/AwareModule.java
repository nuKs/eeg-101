package com.eeg_project;

import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.database.SQLException;
import android.database.sqlite.SQLiteException;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.util.Log;

import com.aware.Aware;
import com.aware.Aware_Preferences;
import com.aware.plugin.eegmuse.Plugin;
import com.aware.plugin.eegmuse.Provider;
import com.choosemuse.libmuse.Eeg;
import com.choosemuse.libmuse.Muse;
import com.choosemuse.libmuse.MuseArtifactPacket;
import com.choosemuse.libmuse.MuseDataListener;
import com.choosemuse.libmuse.MuseDataPacket;
import com.choosemuse.libmuse.MuseDataPacketType;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.ref.WeakReference;
import java.lang.reflect.Array;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

public class AwareModule extends ReactContextBaseJavaModule {
    private final ContentResolver _contentResolver;
    private ReactApplicationContext _reactContext;
    private Plugin _plugin;
    private Muse _muse;
    private ConcurrentCircularBuffer<MuseDataPacket> _dataBuffer = new ConcurrentCircularBuffer<MuseDataPacket>(MuseDataPacket.class, 220);

    // grab reference to global singletons
    // @note syntax copied from ConnectorModule.java -- which does not reinstantiate MainApp (no
    // `new` keyword)  but provide access to static method using `appState` keyword instead of
    // `MainApplication` one.
    MainApplication appState;
    private HandlerThread dataThread;
    private Handler dataHandler;
    private BufferConsumer bufferConsumerThread;

    public AwareModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this._reactContext = reactContext;

        // @todo permission (or within js)

        Aware.DEBUG = true;
        Aware.setSetting(reactContext, Aware_Preferences.DEBUG_FLAG, "true");
        Aware.setSetting(reactContext, Aware_Preferences.DEBUG_TAG, "AWARE");
        Aware.joinStudy(reactContext, "https://api.awareframework.com/index.php/webservice/index/1801/C7DzyHpq2phjd"); //TODO: UPDATE to UCLA server dashboard study endpoint

        // @todo fix db location @warning breaks launch time // may have been done
        Log.i("AwareModule", "start com.aware.plugin.eegmuse");
        Aware.startPlugin(reactContext, "com.aware.plugin.eegmuse");

        WeakReference<AwareModule> weakPlugin = new WeakReference<AwareModule>(this);
        dataListener = new DataListener(weakPlugin);
        _contentResolver = this._reactContext.getContentResolver();
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
            Plugin.LocalBinder castedBinder = (Plugin.LocalBinder) binder;
            _plugin = castedBinder.getService();
            startRecording();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.d("AwareModule", "onServiceDisconnected");
        }
    };

    @ReactMethod
    public void startPluginAndRecording() {
        Log.i("AwareModule", "bridge/java: startRecord");
        // plugin is started in constructor
        // Aware.startPlugin(this._reactContext, "com.aware.plugin.eegmuse");

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
    public void stopPluginBindingAndRecording() {
        this.stopRecording();
        // @pre-cond stopRecord()
        Log.i("AwareModule", "bridge/java: stopRecord");
        // Plugin is not stopped because it should be located in the background
        // Aware.stopPlugin(this._reactContext, "com.aware.plugin.eegmuse");
        _reactContext.unbindService(mServerConn);
    }

    // @ReactMethod
    public void startRecording() {
        // @note recording isn't done in aware plugin but inside this..
        // broke/merged stopRecording due to service binding timeout issue
        // @pre-cond startPlugin()
        // @pre-cond muse is connected
        // @todo @warning check preconditions -- will crash without log if not !!!
        // @todo @warning check preconditions -- will crash without log if not !!!
        // @todo @warning check preconditions -- will crash without log if not !!!
        // @todo @warning stop recording on muse disconnection
        _muse = appState.connectedMuse;
        // @note should be safe as aware plugin are executed on the main thread

        dataThread = new HandlerThread("dataThread2");
        dataThread.start();
        dataHandler = new Handler(dataThread.getLooper());

        bufferConsumerThread = new BufferConsumer(new WeakReference<ConcurrentCircularBuffer<MuseDataPacket>>(_dataBuffer));
        bufferConsumerThread.start();

        _muse.registerDataListener(dataListener, MuseDataPacketType.EEG);
    }

    // @ReactMethod
    public void stopRecording() {
        // broke/merged stopRecording due to service binding timeout issue

        // _plugin.stopRecording(_muse);
        _muse.unregisterDataListener(dataListener, MuseDataPacketType.EEG);

        bufferConsumerThread.stop(); // @todo fix

        if (dataHandler != null) {
            // Removes all runnables and things from the Handler
            dataHandler.removeCallbacksAndMessages(null);
            dataThread.quit();
        }
    }


    private DataListener dataListener;
    class DataListener extends MuseDataListener {
        final WeakReference<AwareModule> activityRef;

        DataListener(final WeakReference<AwareModule> activityRef) {
            this.activityRef = activityRef;
        }

        @Override
        public void receiveMuseDataPacket(final MuseDataPacket p, final Muse muse) {
            activityRef.get().receiveMuseDataPacket(p, muse);
        }

        @Override
        public void receiveMuseArtifactPacket(final MuseArtifactPacket p, final Muse muse) {
            activityRef.get().receiveMuseArtifactPacket(p, muse);
        }
    }

    private void receiveMuseArtifactPacket(MuseArtifactPacket p, Muse muse) {
    }

    private void receiveMuseDataPacket(MuseDataPacket p, Muse muse) {
        /*
        @warning very slow
        String deviceId = Aware.getSetting(this._reactContext, Aware_Preferences.DEVICE_ID);
        */

        // dataHandler.post(new ProcessorRunnable(p));
        _dataBuffer.add(p);
    }
    /*
    public class ProcessorRunnable implements Runnable {

        private final MuseDataPacket[] _p;

        public ProcessorRunnable(MuseDataPacket[] p) {
            _p = p;
        }

        @Override
        public void run() {
            for(MuseDataPacket p : _p) {
                // doesn't slow down
                ContentValues context_data = new ContentValues();
                context_data.put(Provider.EEGMuse_Data.TIMESTAMP, p.timestamp());
                context_data.put(Provider.EEGMuse_Data.DEVICE_ID, "test"); // deviceId
                context_data.put(Provider.EEGMuse_Data.EEG1, p.getEegChannelValue(Eeg.EEG1));
                context_data.put(Provider.EEGMuse_Data.EEG2, p.getEegChannelValue(Eeg.EEG2));
                context_data.put(Provider.EEGMuse_Data.EEG3, p.getEegChannelValue(Eeg.EEG3));
                context_data.put(Provider.EEGMuse_Data.EEG4, p.getEegChannelValue(Eeg.EEG4));

                // slows down
                try {
                    _contentResolver.insert(Provider.EEGMuse_Data.CONTENT_URI, context_data);
                } catch (SQLiteException e) {
                    if (Aware.DEBUG) Log.d("AwareModule", e.getMessage());
                } catch (SQLException e) {
                    if (Aware.DEBUG) Log.d("AwareModule", e.getMessage());
                }
            }
        }
    }
    */

    public class BufferConsumer extends Thread {

        private final WeakReference<ConcurrentCircularBuffer<MuseDataPacket>> _circularBuffer;

        public BufferConsumer(WeakReference<ConcurrentCircularBuffer<MuseDataPacket>> circularBuffer) {
            super();
            _circularBuffer = circularBuffer;
        }

        public void run(){
            while(true) { // @todo handle stop condition instead
                MuseDataPacket[] _p = _circularBuffer.get().snapshot();
                for (MuseDataPacket p : _p) {
                    // doesn't slow down
                    ContentValues context_data = new ContentValues();
                    context_data.put(Provider.EEGMuse_Data.TIMESTAMP, p.timestamp());
                    context_data.put(Provider.EEGMuse_Data.DEVICE_ID, "test"); // @todo set back deviceId
                    context_data.put(Provider.EEGMuse_Data.EEG1, p.getEegChannelValue(Eeg.EEG1));
                    context_data.put(Provider.EEGMuse_Data.EEG2, p.getEegChannelValue(Eeg.EEG2));
                    context_data.put(Provider.EEGMuse_Data.EEG3, p.getEegChannelValue(Eeg.EEG3));
                    context_data.put(Provider.EEGMuse_Data.EEG4, p.getEegChannelValue(Eeg.EEG4));

                    // slows down
                    try {
                        _contentResolver.insert(Provider.EEGMuse_Data.CONTENT_URI, context_data);
                    } catch (SQLiteException e) {
                        if (Aware.DEBUG) Log.d("AwareModule", e.getMessage());
                    } catch (SQLException e) {
                        if (Aware.DEBUG) Log.d("AwareModule", e.getMessage());
                    }
                }
            }
        }
    }


    /**
     * A circular array buffer with a copy-and-swap cursor.
     *
     * <p>This class provides an list of T objects who's size is <em>unstable</em>.
     * It's intended for capturing data where the frequency of sampling greatly
     * outweighs the frequency of inspection (for instance, monitoring).</p>
     *
     * <p>This object keeps in memory a fixed size buffer which is used for
     * capturing objects.  It copies the objects to a snapshot array which may be
     * worked with.  The size of the snapshot array will vary based on the
     * stability of the array during the copy operation.</p>
     *
     * <p>Adding buffer to the buffer is <em>O(1)</em>, and lockless.  Taking a
     * stable copy of the sample is <em>O(n)</em>.</p>
     */
    public class ConcurrentCircularBuffer <T> {
        private final AtomicLong cursor = new AtomicLong();
        private final T[]      buffer;
        private final Class<T> type;

        /**
         * Create a new concurrent circular buffer.
         *
         * @param type The type of the array.  This is captured for the same reason
         * it's required by {@link java.util.List.toArray()}.
         *
         * @param bufferSize The size of the buffer.
         *
         * @throws IllegalArgumentException if the bufferSize is a non-positive
         * value.
         */
        public ConcurrentCircularBuffer (final Class <T> type,
                                         final int bufferSize)
        {
            if (bufferSize < 1) {
                throw new IllegalArgumentException(
                        "Buffer size must be a positive value"
                );
            }

            this.type    = type;
            this.buffer = (T[]) new Object [ bufferSize ];
        }

        /**
         * Add a new object to this buffer.
         *
         * <p>Add a new object to the cursor-point of the buffer.</p>
         *
         * @param sample The object to add.
         */
        public void add (T sample) {
            buffer[(int) (cursor.getAndIncrement() % buffer.length)] = sample;
        }

        /**
         * Return a stable snapshot of the buffer.
         *
         * <p>Capture a stable snapshot of the buffer as an array.  The snapshot
         * may not be the same length as the buffer, any objects which were
         * unstable during the copy will be factored out.</p>
         *
         * @return An array snapshot of the buffer.
         */
        public T[] snapshot () {
            T[] snapshots = (T[]) new Object [ buffer.length ];

            /* Determine the size of the snapshot by the number of affected
             * records.  Trim the size of the snapshot by the number of records
             * which are considered to be unstable during the copy (the amount the
             * cursor may have moved while the copy took place).
             *
             * If the cursor eliminated the sample (if the sample size is so small
             * compared to the rate of mutation that it did a full-wrap during the
             * copy) then just treat the buffer as though the cursor is
             * buffer.length - 1 and it was not changed during copy (this is
             * unlikley, but it should typically provide fairly stable results).
             */
            long before = cursor.get();

            /* If the cursor hasn't yet moved, skip the copying and simply return a
             * zero-length array.
             */
            if (before == 0) {
                return (T[]) Array.newInstance(type, 0);
            }

            System.arraycopy(buffer, 0, snapshots, 0, buffer.length);

            long after          = cursor.get();
            int  size           = buffer.length - (int) (after - before);
            long snapshotCursor = before - 1;

            /* Highly unlikely, but the entire buffer was replaced while we
             * waited...so just return a zero length array, since we can't get a
             * stable snapshot...
             */
            if (size <= 0) {
                return (T[]) Array.newInstance(type, 0);
            }

            long start = snapshotCursor - (size - 1);
            long end   = snapshotCursor;

            if (snapshotCursor < snapshots.length) {
                size   = (int) snapshotCursor + 1;
                start  = 0;
            }

            /* Copy the sample snapshot to a new array the size of our stable
             * snapshot area.
             */
            T[] result = (T[]) Array.newInstance(type, size);

            int startOfCopy = (int) (start % snapshots.length);
            int endOfCopy   = (int) (end   % snapshots.length);

            /* If the buffer space wraps the physical end of the array, use two
             * copies to construct the new array.
             */
            if (startOfCopy > endOfCopy) {
                System.arraycopy(snapshots, startOfCopy,
                        result, 0,
                        snapshots.length - startOfCopy);
                System.arraycopy(snapshots, 0,
                        result, (snapshots.length - startOfCopy),
                        endOfCopy + 1);
            }
            else {
                /* Otherwise it's a single continuous segment, copy the whole thing
                 * into the result.
                 */
                System.arraycopy(snapshots, startOfCopy,
                        result, 0, endOfCopy - startOfCopy + 1);
            }

            return (T[]) result;
        }

        /**
         * Get a stable snapshot of the complete buffer.
         *
         * <p>This operation fetches a snapshot of the buffer using the algorithm
         * defined in {@link snapshot()}.  If there was concurrent modification of
         * the buffer during the copy, however, it will retry until a full stable
         * snapshot of the buffer was acquired.</p>
         *
         * <p><em>Note, for very busy buffers on large symmetric multiprocessing
         * machines and supercomputers running data processing intensive
         * applications, this operation has the potential of being fairly
         * expensive.  In practice on commodity hardware, dualcore processors and
         * non-processing intensive systems (such as web services) it very rarely
         * retries.</em></p>
         *
         * @return A full copy of the internal buffer.
         */
        public T[] completeSnapshot () {
            T[] snapshot = snapshot();

            /* Try again until we get a snapshot that's the same size as the
             * buffer...  This is very often a single iteration, but it depends on
             * how busy the system is.
             */
            while (snapshot.length != buffer.length) {
                snapshot = snapshot();
            }

            return snapshot;
        }

        /**
         * The size of this buffer.
         */
        public int size () {
            return buffer.length;
        }
    }


}
