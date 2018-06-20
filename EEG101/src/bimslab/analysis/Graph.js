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
const data = [
  { day: 0, value: 55 },
  { day: 1, value: 52 },
  { day: 2, value: 48 },
  { day: 3, value: 47 },
  { day: 4, value: 53 },
  { day: 5, value: 54 },
  { day: 6, value: 58 },
  { day: 7, value: 45 },
  { day: 8, value: 42 },
  { day: 9, value: 35 },
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
];

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
    let {width, height} = event.nativeEvent.layout;
    this.setState({dimensions: {width, height}})
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
          <View style={{ height: this.state.dimensions.height / 1.75 }}>
            {typeof this.state.dimensions.height !== 'undefined' &&
              <VictoryChart
                domain={{x: [0, 29], y: [0, 100]}}
                height={this.state.dimensions.height/1.75}
                width={this.state.dimensions.width}
                theme={VictoryTheme.material}
                padding={{ left: 30, top: 0, right: 30, bottom: 50 }}
              >
                <VictoryAxis
                  crossAxis={false}
                  tickCount={30}
                  fixLabelOverlap={true}
                  tickFormat={(t) => `${t+1}`}
                />
                <VictoryLine
                  style={{
                    data: { stroke: "#00000075", strokeWidth: 1 }
                  }}
                  data={data}
                  x="day"
                  y="value"
                  interpolation="monotoneX"
                />
                <VictoryArea
                  style={{
                    data: { fill: "#00000005" }
                  }}
                  data={data}
                  x="day"
                  y="value"
                  interpolation="monotoneX"
                />
                <VictoryScatter
                  size={3}
                  data={data}
                  x="day"
                  y="value"
                  style={{ data: { fill: "#00000090" } }}
                />
              </VictoryChart>
            }
          </View>
          <View style={{ marginTop: 0, marginBottom: 5, position: 'relative', paddingLeft: 20, paddingRight: 20}}>
            <Segment style={{ backgroundColor: 'white' }}>
              <Button first><Text>A</Text></Button>
              <Button active><Text>M</Text></Button>
              <Button last><Text>S</Text></Button>
            </Segment>
          </View>
          <View style={{margin: 30, marginTop: 20}}>
            <DescriptiveText style={{marginTop: 0}}>Fake Data 1</DescriptiveText>
            <DescriptiveText style={{marginTop: 0}}>Fake Data 2</DescriptiveText>
            <DescriptiveText style={{marginTop: 0}}>Fake Data 3</DescriptiveText>
            <DescriptiveText style={{marginTop: 0}}>Fake Data 4</DescriptiveText>
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
