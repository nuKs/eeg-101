import React, { Component } from "react";
import {
  Text,
  Image,
  View,
} from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import config from "../../redux/config";
import Classifier from "../../native/Classifier";
import CleanButton from "../components/CleanButton";
import NoiseIndicator from "./NoiseIndicator";
import I18n from "../../i18n/i18n";
import * as colors from "../../styles/colors";

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
  return {
    noise: state.noise,
    connectionStatus: state.connectionStatus,
    notchFrequency: state.notchFrequency
  };
}

class ConnectorThree extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  click() {
    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push('/experiment/film');
  }


  componentDidMount() {
    if (this.props.connectionStatus === config.connectionStatus.CONNECTED) {
      Classifier.startClassifier(this.props.notchFrequency);
      Classifier.startNoiseListener();
    }
  }

  componentWillUnmount() {
    Classifier.stopNoiseListener();
  }

  renderNoiseIndicator() {
    if (this.props.noise.length >= 1) {
      return <NoiseIndicator noise={this.props.noise} height={80} width={80} />;
    }
    return (
      <Image
        source={require("../../assets/ok.png")}
        style={{ height: 60, width: 60 }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.instructions}>{I18n.t("museFitProperly")}</Text>
          <Text style={styles.body}>{I18n.t("fitInstructions")}</Text>
        </View>
        <View style={styles.indicatorContainer}>
          {this.renderNoiseIndicator()}
        </View>

        <View style={styles.buttonContainer}>
          <CleanButton onPress={this.click}>COMMENCER</CleanButton>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(ConnectorThree);

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      marginLeft: 40,
      marginRight: 40,
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

    indicatorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },

    buttonContainer: {
      flex: 1,
      margin: 40,
      marginTop: 10,
      justifyContent: "center"
    },

    logo: {
      width: 50,
      height: 50
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
