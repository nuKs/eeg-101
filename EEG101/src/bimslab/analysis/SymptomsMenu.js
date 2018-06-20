/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View, FlatList } from "react-native";
import { ListItem } from 'react-native-elements';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from 'react-router-native';

import CleanButton from '../components/CleanButton';

class SymptomsMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menu: [
        { key: 'Satisfaction', checkmark: false },
        { key: 'Fonctionnement', checkmark: false },
        { key: 'Stigma', checkmark: false },
        { key: 'Social', checkmark: false },
        { key: 'Sommeil', checkmark: false },
        { key: 'Stress', checkmark: false },
        { key: 'Irritabilité', checkmark: false },
        { key: 'Mort', checkmark: false },
        { key: 'Fatigue', checkmark: false },
        { key: 'Sensoriel', checkmark: false },
        { key: 'Croyance', checkmark: false },
        { key: 'Motivation', checkmark: false },
        { key: 'Spontanéité', checkmark: false },
        { key: 'Cannabis', checkmark: false },
        { key: 'Alcool', checkmark: false },
        { key: 'Apparence', checkmark: false },
        { key: 'Moteur', checkmark: false },
        { key: 'Tristesse', checkmark: false },
        { key: 'Anxiété', checkmark: false },
      ]
    }

  }

  Item = ({item}) =>
    <ListItem
      key={item.key}
      title={item.key}
      leftIcon={{ name: item.icon }}
      chevron={false}
      checkmark={item.checkmark}
      checkmarkColor="green"
      onPress={e => this.onPress(item)}
    />
    // checkBox={{}}

  onPress = (item) => {
    this.setState((prevState) => {
      // @warning required to clone prevState.menu first to avoid side effect
      // @note FlatList is pure component, we need to change state.menu obj id
      // for it to reload as well

      let menu = prevState.menu.slice(0);
      let idx = menu.indexOf(item);
      menu[idx].checkmark = !menu[idx].checkmark;
      console.log(idx, menu);

      return {
        ...prevState,
        menu
      };
    })

    console.log('PRESSED', item);
  }

  onSubmit = () => {
    console.log('SUBMIT');
    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push(`/analysis/symptoms/a`);
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.menu}
          renderItem={this.Item}
        >
        </FlatList>
        <View style={{ paddingTop: 0, paddingRight: 30, paddingBottom: 15, paddingLeft: 30 }} >
          <CleanButton onPress={this.onSubmit}>
            VOIR
          </CleanButton>
        </View>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SymptomsMenu));
