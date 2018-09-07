/**
 * @business-rule
 *
 * Only allow the experiment to be started by the end user between 18 & 21pm. 
 * If started near 21pm, ensure it's not kept open all day long by killing it
 * at 21pm30.
 **/ 

import { executeAtTimeOfDay } from "../utilities";

const OPENING_HOUR = 10;
const CLOSING_HOUR = 22;

// const OPENING_HOUR = 18;
// const CLOSING_HOUR = 21;

const enforceScheduleForExperiment = () => {
    return (dispatch, getState) => {
        // Enable experiment
        executeAtTimeOfDay(OPENING_HOUR, 0, () => {
            dispatch({
                type: 'ENABLE_EXPERIMENT'
            });
        });

        // Disable experiment
        executeAtTimeOfDay(CLOSING_HOUR, 0, () => {
            dispatch({
                type: 'DISABLE_EXPERIMENT'
            });
        });

        // Kill experiment (if one is active)
        executeAtTimeOfDay(CLOSING_HOUR, 30, () => {
            if (getState().isExperimentOngoing) {
                // Trigger kill experiment dispatch if one is ongoing.
                dispatch({
                    type: 'KILL_EXPERIMENT'
                });
            }
            else {
                // Do nothing if no experiment is ongoing
                // ...
            }
        });
    };
};

// Method useful to set the default state in the redux store when the app opens.
const shouldExperimentBeEnabled = () => {

    // Get the hour (0-23)
    let currentHour = new Date().getHours();

    let shouldExperimentBeEnabled = currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR;
    console.log('currentHour', currentHour, 'shouldExperimentBeEnabled', shouldExperimentBeEnabled, 'OPENING_HOUR', OPENING_HOUR, 'CLOSING_HOUR', CLOSING_HOUR);

    // Always return true on dev so we can test.
    if (__DEV__) {
        return true;
    }
    else {
        return shouldExperimentBeEnabled;
    }
};

export default enforceScheduleForExperiment;
export { shouldExperimentBeEnabled };