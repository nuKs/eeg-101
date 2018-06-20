/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View, Slider, FlatList, TouchableHighlight, Dimensions } from "react-native";
import { Text, Button, Icon, Tabs, Tab, TabHeading, ScrollableTab, Header, Left, Body, Right, Segment, Content } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class AnalysisRootMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  // @todo set state change
  render() {
    // @todo move flatlist out of render fn
    return (<View />);
    
    // return (
    //   <Header hasTabs hasSegment>
    //     <Left>
    //       {/*<Button transparent>
    //         <Icon name="arrow-back" />
    //       </Button>*/}
    //     </Left>
    //     <Body>
    //       {/* <Segment>
    //         <Button first><Text>A</Text></Button>
    //         <Button active><Text>M</Text></Button>
    //         <Button last><Text>S</Text></Button>
    //       </Segment> */}
    //     </Body>
    //     <Right>
    //       {/*<Button transparent>
    //         <Icon name="search" />
    //       </Button>*/}
    //     </Right>
    //   </Header>
    // );
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisRootMenu);
