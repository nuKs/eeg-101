/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View } from "react-native";
import styled from "styled-components";
import { Text } from 'native-base';
import {
  withRouter
} from "react-router-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { setGraphViewDimensions } from "../redux/actions";

// Bimslab
import MegaButton from './MegaButton';

const Wrapper_ = styled
  .View`
    /* center content */
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `;
const HeaderText_ = styled(Text)
  .attrs({
    adjustsFontSizeToFit: true,
    numberOfLines: 2
  })`
    font-size: 30;
    margin-bottom: 50;
    text-align: center;

    /* for some reason padding alone doesn't work inside styled-components.. */
    padding-left: 10;
    padding-right: 10;
  `;

class ExperimentScene extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // @todo optimize by moving out of render function
    let sentence, button;
    if (this.props.isExperimentEnabled) {
      sentence = "Le test est disponible jusqu'à 21h";
      button =  <MegaButton icon="arrow-dropright-circle" onPress={this.props.startExperiment.bind(this.props, this.props.history)}>
                  Commencer maintenant
                </MegaButton>;
    }
    else {
      sentence = "Merci de compléter le test entre 18 et 21h";
      button = <MegaButton icon="close" disabled={true}></MegaButton>;
    }

    return (
      <Wrapper_>
        <View>
          <HeaderText_>{sentence}</HeaderText_>
          {button}
        </View>
      </Wrapper_>
    );
  }
}

// Bind redux store to react component
function mapStateToProps(state) {
  return {
    isExperimentEnabled: state.isExperimentEnabled,
    isExperimentOngoing: state.isExperimentOngoing
  };
}

// @todo move to redux/actions.js
// @todo make this 
const startExperiment = (history) => {
  // go to location 
  // @warning router is not fully sync w/ redux!
  history.push('/experiment/qa');

  // return action
  return { type: 'START_EXPERIMENT' };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      startExperiment
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentScene);
