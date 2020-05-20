import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const Message = props => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={props.style}
        onPress= {props.messageVolunteer}>
            <Image 
                style = {{ flex: 1, height: undefined, width: undefined }}
                source={require('../assets/messageIcon.png')}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
};

export default Message;