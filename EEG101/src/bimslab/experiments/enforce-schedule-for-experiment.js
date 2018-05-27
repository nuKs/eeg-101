/**
 * @business-rule
 *
 * Only allow the experiment to be started by the end user between 18 & 21pm. 
 * If started near 21pm, ensure it's not kept open all day long by killing it
 * at 21pm30.
 **/ 

import { executeAtTimeOfDay } from "../utilities";

const OPENING_HOUR = 18;
const CLOSING_HOUR = 21;

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
    // Always return true on dev so we can test.
    if (__DEV__) {
        return true;
    }

    // Get the hour (0-23)
    let currentHour = new Date().getHours();

    return currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR;
};

export default enforceScheduleForExperiment;
export { shouldExperimentBeEnabled };