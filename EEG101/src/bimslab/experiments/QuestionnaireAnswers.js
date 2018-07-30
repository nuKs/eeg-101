// need to develop a model w

import { AsyncStorage } from "react-native"

var _cache = {};

class QuestionnaireAnswer {
    constructor(timestamp, questionnaire, values) {
        this._timestamp = timestamp;
        this._questionnaire = questionnaire; // only for ref
        // this.values: [{
        //     questionId: ...
        //     value: ...
        // }, ...]
        this._values = values || [];
    }

    static async store(questionnaireAnswers) {
        return new Promise((resolve, reject) => {
            let timestamp = questionnaireAnswers._timestamp;
            let values = questionnaireAnswers._values;
            let date = new Date(timestamp);

            let questionnaireId = `${date.getFullYear().toString().substring(2)}${('0' + (+date.getMonth()+1)).slice(-2)}${('0' + date.getDate()).slice(-2)}`; // yymmdd
            // resolve promise once all items have been resolved (or once an
            // exception has been thrown).
            let _i = 0;
            let cb = () => {
                if (++_i === values.length) 
                    resolve();
            };
            let cbE = (e) => {
                _i = Number.MAX_SAFE_INTEGER; // prevent further resolve()
                reject(e); // reject promise
            }

            // store as a list = easier to retrieve
            // either
            // - set id as yy/mm/dd
            // - set id as incremental

            // @todo use multiSet instead!
            values.forEach((v) => {
                let questionId = v.questionId;
                let value = v.value;
                AsyncStorage
                    .setItem(`@questionnaire:${questionnaireId}:${questionId}`, `${value}`)
                    .then(cb, cbE);

                console.log('stored: ', `@questionnaire:${questionnaireId}:${questionId}`, `${value}`);
            });
        });
    }

    /**
     * @return [{date, questionnaireId, questionId, value}]
     **/
    static async findLastMonthAnswers({ questionIdsFilter }) {
        // Retrieve all question's keys
        let today = new Date();
        let numberOfDaysThisMonth = (new Date(today.getFullYear(), (+today.getMonth()+1), 0)).getDate();
        let keysExpectedToExists = [];

        for (let i = 0; i < numberOfDaysThisMonth; ++i) {
            let priorDate = new Date()
            priorDate.setDate(today.getDate() - i);
            let questionnaireId = `${priorDate.getFullYear().toString().substring(2)}${('0'+(+priorDate.getMonth()+1)).slice(-2)}${('0'+priorDate.getDate()).slice(-2)}`; // yymmdd
            let keys = questionIdsFilter.map(questionId => `@questionnaire:${questionnaireId}:${questionId}`);
            
            keysExpectedToExists = [
                ...keysExpectedToExists, 
                ...keys
            ];
        }

        AsyncStorage.getAllKeys(((err, allKeys) => {
            // AsyncStorage.multiRemove(allKeys);
            
            console.log('allKeys!', allKeys);
            AsyncStorage.multiGet(allKeys, (err, store) => {
                console.log('store!', store);
            });
        }));

        // Retrieve values from database
        return new Promise((resolve, reject) => {
            AsyncStorage.multiGet(keysExpectedToExists, (err, stores) => {
                let result = stores
                    .map((result, i, store) => {

                        // store[i][0] === key
                        let key = store[i][0];
                        let splittedKey = key.split(':');

                        // store[i][1] === value
                        let value = store[i][1];

                        let questionnaireId = splittedKey[1];
                        console.log(`20${questionnaireId.substring(0, 2)}-${questionnaireId.substring(2, 4)}-${questionnaireId.substring(4)}T00:00:00`);
                        let date = new Date(`20${questionnaireId.substring(0,2)}-${questionnaireId.substring(2,4)}-${questionnaireId.substring(4)}T00:00:00`);
                        let questionId = splittedKey[2];
                        
                        return {
                            date: date,
                            questionnaireId: questionnaireId,
                            questionId: questionId,
                            value: value,
                        };
                    });

                resolve(result);
            });
        });
    }
};

export default QuestionnaireAnswer;