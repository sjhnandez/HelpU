import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const nobutton = props => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={props.style}
        onPress= {props.navigate}>
            <Image 
                style = {{ flex: 1, height: undefined, width: undefined }}
                source={require('../assets/no.png')}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
};

export default nobutton;