import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab } from 'native-base';
import { AppRegistry, StatusBar } from "react-native";
import styled from "styled-components";

import {
  NativeRouter,
  AndroidBackButton,
  Route,
  Redirect,
  Switch
} from "react-router-native";

import FooterMenuButton from "../src/bimslab/FooterMenuButton";
import ExperimentScene from "../src/bimslab/experiments/ExperimentScene";
import ExperimentQAScene from "../src/bimslab/experiments/ExperimentQAScene";
import ExperimentFilmScene from "../src/bimslab/experiments/ExperimentFilmScene";

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
      <Provider store={store}>
        <NativeRouter>
          <AndroidBackButton>
            <Container>
              {/*<StatusBar backgroundColor="blue" />*/}
              {/*<Header />*/}
              <Content_>
                <Switch>
                  <Route exact path="/" render={() => (
                    <Redirect to="/experiment" />
                  )}/>
                  <Route exact path="/experiment" component={ExperimentScene} />
                  <Route exact path="/experiment/qa" component={ExperimentQAScene} />
                  <Route exact path="/experiment/film" component={ExperimentFilmScene} />
                </Switch>
              </Content_>
              <Footer>
                <FooterTab>
                  <FooterMenuButton route="/" icon="add-circle">
                    Tests
                  </FooterMenuButton>
                  <FooterMenuButton route="/graphs" icon="pulse">
                    Graphes
                  </FooterMenuButton>
                  <FooterMenuButton route="/info" icon="list-box">
                    Info
                  </FooterMenuButton>
                  <FooterMenuButton route="/settings" icon="settings">
                    Réglages
                  </FooterMenuButton>
                </FooterTab>
              </Footer>
            </Container>
          </AndroidBackButton>
        </NativeRouter>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent("EEG101", () => EEG101);
