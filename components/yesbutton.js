import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const yesbutton = props => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={props.style}
        onPress= {props.navigate}>
            <Image 
                style = {{ flex: 1, height: undefined, width: undefined }}
                source={require('../assets/yes.png')}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
};

export default yesbutton;