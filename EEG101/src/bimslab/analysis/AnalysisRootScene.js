/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View } from "react-native";
import styled from "styled-components";
import { Text, Tabs, Tab, TabHeading } from 'native-base';
import { Route, Switch, Redirect } from "react-router-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import UsageMenu from './UsageMenu';
import SymptomsMenu from './SymptomsMenu';
import Graph from './Graph';
import SymptomsGraph from './SymptomsGraph';

const Wrapper_ = styled(View)`
    /* center content */
    flex: 1;
    flex-direction: column;
    background-color: white; /*#EFEFEF*/
    /* justify-content: center; */ 
    /* align-items: center; */
  `;

  class AnalysisRootScene extends Component {
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
        {/* renderTabBar={()=> <ScrollableTab />} */}
        <Route exact path="/analysis" render={() => (
          <Redirect to="/analysis/usage" />
        )}/>
        <Route path="/analysis">{({ match, location }) => 
          // tabBarUnderlineStyle
          <Tabs
            locked={true}
            page={
              !match ? 0 :
              location.pathname.startsWith('/analysis/usage') ? 0 : 
              location.pathname.startsWith('/analysis/symptoms') ? 1 :
              0
            }
            onChangeTab={({i}) => {
              this.props.history.push(i === 0 ? '/analysis/usage' : i === 1 ? '/analysis/symptoms' : '?');
            }}
          >
            {/*<Icon name="camera" />*/}
            <Tab heading={ <TabHeading><Text>Usage</Text></TabHeading> }>
              <Switch>
                <Route exact path="/analysis/usage/a" component={() => <Graph/>} />
                <Route path="/analysis">
                  {({}) => <UsageMenu />}
                </Route>
              </Switch>
            </Tab>
            <Tab heading={ <TabHeading><Text>Symptomes</Text></TabHeading> }>
              <Switch style={{ flex: 1 }}>
                <Route exact path="/analysis/symptoms/a" component={() => <SymptomsGraph />} />
                <Route path="/analysis">
                  {({}) => <SymptomsMenu />}
                </Route>
              </Switch>
            </Tab>
          </Tabs>
        }</Route>
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisRootScene);
