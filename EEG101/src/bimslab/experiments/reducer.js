/**
 * Our Redux reducer.
 **/

// import {
// } from "./actionTypes";

import { shouldExperimentBeEnabled } from "./enforce-schedule-for-experiment"

const initialState = {
  isExperimentEnabled: shouldExperimentBeEnabled(),
  isExperimentOngoing: false
};

console.log('initial state', initialState);

export default function reducer(state = initialState, action = {}) {
  console.log('state', state);

  switch (action.type) {
    case 'ENABLE_EXPERIMENT':
      return {
        ...state,
        isExperimentEnabled: true,
      };

    case 'DISABLE_EXPERIMENT':
      return {
        ...state,
        isExperimentEnabled: false,
        // ...
        // do not kill the experiment (don't set isExperimentOngoing to false).
      };

    case 'KILL_EXPERIMENT':
      return {
        ...state,
        isExperimentOngoing: false
      }

    case 'START_EXPERIMENT':
      return {
        ...state,
        isExperimentOngoing: true
      }

    default:
      return state;
  }
}
