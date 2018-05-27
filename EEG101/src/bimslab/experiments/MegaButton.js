import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import { Icon, Text } from 'native-base';

const MegaButton =
  ({ 
    disabled = false,
    icon,
    children,
    onPress
  }) => 
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
  >
    <View style={{
      flex: 0,
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Icon name={icon} style={{fontSize: 140, color: !disabled ? '#327CFC' : 'red'}}/>
      <Text>{children}</Text>
    </View>
  </TouchableOpacity>

export default MegaButton;