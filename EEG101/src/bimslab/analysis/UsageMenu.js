/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { FlatList } from "react-native";
import { ListItem } from 'react-native-elements';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  withRouter
} from "react-router-native";

class UsageMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }



  menu = [
    { key: 'Bande passante utilisée' },
    { key: 'Qualité du signal de l\'EEG' },
    { key: 'Taux de participation' },
  ]

  Item = ({item}) =>
    <ListItem
      key={item.key}
      title={item.key}
      leftIcon={{ name: item.icon }}
      chevron={true}
      onPress={() => this.onPress(item.key)}
    />

  onPress(itemKey) {
    console.log('PRESSED', `${this.props.match.url}/${itemKey}`);
    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push(`/analysis/usage/a`);
  }

  render() {
    return (
      <FlatList
        data={this.menu}
        renderItem={this.Item}
      >
      </FlatList>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UsageMenu));
