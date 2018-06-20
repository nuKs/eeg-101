/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View } from "react-native";
import styled from "styled-components";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Bimslab
import DescriptiveText from '../components/DescriptiveText';
import CleanButton from '../components/CleanButton';
import LinearGradient from 'react-native-linear-gradient';

const Wrapper_ = styled(LinearGradient)`
    /* center content */
    position: relative;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `;

// adjustsFontSizeToFit: true,
// numberOfLines: 2
// margin - bottom: 50;

class ExperimentScene extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // @todo optimize by moving out of render function
    let sentence1, sentence2, button;
    if (this.props.isExperimentEnabled) {
      sentence1 = "Le test est disponible.";
      button =  <CleanButton icon="arrow-dropright-circle" onPress={this.props.startExperiment.bind(this.props, this.props.history)}>
                  COMMENCER
                </CleanButton>;
    }
    else {
      sentence1 = "Le test n'est pas disponible pour le moment.";
      sentence2 = "Revenez plus tard.";
      button = undefined;
    }

    return (
      <Wrapper_ colors={['#EEE', '#FFF', '#FFF', '#FFF', '#EEE']} >
        <View style={{ position: 'absolute', top: 100 }}>
          <DescriptiveText>{sentence1}</DescriptiveText>
          {sentence2 && <DescriptiveText>{sentence2}</DescriptiveText>}
        </View>
        {button && 
          <View style={{ position: 'absolute', bottom: 80, width: '70%'}}>{button}</View>
        }
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
