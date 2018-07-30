/**
 * Scene component used as a route in the index file.
 **/

// React-native
import React, { Component } from 'react';
import { View, Slider, FlatList, TouchableHighlight, Dimensions } from "react-native";
import styled from "styled-components";
import { Text, Button, Icon } from 'native-base';

// Redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { storeQuestionnaire } from './actions.js';
import CleanButton from '../components/CleanButton';

import questionnaire from './Questionnaire';
import QuestionnaireAnswers from './QuestionnaireAnswers';

const Wrapper_ = styled(View)`
    /* center content */
    flex: 1;
    flex-direction: row;
    background-color: white; /*#EFEFEF*/
    /* justify-content: center; */ 
    /* align-items: center; */
  `;
const HeaderText_ = styled(Text)
  .attrs({
    adjustsFontSizeToFit: true,
    numberOfLines: 4
  })`
    font-size: 15;
    text-align: center;

    /* for some reason padding alone doesn't work inside styled-components.. */
    padding-left: 10;
    padding-right: 10;

    color: #222;
  `;

class ExperimentQAScene extends Component {
  constructor(props) {
    super(props)

    let questions = questionnaire.getQuestions();

    // Init Carousel API's data list based on question list
    let data = [
      // header
      {
        type: 'text',
        title: "Indiquez la sévérité de vos symptomes pour aujourd'hui uniquement.",
        icon: 'chevron-down'
      },
      // list
      ...(questions
        .filter(q => !!q.shown)
        .map(q => ({
          type: 'question',
          questionId: q.id,
          title: q.text,
          value: undefined,
        }))),
      // footer
      {
        type: 'submit',
        title: ""
      }
    ];

    this.state = {
      dimensions: {},
      activeSlide: 0,
      data: data
    }

    this.submit = this.submit.bind(this);
  }

  submit() {
    console.log(this.state);

    try {
      // Store questionnaire online
      let values = this.state.data
        .filter(d => d.type === 'question')
        .map(d => ({
          questionId: d.questionId,
          value: d.value
        }));
      let answers = new QuestionnaireAnswers(Date.now(), questionnaire, values);
      QuestionnaireAnswers.store(answers);

      // send redux event - form filled !
      // this.props.storeQuestionnaire(this.state.data);
    }
    catch (e) {
      console.error('exception while storing questionnaire.', e);
    }

    // Either
    // - Submit questionnaire here.
    // or
    // - Register event to submit
    // or
    // - Develop a model
    // 
    // 2 backstates
    // - app/redux state for content display / module interaction etc.
    //   propagate view reload on state change
    // - backend state (w/ inner cache mechanism - for large dataset)
    //   handles large amount of data
    // 
    // redux = view state
    // frontend db = backend state

    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push('/experiment/connector/1');
  }

  Item = ({ id, type, title, value, icon, onSlidingComplete, onSubmit }) =>
    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'transparent'}}>
      <HeaderText_>{title}</HeaderText_>
      {type === 'question' &&
        <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
          <Slider value={typeof value === 'undefined' ? 0.5 : value} style={{flex: 1}} onSlidingComplete={ v => onSlidingComplete(v, id) } />
          <Text style={{padding: 20, justifyContent: 'center'}}>+</Text>
        </View>
      }
      {typeof icon !== 'undefined' &&
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Icon type="Entypo" name={icon} style={{marginTop: 15}} fontSize={35} />
        </View>
      }
      {type === 'submit' &&
        <View style={{marginTop: 15, paddingLeft: 25, paddingRight: 25}}>
          <CleanButton onPress={onSubmit} icon="checkmark-circle">
            VALIDER
          </CleanButton>
        </View>
      }
    </View>

  onLayout = event => {
    // if (this.state.dimensions) return // layout was already called
    let {width, height} = event.nativeEvent.layout;

    // prevent list slowdown / reloading.
    // @warniong this primary check up may cause synchronicity issues as the 
    // state dimensions comparison is based on the current state at the moment 
    // instead of the latest async state on the setState pipe. It's unlikely to
    // happen though.
    if (!this.state.dimensions || width !== this.state.dimensions.width || height !== this.state.dimensions.height) {
      this.setState({dimensions: {width, height}})
    }
  }

  renderItem = ({item, index}) =>
    <TouchableHighlight style={{padding: 25, justifyContent: 'center', alignContent: 'center'}}>
      <View 
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'transparent',
          borderRadius: 5,
        }}
      >
        <this.Item
          id={item.questionId}
          type={item.type}
          title={item.title}
          value={item.value}
          icon={item.icon}
          onSlidingComplete={(value, questionId) => {
            this.setState(previousState => {
              // clone the array synchronously to avoid side
              // effects.
              let newData = previousState.data.slice(0);

              // change the value.
              newData[index].value = value;

              // set new state.
              return {
                ...previousState,
                data: newData
              }
            });
            // this.setState({answer5: value})
            this._carousel.snapToNext();
          }}
          onSubmit={this.submit}
        />
      </View>
    </TouchableHighlight>

  setCarouselRef = (c) => {
    this._carousel = c;
  }

  onSnapToItem = (index) => this.setState({ activeSlide: index })

  // @todo set state change
  render() {
    // @todo move flatlist out of render fn
    return (
      <Wrapper_>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
          }}
          onLayout={this.onLayout}
        >
          {this.state.dimensions.height && 
            <View>
              <Carousel
                ref={this.setCarouselRef}
                data={this.state.data}
                firstItem={1}
                enableMomentum={false}
                enableSnap={true}
                vertical={true}
                inactiveSlideOpacity={0.7}
                inactiveSlideScale={0.9}
                sliderWidth={this.state.dimensions.width}
                itemWidth={this.state.dimensions.width}
                sliderHeight={this.state.dimensions.height}
                itemHeight={this.state.dimensions.height / 3}
                onSnapToItem={this.onSnapToItem}
                renderItem={this.renderItem}
              />
            </View>}
        </View>
        <View
            style={{
              position: 'absolute',
              right: -15,
              top: 20,
              bottom: 0,
              justifyContent: 'center'
            }}
        >
          <Pagination
            vertical={true}
            dotsLength={this.state.data.length}
            activeDotIndex={this.state.activeSlide}
            containerStyle={{ backgroundColor: 'transparent' }}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotStyle={{
                // Define styles for inactive dots here
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
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
      storeQuestionnaire
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentQAScene);
