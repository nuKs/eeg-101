/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { Platform, View, Slider, FlatList } from "react-native";
import styled from "styled-components";
import { Text, Button } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { setGraphViewDimensions } from "../redux/actions";

import Video from "react-native-video";

const Wrapper_ = styled(View)`
    /* center content */
    position: relative;
    flex: 1;
    flex-direction: column;
    /* justify-content: center; */ 
    /* align-items: center; */
  `;
class ExperimentFilmScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }


  // @todo set state change
  render() {
    // @todo move flatlist out of render fn
    return (
      <Wrapper_>
        {/* doc: https://github.com/react-native-community/react-native-video */}
        {/* @note resizeMode cover could be stretched instead */}
        <Video 
          source={Platform.OS === 'ios' ? {uri: 'resting-state'} : require('../../assets/resting-state.mp4')}
          volume={0.0}                 // 0 is muted, 1 is normal.
          paused={false}
          onEnd={e => console.log('onEnd')}           // Callback when playback finishes
          onError={e => console.error('onError', e)}    // Callback when video cannot be loaded
          resizeMode="cover"

          style={{
           position: 'absolute',
           top: 0,
           left: 0,
           bottom: 0,
           right: 0
          }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentFilmScene);
