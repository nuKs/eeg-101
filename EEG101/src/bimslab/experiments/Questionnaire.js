// @todo move questions in the backend side !
// we use id + mapping table for question instead of using question text as an
// id to avoid encoding issues. question's text should never be modified.
const _backend = [
    {
        id: '3d297b00-9f8d-42fa-a06e-42f1ab1b64ec',
        title: 'Satisfaction',
        text: "Êtes vous insatisfait de votre journée?",
        shown: true,
    },
    {
        id: '192998de-5e58-47a8-8eb6-2f9f3b16f719',
        title: 'Fonctionnement',
        text: "Avez vous eu de la difficulté à accomplir vos tâches efficacemment?",
        shown: true,
    },
    {
        id: '79894955-f2ee-45a2-9af6-0ff6e66ae36b',
        title: 'Stigma',
        text: "Avez vu pensé être moins respectable en raison de votre problème de santé mentale?",
        shown: true,
    },
    {
        id: 'ad8e8853-18ed-49ab-b0b4-37b8076b94db',
        title: 'Social',
        text: "Avez vous beaucoup parlé ou communiqué avec d'autres personnes ? ",
        shown: true,
    },
    {
        id: '0196d8bc-a8c0-489c-9f12-927133a0f57d',
        title: 'Sommeil',
        text: "La nuit passée, quelle a été la qualité de votre sommeil?",
        shown: true,
    },
    {
        id: 'b30eeb7b-dd40-4723-b292-34c6a36f2996',
        title: 'Stress',
        text: "Vous êtes vous senti stressé par divers événements?",
        shown: true,
    },
    {
        id: '8f7e9aff-544e-49b7-873f-b215e86d6dcc',
        title: 'Irritabilité',
        text: "Vous êtes vous senti irritable?",
        shown: true,
    },
    {
        id: '27db9eee-26f3-42fc-939f-82f2ed91cc8f',
        title: 'Mort',
        text: "Avez vous beaucoup pensé à la mort?",
        shown: true,
    },
    {
        id: '466a7adc-9c52-42d7-8f7c-820999040191',
        title: 'Fatigue',
        text: "Vous êtes vous senti fort fatigué?",
        shown: true,
    },
    {
        id: '533b70da-edf1-4fb9-8b2d-1db83f0f6e02',
        title: 'Sensoriel',
        text: "Avez vous vu ou entendu des choses que d'autres personnes ne peuvent voir ou entendre?",
        shown: true,
    },
    {
        id: '43fa13ab-97b6-46c7-a553-e1dbbaa5fd72',
        title: 'Croyance',
        text: "Avez vous pensé avoir des pouvoirs spéciaux, ou d'être sous le contrôle d'une force extérieure?",
        shown: true,
    },
    {
        id: 'f206fd10-9c68-4288-b63d-10b7ceb2c3a5',
        title: 'Motivation',
        text: "Avez vous trouvé difficile d'être motivé à commencer des activités ? ",
        shown: true,
    },
    {
        id: '34394336-fcac-4187-82fc-74005fc6d2dd',
        title: 'Spontanéité',
        text: "Avez vous eu le sentiment de manquer de spontanéité?",
        shown: true,
    },
    {
        id: '9486cd7a-1edd-449d-880d-12288d92ea3e',
        title: 'Cannabis',
        text: "Avez vous consommé beaucoup de cannabis?",
        shown: true,
    },
    {
        id: '83119a6b-a66e-48d9-bf15-ffbdafee7294',
        title: 'Alcool',
        text: "Avez vous consommé beaucoup d'alcool?",
        shown: true,
    },
    {
        id: '0a9c5484-cb9a-4100-853b-6f14aa32887b',
        title: 'Apparence',
        text: "Avez vous eu l'impression que d'autres personnes vous regardaient bizarrement en raison de votre habillement?",
        shown: true,
    },
    {
        id: '4ba88982-9a0c-47f0-a073-0b25561aa969',
        title: 'Moteur',
        text: "Avez vous parlé ou bougé plus lentement qu'à l'habitude?",
        shown: true,
    },
    {
        id: '028ff193-0ac0-4da1-a623-2ad550632166',
        title: 'Tristesse',
        text: "Vous êtes vous senti triste?",
        shown: true,
    },
    {
        id: 'c6f6770b-763c-4d6f-8525-02d64a3d811c',
        title: 'Anxiété',
        text: "Vous êtes vous senti anxieux ou nerveux?",
        shown: true,
    },
];

// @warning need to flush cache once we start to modify question - will probrably 
// never happen considering our requirements.
const _cache = {};

class Questionnaire {
    constructor(questions) {
        this._questions = questions;
    }

    getQuestions() {
        return this._questions;
    }

    getQuestion(questionId) {
        if (typeof _cache[questionId] === 'undefined') {
            for (let i = 0; i < this._questions.length; ++i) {
                if (this._questions[i].id === questionId) {
                    _cache[questionId] = this._questions[i];
                    break;
                }
            }
        }

        if (!_cache[questionId]) {
            throw new Error('Question\'s key doesn\'t exists');
        }

        return _cache[questionId];
    }
}

export default questionnaire = new Questionnaire(_backend);