import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { MediaQueryStyleSheet }  from 'react-native-responsive';
import config from '../redux/config';
import LinkButton from '../components/LinkButton';
import PopUp from '../components/PopUp';
import PopUpLink from '../components/PopUpLink';
import I18n from '../i18n/i18n';

//Interfaces. For elements that bridge to native
import PSDGraphView from '../interface/PSDGraphView';

// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function  mapStateToProps(state) {
  return {
    dimensions: state.graphViewDimensions,
    connectionStatus: state.connectionStatus,
  };
}

class SlideEight extends Component {
  constructor(props) {
    super(props);

    // Initialize States
    this.state = {
      popUp1Visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <PSDGraphView dimensions={this.props.dimensions} />

        <Text style={styles.currentTitle}>{I18n.t('PSDSlideTitle')}</Text>

        <ViewPagerAndroid //Allows us to swipe between blocks
          style={styles.viewPager}
          initialPage={0}>


          <View style={styles.pageStyle}>
            <Text style={styles.header}>{I18n.t('powerSpectralDesnity')}</Text>
            <Text style={styles.body}>
			  {I18n.t('whenWeApplyFourier')}<PopUpLink onPress={() => this.setState({popUp1Visible: true})}>{I18n.t('powerLink')}</PopUpLink>.
			</Text>
            <LinkButton path='/slideNine'>{I18n.t('nextLink')}</LinkButton>
          </View>

        </ViewPagerAndroid>

        <PopUp onClose={() => this.setState({popUp1Visible: false})} 
		  visible={this.state.popUp1Visible}
          title={I18n.t('powerTitle')}
		>
	      {I18n.t('powerDescription')}
        </PopUp>

        <PopUp
          onClose={()=>this.props.history.push('/connectorOne')}
          visible={
            this.props.connectionStatus === config.connectionStatus.DISCONNECTED
          }
          title={I18n.t('museDisconnectedTitle')}
        >
			{I18n.t('museDisconnectedDescription')}
        </PopUp>
      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create(
  // Base styles
  {
    currentTitle: {
      marginLeft: 20,
      marginTop: 10,
      fontSize: 13,
      fontFamily: 'Roboto-Medium',
      color: '#6CCBEF',
    },

    body: {
      fontFamily: 'Roboto-Light',
      color: '#484848',
      fontSize: 17,
    },

    container: {

      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },

    graphContainer: {
      backgroundColor: 'white',
      flex: 4,
      justifyContent: 'center',
      alignItems: 'stretch',
    },

    header: {
      fontFamily: 'Roboto-Bold',
      color: '#484848',
      fontSize: 20,
    },

    viewPager: {
      flex: 4,
    },

    pageStyle: {
      padding: 20,
      alignItems: 'stretch',
      justifyContent: 'space-around',
    },

    image: {
      flex: 1,
      width: null,
      height: null,
    },
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {

      viewPager: {
        flex: 3,
      },

      header: {
        fontSize: 30,
      },

      currentTitle: {
        fontSize: 20,
      },

      body: {
        fontSize: 25,
      }
    }
  }
);

export default connect(mapStateToProps)(SlideEight);
