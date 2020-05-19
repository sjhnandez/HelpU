import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const addimg = props => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={props.style}
        onPress= {props.pickimg}>
            <Image 
                style = {props.style}
                source={props.img}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
};

export default addimg;