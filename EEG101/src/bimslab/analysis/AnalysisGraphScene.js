/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View, Slider, FlatList, TouchableHighlight, Dimensions } from "react-native";
import styled from "styled-components";
import { Text, Button, Icon, Tabs, Tab, TabHeading, ScrollableTab, Header, Left, Body, Right, Segment, Content } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { setGraphViewDimensions } from "../redux/actions";
import {
  withRouter
} from "react-router-native";

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { VictoryTheme, VictoryChart, VictoryGroup, VictoryAxis, VictoryLine, VictoryScatter } from "victory-native";

const Wrapper_ = styled(View)`
    /* center content */
    flex: 1;
    flex-direction: column;
    background-color: white; /*#EFEFEF*/
    /* justify-content: center; */ 
    /* align-items: center; */
  `;
const HeaderText_ = styled(Text)
  .attrs({
    adjustsFontSizeToFit: true,
    numberOfLines: 4
  })`
    font-size: 15;
    text-align: center;

    /* for some reason padding alone doesn't work inside styled-components.. */
    padding-left: 10;
    padding-right: 10;

    color: #222;
  `;

let _data = [
  {
    type: 'text',
    title: 'Explorez vos données.',
    icon: 'chevron-right'
  },
  {
    type: 'question',
    title: 'Ma question #1',
    value: undefined
  },
  {
    type: 'question',
    title: 'Ma question #2',
    value: undefined
  },
  {
    type: 'submit',
    title: 'Merci de votre participation'
  }
];


const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];


const {WIN_HEIGHT, WIN_WIDTH} = Dimensions.get('window');

class ExperimentQAScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dimensions: {},
      activeSlide: 0
    }

    this.submit = this.submit.bind(this);
  }

  submit() {
    console.log(this.state);

    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push('/experiment/connector/1');
  }

  Item = ({ type, title, value, icon, onSlidingComplete, onSubmit }) =>
    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', backgroundColor: 'transparent'}}>
      <View>
        <HeaderText_>Mon Graph #1</HeaderText_>
      </View>
      <VictoryChart
        height={this.state.dimensions.height/2}
        theme={VictoryTheme.material}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <VictoryAxis offsetY={50} />
        <VictoryLine
          style={{
            data: { stroke: "#222", strokeWidth: 1 }
          }}
          data={data}
          x="quarter"
          y="earnings"
          interpolation="monotoneX"
        />
        <VictoryScatter
          size={2}
          data={data}
          x="quarter"
          y="earnings"
          style={{ data: { fill: "#222" } }}
        />
      </VictoryChart>
      {typeof icon !== 'undefined' &&
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Icon type="Entypo" name={icon} style={{marginTop: 15}} fontSize={35} />
        </View>
      }
      {type === 'submit' &&
        <View style={{marginTop: 15, paddingLeft: 25, paddingRight: 25}}>
          <Button full success onPress={onSubmit}>
            <Icon name="checkmark-circle" />
            <Text>Valider</Text>
          </Button>
        </View>
      }
    </View>

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
        <Header>
          <Left>
            {/*<Button transparent>
              <Icon name="arrow-back" />
            </Button>*/}
          </Left>
          <Body>
            <Segment>
              <Button first><Text>A</Text></Button>
              <Button active><Text>M</Text></Button>
              <Button last><Text>S</Text></Button>
            </Segment>
          </Body>
          <Right>
            {/*<Button transparent>
              <Icon name="search" />
            </Button>*/}
          </Right>
        </Header>
        <Content>
          <Tabs renderTabBar={()=> <ScrollableTab />}>
            {/*<Icon name="camera" />*/}
            <Tab heading={ <TabHeading><Text>Bande Passante</Text></TabHeading>}>
            </Tab>
            <Tab heading={ <TabHeading><Text>Qualité du Signal</Text></TabHeading>}>
            </Tab>
            <Tab heading={ <TabHeading><Text>Données</Text></TabHeading>}>
            </Tab>
            <Tab heading={ <TabHeading><Text>Graph #1</Text></TabHeading>}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0
                }}
                onLayout={this.onLayout}
              >
                {this.state.dimensions.height && 
                  <View>
                    <Carousel
                      ref={(c) => { this._carousel = c; }}
                      data={_data}
                      firstItem={1}
                      enableMomentum={false}
                      enableSnap={true}
                      vertical={false}
                      inactiveSlideOpacity={0.7}
                      inactiveSlideScale={0.8}
                      sliderWidth={this.state.dimensions.width}
                      itemWidth={this.state.dimensions.width}
                      sliderHeight={this.state.dimensions.height}
                      itemHeight={this.state.dimensions.height}
                      onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                      renderItem={({item}) =>
                        <TouchableHighlight style={{padding: 25, justifyContent: 'center', alignContent: 'center'}}>
                          <View 
                            style={{
                              height: '100%',
                              width: '100%',
                              backgroundColor: 'transparent',
                              borderRadius: 5,
                            }}
                          >
                            <this.Item
                              type={item.type}
                              title={item.title}
                              value={item.value}
                              icon={item.icon}
                              onSlidingComplete={value => {
                                // @todo fix state
                                // this.setState({answer5: value})
                                this._carousel.snapToNext();
                              }}
                              onSubmit={this.submit}
                            />
                          </View>
                        </TouchableHighlight>
                      }
                    />
                  </View>}
              </View>
              <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    left: 0,
                    bottom: 0,
                    alignContent: 'center'
                  }}
              >
                <Pagination
                  vertical={false}
                  dotsLength={_data.length}
                  activeDotIndex={this.state.activeSlide}
                  containerStyle={{ backgroundColor: 'transparent' }}
                  dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.92)',
                  }}
                  inactiveDotStyle={{
                      // Define styles for inactive dots here
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
            </Tab>
            {/* add-to-list */}
            <Tab heading={ <TabHeading><Icon name="plus" type="Entypo" /></TabHeading> }>

            </Tab>
          </Tabs>
        </Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentQAScene);
