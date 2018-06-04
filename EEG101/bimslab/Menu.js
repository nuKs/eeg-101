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
import { Footer, FooterTab } from 'native-base';
import FooterMenuButton from "../src/bimslab/FooterMenuButton";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  display: !state.isExperimentOngoing
});
const mapDispatchToProps = dispatch => ({
});

// bar-graph / Entypo

const Menu = ({display}) => 
  display &&
  <Footer>
    <FooterTab>
      <FooterMenuButton route="/" icon="ios-add-circle-outline">
        Tests
      </FooterMenuButton>
      <FooterMenuButton route="/graphs" icon="ios-pulse-outline">
        Data 
        {/*ios-options-outline ios-options*/}
      </FooterMenuButton>
      {/*<FooterMenuButton route="/usage" icon="ios-information-circle-outline">
        Usage
      </FooterMenuButton>*/}
      <FooterMenuButton route="/info" icon="ios-list-box-outline">
        Info
      </FooterMenuButton>
      <FooterMenuButton badge={2} route="/notification" icon="ios-text-outline">
        Notifs
      </FooterMenuButton>
      {/*
      <FooterMenuButton route="/settings" icon="settings">
        Réglages
      </FooterMenuButton>
      */}
    </FooterTab>
  </Footer>;

export default connect(mapStateToProps, mapDispatchToProps)(Menu);