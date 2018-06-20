import React, { Component } from "react";
import { Text, View, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../../redux/config";
import ConnectorWidget from "./ConnectorWidget";
import I18n from "../../i18n/i18n";
import * as colors from "../../styles/colors";
import { setOfflineMode, initNativeEventListeners } from "../../redux/actions";

import DescriptiveText from '../components/DescriptiveText';
import CleanButton from '../components/CleanButton';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    isOfflineMode: state.isOfflineMode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setOfflineMode,
      initNativeEventListeners
    },
    dispatch
  );
}

class ConnectorTwo extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  componentDidMount() {
    this.requestLocationPermission();
    this.props.initNativeEventListeners();
  }

  // Checks if user has enabled coarse location permission neceessary for BLE function
  // If not, displays request popup
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: I18n.t("needsPermission"),
          message: I18n.t("requiresLocation")
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }


  renderButton() {
    if (
      this.props.connectionStatus === config.connectionStatus.CONNECTED
    ) {
      return (
        <CleanButton onPress={this.click}>
          SUIVANT
        </CleanButton>
      );
    } else return (
        <CleanButton onPress={() => null} disabled={true}>
          SUIVANT
        </CleanButton>
      );
  }

  click() {
    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push('/experiment/connector/3');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <DescriptiveText>
            Veuillez connecter votre appareil EEG.
          </DescriptiveText>
        </View>
        <ConnectorWidget />
        <View style={styles.buttonContainer}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ConnectorTwo);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      margin: 20,
      color: colors.black,
      textAlign: "center"
    },

    instructions: {
      fontFamily: "Roboto-Bold",
      fontSize: 18,
      margin: 20,
      color: colors.black,
      textAlign: "center"
    },

    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "stretch",
      width: null,
      height: null,
      // backgroundColor: colors.skyBlue
    },

    buttonContainer: {
      flex: 1,
      margin: 40,
      justifyContent: "center"
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: colors.black,
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    titleBox: {
      flex: 3,
      alignItems: "center",
      justifyContent: "center"
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      body: {
        fontSize: 20,
        marginLeft: 50,
        marginRight: 50
      },

      instructions: {
        fontSize: 30
      }
    }
  }
);
