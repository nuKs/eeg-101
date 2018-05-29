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

const Menu = ({display}) => 
  display &&
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
  </Footer>;

export default connect(mapStateToProps, mapDispatchToProps)(Menu);