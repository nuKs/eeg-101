/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  ScrollView,
  Button,
  KeyboardAvoidingView
} from "react-native";
import styled from "styled-components";
import { Text, Tabs, Tab, TabHeading, Form, Input } from 'native-base';
import { Route, Switch, Redirect } from "react-router-native";

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import AwareModule from "./experiments/AwareModule";

// Bimslab
import DescriptiveText from './components/DescriptiveText';
import CleanButton from './components/CleanButton';
import LinearGradient from 'react-native-linear-gradient';

const WrapperLinearGradient = styled(LinearGradient)`
    /* center content */
    flex: 1;
  `;

const WrapperKeyboardAvoiding = styled(KeyboardAvoidingView)`
    /* center content */
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  `;

const ACTIVATION_PASSWORD = '4wc2uw';

class LoginScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      error: undefined,
      // Hide login screen until we're sure we user isn't already logged.
      showScreen: false
    }

    this.onLogin = this.onLogin.bind(this);
    this.onLogged = this.onLogged.bind(this);

    // 
    AsyncStorage.getItem('hasActivationPasswordBeenSet', (err, hasActivationPasswordBeenSet) => {
      if (err) {
        this.setState({
          error: 'Une erreur inconnue est survenue.',
          showScreen: true
        });
      }
      else if (hasActivationPasswordBeenSet === 'true') {
        this.onLogged();
      }
      else {
        // should not happen.
        this.setState({
          showScreen: true
        });
      }
    })
  }

  onLogged() {
    console.log("! AwareModule !", AwareModule);

    // Activate Aware
    AwareModule.startAware();

    // Jump to next screen
    this.props.history.push('/experiment');
  }

  onLogin(password) {
    if (password == ACTIVATION_PASSWORD) {
      AsyncStorage
        .setItem('hasActivationPasswordBeenSet', 'true', (err) => {
          if (err) {
            this.setState({
              error: 'Une erreur inconnue est survenue.'
            });
          }
          else {
            this.onLogged();
          }
        });
    }
    else {
      this.setState({
        error: 'Mot de passe erroné.'
      });
    }
  }

  // @todo set state change
  render() {
    // @todo move flatlist out of render fn
    return (
      <WrapperLinearGradient colors={['#EEE', '#FFF', '#FFF', '#FFF', '#EEE']} >
        {this.state.showScreen && <WrapperKeyboardAvoiding behavior="padding">
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}>
              <DescriptiveText>Entrez le mot de passe.</DescriptiveText>
              <DescriptiveText>qui vous a été fourni.</DescriptiveText>
            </View>
            {this.state.error && <View style={{ flex: 0, marginBottom: -21}}>
              <DescriptiveText color='red'>{this.state.error}</DescriptiveText>
            </View>}
            <View style={{ flex: 1, justifyContent: 'center', width: '100%', paddingLeft: 25, paddingRight: 25, minHeight: 100 }}>
              <Form>
                <Input secureTextEntry={true} autoCorrect={false} onChangeText={password => this.setState({password})} placeholder='Mot de passe' style={{borderBottomColor: '#AAA', borderBottomWidth: 1}}  />
              </Form>
            </View>
            <View style={{ flex: 1, width: '70%', justifyContent: 'flex-end'}}>
              <CleanButton icon="arrow-dropright-circle" onPress={e => this.onLogin(this.state.password)}>
                ACTIVATION
              </CleanButton>
            </View>
            <View style={{ flex: 1 }}></View>
          </WrapperKeyboardAvoiding>}
        </WrapperLinearGradient>
    );
  }
}

//      <WrapperLinearGradient>
//        <ScrollView style={{padding: 20}}>
//          <Text 
//            style={{fontSize: 27}}>
//            Login
//          </Text>
//          <TextInput onChange={password => this.setState({password})} placeholder='Password' />
//          <View style={{margin:7}} />
//          <Button 
//            disabled={!this.state.password}
//            onPress={onLogin.bind(undefined, this.state.password)}
//            title="Submit"
//          />
//        </ScrollView>
//      </WrapperLinearGradient>


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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScene);
