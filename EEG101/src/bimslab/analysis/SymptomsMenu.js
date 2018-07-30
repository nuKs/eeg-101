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
import questionnaire from '../experiments/Questionnaire';

class SymptomsMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
        // Generate list from questions.
        menu: questionnaire
            .getQuestions()
            .filter(q => !!q.shown)
            .map(q => ({
              key: q.id,
              questionId: q.id,
              title: q.title,
              checkmark: false
            }))
    }
  }

  Item = ({item}) =>
    <ListItem
      key={item.questionId}
      title={item.title}
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
      // console.log(idx, menu);

      return {
        ...prevState,
        menu
      };
    })

    // console.log('PRESSED', item);
  }

  onSubmit = () => {
    console.log('SUBMIT');
    // Go to location w/ selected symptoms as parameter.
    // 1. retrieve selected symptoms from state
    let selectedQuestionIds = this.state
      .menu
      .filter(q => !!q.checkmark)
      .map(q => q.questionId)
      ;

    // 2. `geq-bcd-geaqg-eqg,ada-geqgqeg-fqef,...`
    let processedUrl = '/analysis/symptoms/' + encodeURIComponent(selectedQuestionIds.join(','));

    // 3. go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push(processedUrl);
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
