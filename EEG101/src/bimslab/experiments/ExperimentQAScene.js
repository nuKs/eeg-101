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
import CleanButton from '../components/CleanButton';

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
let _data = [
  {
    type: 'text',
    title: "Indiquez la sévérité de vos symptomes pour aujourd'hui uniquement.",
    icon: 'chevron-down'
  },
  {
    type: 'question',
    title: "Êtes vous insatisfait de votre journée?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous eu de la difficulté à accomplir vos tâches efficacemment?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vu pensé être moins respectable en raison de votre problème de santé mentale?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous beaucoup parlé ou communiqué avec d'autres personnes ? ",
    value: undefined
  },
  {
    type: 'question',
    title: "La nuit passée, quelle a été la qualité de votre sommeil?",
    value: undefined
  },
  {
    type: 'question',
    title: "Vous êtes vous senti stressé par divers événements?",
    value: undefined
  },
  {
    type: 'question',
    title: "Vous êtes vous senti irritable?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous beaucoup pensé à la mort?",
    value: undefined
  },
  {
    type: 'question',
    title: "Vous êtes vous senti fort fatigué?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous vu ou entendu des choses que d'autres personnes ne peuvent voir ou entendre?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous pensé avoir des pouvoirs spéciaux, ou d'être sous le contrôle d'une force extérieure?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous trouvé difficile d'être motivé à commencer des activités ? ",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous eu le sentiment de manquer de spontanéité?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous consommé beaucoup de cannabis?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous consommé beaucoup d'alcool?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous eu l'impression que d'autres personnes vous regardaient bizarrement en raison de votre habillement?",
    value: undefined
  },
  {
    type: 'question',
    title: "Avez vous parlé ou bougé plus lentement qu'à l'habitude?",
    value: undefined
  },
  {
    type: 'question',
    title: "Vous êtes vous senti triste?",
    value: undefined
  },
  {
    type: 'question',
    title: "Vous êtes vous senti anxieux ou nerveux?",
    value: undefined
  },
  {
    type: 'submit',
    title: ""
  }
];

const {WIN_HEIGHT, WIN_WIDTH} = Dimensions.get('window');

class ExperimentQAScene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      answer1: 0.5,
      answer2: 0.5,
      answer3: 0.5,
      answer4: 0.5,
      answer5: 0.5,
      answer6: 0.5,
      answer7: 0.5,
      dimensions: {},
      activeSlide: 0
    }

    this.submit = this.submit.bind(this);
  }

  submit() {
    console.log(this.state);

    // go to location 
    // @warning router is not fully sync w/ redux!
    this.props.history.push('/experiment/connector/1');
  }

  Item = ({ type, title, value, icon, onSlidingComplete, onSubmit }) =>
    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'transparent'}}>
      <HeaderText_>{title}</HeaderText_>
      {type === 'question' &&
        <View style={{flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Text style={{padding: 20, justifyContent: 'center'}}>-</Text>
          <Slider value={typeof value === 'undefined' ? 0.5 : value} style={{flex: 1}} onSlidingComplete={onSlidingComplete} />
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
    this.setState({dimensions: {width, height}})
  }

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
                ref={(c) => { this._carousel = c; }}
                data={_data}
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
                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                renderItem={({item}) =>
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
                        type={item.type}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        onSlidingComplete={value => {
                          // @todo fix state
                          // this.setState({answer5: value})
                          this._carousel.snapToNext();
                        }}
                        onSubmit={this.submit}
                      />
                    </View>
                  </TouchableHighlight>
                }
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
            dotsLength={_data.length}
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
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentQAScene);
