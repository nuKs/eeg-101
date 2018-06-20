import React from 'react';
import { TouchableOpacity, View } from "react-native";
import { Text } from "native-base";

const CleanButton = ({onPress, children, icon}) => (
    <TouchableOpacity
        style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#777',
            borderRadius: 5,
            backgroundColor: 'transparent',
            // backgroundColor: '#00000002',
        }}
        onPress={onPress}
    >   
        <View
        style={{
            padding: 15,
            width: '100%',
        }}>
            <Text style={{
                textAlign: 'center',
                fontWeight: '400',
                fontSize: 14,
                color: '#555',
                fontFamily: 'Roboto-thin',
                letterSpacing: 0
            }}>
                {children}
            </Text>
        </View>
        {/* {icon || ''} */}
    </TouchableOpacity>
);

export default CleanButton;