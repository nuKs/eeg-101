/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View, Slider, FlatList } from "react-native";
import styled from "styled-components";
import { Text, Button, Icon } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import { setGraphViewDimensions } from "../redux/actions";
import {
  withRouter
} from "react-router-native";

const Wrapper_ = styled(View)`
    /* center content */
    flex: 1;
    flex-direction: column;
    /* justify-content: center; */ 
    /* align-items: center; */
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

class ExperimentQAScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      answer1: 0.5,
      answer2: 0.5,
      answer3: 0.5,
      answer4: 0.5,
      answer5: 0.5,
      answer6: 0.5,
      answer7: 0.5,
    }

    this.submit = this.submit.bind(this);
  }

  submit() {
    console.log(this.state);

    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push('/experiment/film');
  }

  // @todo set state change
  render() {
    // @todo move flatlist out of render fn
    return (
      <Wrapper_>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Indiquez la sévérité de vos symptomes.</HeaderText_>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #1</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer1} style={{flex: 1}} onChange={evt => this.setState({answer1: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #2</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer2} style={{flex: 1}} onChange={evt => this.setState({answer2: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #3</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer3} style={{flex: 1}} onChange={evt => this.setState({answer3: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #4</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer4} style={{flex: 1}} onChange={evt => this.setState({answer4: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #5</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer5} style={{flex: 1}} onChange={evt => this.setState({answer5: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #6</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer6} style={{flex: 1}} onChange={evt => this.setState({answer6: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <HeaderText_>Ma question #7</HeaderText_>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
            <Slider value={this.state.answer7} style={{flex: 1}} onChange={evt => this.setState({answer7: evt.target.value})} />
            <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Button full success onPress={this.submit}>
            <Icon name="checkmark-circle" />
            <Text>Valider</Text>
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentQAScene);
