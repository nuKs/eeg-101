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

import { VictoryTheme, VictoryChart, VictoryArea, VictoryAxis, VictoryLine, VictoryScatter } from "victory-native";
import DescriptiveText from '../components/DescriptiveText';

const Wrapper_ = styled(View)`
    /* center content */
    flex: 1;
    flex-direction: column;
    background-color: white; /*#EFEFEF*/
    /* justify-content: center; */ 
    /* align-items: center; */
  `;
const data = {
    satisfaction: [
        { day: 0,  value: 55 },
        { day: 1,  value: 52 },
        { day: 2,  value: 48 },
        { day: 3,  value: 47 },
        { day: 4,  value: 53 },
        { day: 5,  value: 54 },
        { day: 6,  value: 58 },
        { day: 7,  value: 45 },
        { day: 8,  value: 42 },
        { day: 9,  value: 35 },
        { day: 10, value: 32 },
        { day: 11, value: 28 },
        { day: 12, value: 29 },
        { day: 13, value: 33 },
        { day: 14, value: 27 },
        { day: 15, value: 22 },
        { day: 16, value: 25 },
        { day: 17, value: 28 },
        { day: 18, value: 40 },
        { day: 19, value: 50 },
        { day: 20, value: 55 },
        { day: 21, value: 59 },
        { day: 22, value: 62 },
        { day: 23, value: 65 },
        { day: 24, value: 68 },
        { day: 25, value: 70 },
        { day: 26, value: 72 },
        { day: 27, value: 67 },
        { day: 28, value: 79 },
        { day: 29, value: 80 },
    ],
    stress: [
        { day: 0,  value: 50 },
        { day: 1,  value: 43 },
        { day: 2,  value: 42 },
        { day: 3,  value: 38 },
        { day: 4,  value: 48 },
        { day: 5,  value: 70 },
        { day: 6,  value: 78 },
        { day: 7,  value: 80 },
        { day: 8,  value: 85 },
        { day: 9,  value: 78 },
        { day: 10, value: 76 },
        { day: 11, value: 90 },
        { day: 12, value: 76 },
        { day: 13, value: 82 },
        { day: 14, value: 78 },
        { day: 15, value: 72 },
        { day: 16, value: 67 },
        { day: 17, value: 60 },
        { day: 18, value: 53 },
        { day: 19, value: 52 },
        { day: 20, value: 55 },
        { day: 21, value: 58 },
        { day: 22, value: 60 },
        { day: 23, value: 54 },
        { day: 24, value: 56 },
        { day: 25, value: 51 },
        { day: 26, value: 58 },
        { day: 27, value: 60 },
        { day: 28, value: 55 },
        { day: 29, value: 57 },
    ],
    sommeil: [
        { day: 0,  value: 70 },
        { day: 1,  value: 76 },
        { day: 2,  value: 80 },
        { day: 3,  value: 74 },
        { day: 4,  value: 76 },
        { day: 5,  value: 81 },
        { day: 6,  value: 75 },
        { day: 7,  value: 77 },
        { day: 8,  value: 79 },
        { day: 9,  value: 80 },
        { day: 10, value: 83 },
        { day: 11, value: 75 },
        { day: 12, value: 73 },
        { day: 13, value: 70 },
        { day: 14, value: 66 },
        { day: 15, value: 63 },
        { day: 16, value: 61 },
        { day: 17, value: 57 },
        { day: 18, value: 54 },
        { day: 19, value: 58 },
        { day: 20, value: 55 },
        { day: 21, value: 59 },
        { day: 22, value: 51 },
        { day: 23, value: 58 },
        { day: 24, value: 55 },
        { day: 25, value: 52 },
        { day: 26, value: 54 },
        { day: 27, value: 50 },
        { day: 28, value: 56 },
        { day: 29, value: 52 },
    ],
    cannabis: [
        { day: 0,  value: 0 },
        { day: 1,  value: 0 },
        { day: 2,  value: 0 },
        { day: 3,  value: 0 },
        { day: 4,  value: 0 },
        { day: 5,  value: 0 },
        { day: 6,  value: 0 },
        { day: 7,  value: 0 },
        { day: 8,  value: 0 },
        { day: 9,  value: 0 },
        { day: 10, value: 0 },
        { day: 11, value: 0 },
        { day: 12, value: 0 },
        { day: 13, value: 0 },
        { day: 14, value: 34 },
        { day: 15, value: 22 },
        { day: 16, value: 14 },
        { day: 17, value: 17 },
        { day: 18, value: 5 },
        { day: 19, value: 0 },
        { day: 20, value: 0 },
        { day: 21, value: 0 },
        { day: 22, value: 0 },
        { day: 23, value: 0 },
        { day: 24, value: 0 },
        { day: 25, value: 0 },
        { day: 26, value: 0 },
        { day: 27, value: 0 },
        { day: 28, value: 0 },
        { day: 29, value: 0 },
    ],
    sensoriel: [
        { day: 0,  value: 0 },
        { day: 1,  value: 0 },
        { day: 2,  value: 0 },
        { day: 3,  value: 0 },
        { day: 4,  value: 0 },
        { day: 5,  value: 0 },
        { day: 6,  value: 0 },
        { day: 7,  value: 0 },
        { day: 8,  value: 0 },
        { day: 9,  value: 0 },
        { day: 10, value: 0 },
        { day: 11, value: 0 },
        { day: 12, value: 0 },
        { day: 13, value: 0 },
        { day: 14, value: 0 },
        { day: 15, value: 0 },
        { day: 16, value: 10 },
        { day: 17, value: 12 },
        { day: 18, value: 14 },
        { day: 19, value: 11 },
        { day: 20, value: 16 },
        { day: 21, value: 18 },
        { day: 22, value: 20 },
        { day: 23, value: 12 },
        { day: 24, value: 22 },
        { day: 25, value: 21 },
        { day: 26, value: 5 },
        { day: 27, value: 8 },
        { day: 28, value: 9 },
        { day: 29, value: 7 },
    ],
};

const color = {
    satisfaction: '#3D7668', // green
    stress: '#395676', // navy
    sommeil: '#9CCBD9', // light blue
    cannabis: '#FEBD3C', // orange
    sensoriel: '#A43134', // red
};

class Graph extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dimensions: {},
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
        // @todo move flatlist out of render fn
        return (
            <Wrapper_>
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
                                            data: { fill: color[key] + "05" }
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
                                            data: { stroke: color[key] + "75", strokeWidth: 1 }
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
                                        style={{ data: { fill: color[key] + "AA" } }} // 90
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
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: 5, height: 5, marginTop: 9, marginRight: 10, backgroundColor: color['satisfaction']}}/>
                            <DescriptiveText style={{ marginTop: 0 }}>Satisfaction</DescriptiveText>
                        </View>
                        
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: 5, height: 5, marginTop: 9, marginRight: 10, backgroundColor: color['stress']}}/>
                            <DescriptiveText style={{ marginTop: 0 }}>Stress</DescriptiveText>
                        </View>
                        
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: 5, height: 5, marginTop: 9, marginRight: 10, backgroundColor: color['sommeil']}}/>
                            <DescriptiveText style={{ marginTop: 0 }}>Sommeil</DescriptiveText>
                        </View>
                        
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: 5, height: 5, marginTop: 9, marginRight: 10, backgroundColor: color['cannabis']}}/>
                            <DescriptiveText style={{ marginTop: 0 }}>Cannabis</DescriptiveText>
                        </View>
                        
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: 5, height: 5, marginTop: 9, marginRight: 10, backgroundColor: color['sensoriel']}}/>
                            <DescriptiveText style={{ marginTop: 0 }}>Sensoriel</DescriptiveText>
                        </View>
                        
                    </View>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
