/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View, Slider, FlatList } from "react-native";
import styled from "styled-components";
import { Text, Button } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { setGraphViewDimensions } from "../redux/actions";

import { Video } from "react-native-video";

const Wrapper_ = styled
  .View`
    /* center content */
    flex: 1;
    flex-direction: column;
    /* justify-content: center; */ 
    /* align-items: center; */
  `;
class ExperimentQAScene extends Component {
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
        <Video 
        source={{uri: 'http://localhost:3000/'}}
        
         style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
         }} />
      </Wrapper_>
         // source={{uri: "restingstate", mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version.
         // poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
         // rate={1.0}                   // 0 is paused, 1 is normal.
         // volume={1.0}                 // 0 is muted, 1 is normal.
         // muted={false}                // Mutes the audio entirely.
         // paused={false}               // Pauses playback entirely.
         // resizeMode="cover"           // Fill the whole screen at aspect ratio.
         // repeat={true}                // Repeat forever.
         // onLoadStart={this.loadStart} // Callback when video starts to load
         // onLoad={this.setDuration}    // Callback when video loads
         // onProgress={this.setTime}    // Callback every ~250ms with currentTime
         // onEnd={this.onEnd}           // Callback when playback finishes
         // onError={this.videoError}    // Callback when video cannot be loaded
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
