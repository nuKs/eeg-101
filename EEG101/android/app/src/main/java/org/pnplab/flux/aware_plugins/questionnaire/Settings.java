package org.pnplab.flux.aware_plugins.questionnaire;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.CheckBoxPreference;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.preference.PreferenceManager;

import com.aware.Aware;

public class Settings extends PreferenceActivity implements SharedPreferences.OnSharedPreferenceChangeListener {

    //Plugin settings in XML @xml/preferences
    public static final String STATUS_PLUGIN_QUESTIONNAIRE = "status_plugin_questionnaire";

    //Plugin settings UI elements
    private static CheckBoxPreference status;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // I don't think it's needed as tge STATUS_PLUGIN_QUESTIONNAIRE is already set programmatically  & this view should by design only embed activity, not model.
        //addPreferencesFromResource(R.xml.preferences);
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        prefs.registerOnSharedPreferenceChangeListener(this);
    }

    @Override
    protected void onResume() {
        super.onResume();

        status = (CheckBoxPreference) findPreference(STATUS_PLUGIN_QUESTIONNAIRE);
        if( Aware.getSetting(this, STATUS_PLUGIN_QUESTIONNAIRE).length() == 0 ) {
            Aware.setSetting( this, STATUS_PLUGIN_QUESTIONNAIRE, true ); //by default, the setting is true on install
        }
        status.setChecked(Aware.getSetting(getApplicationContext(), STATUS_PLUGIN_QUESTIONNAIRE).equals("true"));
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        Preference setting = findPreference(key);
        if( setting.getKey().equals(STATUS_PLUGIN_QUESTIONNAIRE) ) {
            Aware.setSetting(this, key, sharedPreferences.getBoolean(key, false));
            status.setChecked(sharedPreferences.getBoolean(key, false));
        }
        if (Aware.getSetting(this, STATUS_PLUGIN_QUESTIONNAIRE).equals("true")) {
            Aware.startPlugin(getApplicationContext(), "pnplab.flux.aware_plugins.questionnaire");
        } else {
            Aware.stopPlugin(getApplicationContext(), "pnplab.flux.aware_plugins.questionnaire");
        }
    }
}
