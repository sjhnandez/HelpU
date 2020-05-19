import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const omg = props => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={props.style}
        onPress= {props.setEmotion}>
            <Image 
                style = {{ flex: 1, height: undefined, width: undefined }}
                source={require('../assets/emojibutton6.png')}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
};

export default omg;