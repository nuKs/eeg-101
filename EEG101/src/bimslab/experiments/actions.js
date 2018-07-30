import {
    STORE_QUESTIONNAIRE
} from './actionTypes.js';


/*export function storeQuestionnaire() {
  return (dispatch, getState) => {
    
    Classifier.stopCollecting();
    dispatch(stopBCIRunning());
    actionOff(getState().bciAction);
  };
}*/

export const storeQuestionnaire = payload => ({
  payload,
  type: STORE_QUESTIONNAIRE
});

