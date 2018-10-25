import React from 'react';
import { View } from "react-native";
import { Text } from "native-base";

const DescriptiveText = ({children, ...props}) => (
    <View>
        <Text {...props} style={{ color: props.color || '#444', fontFamily: 'Roboto', fontWeight: '400', textAlign: 'center' }}>
            {children}
        </Text>
    </View>
);

export default DescriptiveText;