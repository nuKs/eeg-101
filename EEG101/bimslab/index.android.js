import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import { View, AppRegistry, StatusBar } from "react-native";
import styled from "styled-components";

import { NativeRouter, AndroidBackButton, Route, Redirect, Switch } from "react-router-native";

import ExperimentScene from "../src/bimslab/experiments/ExperimentScene";
import ExperimentQAScene from "../src/bimslab/experiments/ExperimentQAScene";
import ExperimentFilmScene from "../src/bimslab/experiments/ExperimentFilmScene";
import ExperimentEndScene from "../src/bimslab/experiments/ExperimentEndScene";
// import ExperimentConnector1Scene from "../src/bimslab/experiments/ExperimentConnector1Scene";
import ExperimentConnector2Scene from "../src/bimslab/experiments/ExperimentConnector2Scene";
import ExperimentConnector3Scene from "../src/bimslab/experiments/ExperimentConnector3Scene";
import AnalysisRootScene from "../src/bimslab/analysis/AnalysisRootScene";
import AnalysisRootMenu from "../src/bimslab/analysis/AnalysisRootMenu";
import Menu from "./Menu";
// Create store
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducer from "../src/bimslab/experiments/reducer";
import thunk from "redux-thunk";
const store = createStore(reducer, applyMiddleware(thunk));

// Set business rules
import enforceScheduleForExperiment from "../src/bimslab/experiments/enforce-schedule-for-experiment";
store.dispatch(enforceScheduleForExperiment());

// Disable in-app errors
console.disableYellowBox = true;

// Style container to allow content to be centered
const Content_ = styled(Content)
  .attrs({
    // contentContainerStyle -- https://github.com/GeekyAnts/NativeBase/issues/1336
    contentContainerStyle: { flexGrow: 1 }
  })`
    flex: 1;
  `;

// @todo sync redux<->router

// uses ionicons from https://ionicframework.com/docs/ionicons/
export default class EEG101 extends Component {
  render() {
    return (
      <StyleProvider style={getTheme()}>
        <Provider store={store}>
          <NativeRouter>
            {/*<View style={{flex: 1}}>*/}
            <AndroidBackButton>
              <StatusBar backgroundColor="black" />
              <Container>
                <Switch>
                  <Route path="/analysis" component={AnalysisRootMenu} />
                </Switch>
                <Content_>
                  <Switch>
                    <Route exact path="/" render={() => (
                      <Redirect to="/analysis" />
                    )}/>
                    <Route exact path="/experiment" component={ExperimentScene} />
                    <Route exact path="/experiment/qa" component={ExperimentQAScene} />
                    <Route exact path="/experiment/connector/1" render={() => (
                      <Redirect to="/experiment/connector/2" />
                    )} />
                    <Route exact path="/experiment/connector/2" component={ExperimentConnector2Scene} />
                    <Route exact path="/experiment/connector/3" component={ExperimentConnector3Scene} />
                    <Route exact path="/experiment/film" component={ExperimentFilmScene} />
                    <Route exact path="/experiment/end" component={ExperimentEndScene} />
                    <Route path="/analysis" component={AnalysisRootScene} />
                  </Switch>
                </Content_>
                <Menu />
              </Container>
            </AndroidBackButton>
            {/*</View>*/}
          </NativeRouter>
        </Provider>
      </StyleProvider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent("EEG101", () => EEG101);
