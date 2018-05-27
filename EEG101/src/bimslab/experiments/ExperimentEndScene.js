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

class ExperimentEndScene extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Wrapper_>
        <View>
          <HeaderText_>Merci à vous</HeaderText_>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentEndScene);
