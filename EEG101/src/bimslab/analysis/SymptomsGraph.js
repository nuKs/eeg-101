/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View } from "react-native";
import styled from "styled-components";
import { Text, Button, Segment } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from 'react-router-native'

import { VictoryTheme, VictoryChart, VictoryArea, VictoryAxis, VictoryLine, VictoryScatter } from "victory-native";
import DescriptiveText from '../components/DescriptiveText';

import questionnaire from '../experiments/Questionnaire';
import QuestionnaireAnswers from '../experiments/QuestionnaireAnswers';

const Wrapper_ = styled(View)`
    /* center content */
    flex: 1;
    flex-direction: column;
    background-color: white; /*#EFEFEF*/
    /* justify-content: center; */ 
    /* align-items: center; */
  `;
// const data = {
//     satisfaction: [
//         { day: 0,  value: 55 },
//         { day: 1,  value: 52 },
//         { day: 2,  value: 48 },
//         { day: 3,  value: 47 },
//         { day: 4,  value: 53 },
//         { day: 5,  value: 54 },
//         { day: 6,  value: 58 },
//         { day: 7,  value: 45 },
//         { day: 8,  value: 42 },
//         { day: 9,  value: 35 },
//         { day: 10, value: 32 },
//         { day: 11, value: 28 },
//         { day: 12, value: 29 },
//         { day: 13, value: 33 },
//         { day: 14, value: 27 },
//         { day: 15, value: 22 },
//         { day: 16, value: 25 },
//         { day: 17, value: 28 },
//         { day: 18, value: 40 },
//         { day: 19, value: 50 },
//         { day: 20, value: 55 },
//         { day: 21, value: 59 },
//         { day: 22, value: 62 },
//         { day: 23, value: 65 },
//         { day: 24, value: 68 },
//         { day: 25, value: 70 },
//         { day: 26, value: 72 },
//         { day: 27, value: 67 },
//         { day: 28, value: 79 },
//         { day: 29, value: 80 },
//     ],
//     stress: [
//         { day: 0,  value: 50 },
//         { day: 1,  value: 43 },
//         { day: 2,  value: 42 },
//         { day: 3,  value: 38 },
//         { day: 4,  value: 48 },
//         { day: 5,  value: 70 },
//         { day: 6,  value: 78 },
//         { day: 7,  value: 80 },
//         { day: 8,  value: 85 },
//         { day: 9,  value: 78 },
//         { day: 10, value: 76 },
//         { day: 11, value: 90 },
//         { day: 12, value: 76 },
//         { day: 13, value: 82 },
//         { day: 14, value: 78 },
//         { day: 15, value: 72 },
//         { day: 16, value: 67 },
//         { day: 17, value: 60 },
//         { day: 18, value: 53 },
//         { day: 19, value: 52 },
//         { day: 20, value: 55 },
//         { day: 21, value: 58 },
//         { day: 22, value: 60 },
//         { day: 23, value: 54 },
//         { day: 24, value: 56 },
//         { day: 25, value: 51 },
//         { day: 26, value: 58 },
//         { day: 27, value: 60 },
//         { day: 28, value: 55 },
//         { day: 29, value: 57 },
//     ],
//     sommeil: [
//         { day: 0,  value: 70 },
//         { day: 1,  value: 76 },
//         { day: 2,  value: 80 },
//         { day: 3,  value: 74 },
//         { day: 4,  value: 76 },
//         { day: 5,  value: 81 },
//         { day: 6,  value: 75 },
//         { day: 7,  value: 77 },
//         { day: 8,  value: 79 },
//         { day: 9,  value: 80 },
//         { day: 10, value: 83 },
//         { day: 11, value: 75 },
//         { day: 12, value: 73 },
//         { day: 13, value: 70 },
//         { day: 14, value: 66 },
//         { day: 15, value: 63 },
//         { day: 16, value: 61 },
//         { day: 17, value: 57 },
//         { day: 18, value: 54 },
//         { day: 19, value: 58 },
//         { day: 20, value: 55 },
//         { day: 21, value: 59 },
//         { day: 22, value: 51 },
//         { day: 23, value: 58 },
//         { day: 24, value: 55 },
//         { day: 25, value: 52 },
//         { day: 26, value: 54 },
//         { day: 27, value: 50 },
//         { day: 28, value: 56 },
//         { day: 29, value: 52 },
//     ],
//     cannabis: [
//         { day: 0,  value: 0 },
//         { day: 1,  value: 0 },
//         { day: 2,  value: 0 },
//         { day: 3,  value: 0 },
//         { day: 4,  value: 0 },
//         { day: 5,  value: 0 },
//         { day: 6,  value: 0 },
//         { day: 7,  value: 0 },
//         { day: 8,  value: 0 },
//         { day: 9,  value: 0 },
//         { day: 10, value: 0 },
//         { day: 11, value: 0 },
//         { day: 12, value: 0 },
//         { day: 13, value: 0 },
//         { day: 14, value: 34 },
//         { day: 15, value: 22 },
//         { day: 16, value: 14 },
//         { day: 17, value: 17 },
//         { day: 18, value: 5 },
//         { day: 19, value: 0 },
//         { day: 20, value: 0 },
//         { day: 21, value: 0 },
//         { day: 22, value: 0 },
//         { day: 23, value: 0 },
//         { day: 24, value: 0 },
//         { day: 25, value: 0 },
//         { day: 26, value: 0 },
//         { day: 27, value: 0 },
//         { day: 28, value: 0 },
//         { day: 29, value: 0 },
//     ],
//     sensoriel: [
//         { day: 0,  value: 0 },
//         { day: 1,  value: 0 },
//         { day: 2,  value: 0 },
//         { day: 3,  value: 0 },
//         { day: 4,  value: 0 },
//         { day: 5,  value: 0 },
//         { day: 6,  value: 0 },
//         { day: 7,  value: 0 },
//         { day: 8,  value: 0 },
//         { day: 9,  value: 0 },
//         { day: 10, value: 0 },
//         { day: 11, value: 0 },
//         { day: 12, value: 0 },
//         { day: 13, value: 0 },
//         { day: 14, value: 0 },
//         { day: 15, value: 0 },
//         { day: 16, value: 10 },
//         { day: 17, value: 12 },
//         { day: 18, value: 14 },
//         { day: 19, value: 11 },
//         { day: 20, value: 16 },
//         { day: 21, value: 18 },
//         { day: 22, value: 20 },
//         { day: 23, value: 12 },
//         { day: 24, value: 22 },
//         { day: 25, value: 21 },
//         { day: 26, value: 5 },
//         { day: 27, value: 8 },
//         { day: 28, value: 9 },
//         { day: 29, value: 7 },
//     ],
// };

const color = [
    '#3D7668', // green
    '#395676', // navy
    '#9CCBD9', // light blue
    '#FEBD3C', // orange
    '#A43134', // red
];

class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: {},
            filter: {
                mode: 'month'
            },
            data: undefined,
        };

        // symptoms: Array<string>
        const routeParams = props.match.params;
        const questionIds = decodeURIComponent(routeParams.symptoms).split(','); // symptoms === questionIds
        console.log('symptoms', questionIds);

        // data loading
        // 1. retrieve mode
        let mode = this.state.filter.mode;
        // 2. retrieve data depending on current mode
        switch (mode) {
        case 'month':
            console.log('construct');
            // @todo set async constructor or move to onStateUpdate or stg similar ?
            // @todo await+ ?
            // Parse question answers into graph data format.
            QuestionnaireAnswers
                .findLastMonthAnswers({
                    questionIdsFilter: questionIds
                })
                .then(results => {
                    let parsedResult = {};
                    results
                        .forEach(r => {
                            // Set a value of 0 if the day is undefined (for now)
                            // @todo remove unfilled questionnaire's values
                            // from the graph instead of setting null value.
                            if (r.value === null) {
                                r.value = 0;
                            }

                            // To format the date axis:
                            // - use negative day indexes for the past month
                            // - v separate x axis' labels from position in x axis' == allow 
                            //   => only change VictoryAxis

                            let { date, questionnaireId, questionId, value } = r;
                            let question = questionnaire.getQuestion(questionId);

                            // Get relative day from now index (eg if today is
                            // `3`rd day of the month yesterday is `2` and it goes
                            // on negatively).
                            let todayDayOfMonth = (new Date()).getDate();
                            let answerDayOfMonth = date.getDate();

                            // Retrieve number of day difference between today and
                            // the answer.
                            let todayTimestamp = + new Date();
                            let answerTimestamp = + date;

                            let msDelta = todayTimestamp - answerTimestamp;
                            let dayDelta = Math.floor(msDelta / ( 60 * 60 * 24 * 1000 ));

                            // Append parsed result for graph
                            parsedResult[question.title] = parsedResult[question.title] || [];
                            parsedResult[question.title].push({
                                day: todayDayOfMonth - dayDelta,
                                value: value * 100 // VictoryChart doesn't work with decimal value.
                            });
                        });
                    console.log('set data to parsedResult (async)', parsedResult);
                    this.setState(prevState => ({
                        ...prevState,
                        data: parsedResult
                    }));
                }, err => {
                    console.error(err);
                });

            break;

        default:
            throw new Error('Unexpected graph mode / should not happen');
        }
    }

    submit() {
    }

    onLayout = event => {
        // if (this.state.dimensions) return // layout was already called
        let { width, height } = event.nativeEvent.layout;
        this.setState({ dimensions: { width, height } })
    }

    // @todo set state change
    render() {
        let data = this.state.data;
        // @todo change color by list.

        // @todo move flatlist out of render fn
        return (
            <Wrapper_>
                {this.state.data &&
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                    }}
                    onLayout={this.onLayout}
                >
                    <View style={{ margin: 15 }}>
                    </View>
                    <View style={{ flex: 1 }}>
                        {typeof this.state.dimensions.height !== 'undefined' &&
                            <VictoryChart
                                domain={{ x: [0, 29], y: [0, 100] }}
                                height={this.state.dimensions.height / 1.9}
                                width={this.state.dimensions.width}
                                theme={VictoryTheme.material}
                                padding={{ left: 30, top: 0, right: 30, bottom: 50 }}
                            >
                                <VictoryAxis
                                    crossAxis={false}
                                    tickCount={30}
                                    fixLabelOverlap={true}
                                    tickFormat={(t) => `${t + 1}`}
                                />
                                {Object.keys(data).map((key, i) =>
                                    <VictoryArea
                                        key={key}
                                        style={{
                                            data: { fill: color[i] + "05" }
                                        }}
                                        data={data[key]}
                                        x="day"
                                        y="value"
                                    />
                                )}
                                {Object.keys(data).map((key, i) => 
                                    <VictoryLine
                                        key={key}
                                        style={{
                                            data: { stroke: color[i] + "75", strokeWidth: 1 }
                                        }}
                                        data={data[key]}
                                        x="day"
                                        y="value"
                                        interpolation="monotoneX"
                                    />
                                )}
                                {Object.keys(data).map((key, i) => 
                                    <VictoryScatter
                                        key={key}
                                        size={3}
                                        data={data[key]}
                                        x="day"
                                        y="value"
                                        style={{ data: { fill: color[i] + "AA" } }} // 90
                                    />
                                )}
                            </VictoryChart>
                        }
                    </View>
                    <View style={{ marginTop: 0, marginBottom: 10, position: 'relative', paddingLeft: 20, paddingRight: 20 }}>
                        <Segment style={{ backgroundColor: 'white' }}>
                            <Button first><Text>A</Text></Button>
                            <Button active><Text>M</Text></Button>
                            <Button last><Text>S</Text></Button>
                        </Segment>
                    </View>
                    <View style={{ margin: 30, marginTop: 15 }}>
                        {this.state.data && Object
                            .keys(this.state.data)
                            .map((questionTitle, i) => 
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{ width: 5, height: 5, marginTop: 9, marginRight: 10, backgroundColor: color[i]}}/>
                                    <DescriptiveText style={{ marginTop: 0 }}>{questionTitle}</DescriptiveText>
                                </View>
                            )
                        }
                    </View>
                </View>
            }
            </Wrapper_>
        );
    }
}

// Bind redux store to react component
function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Graph));
