import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const Call = props => {
    return (
        <TouchableOpacity activeOpacity={0.5} style={props.style}
        onPress= {props.callVolunteer}>
            <Image 
                style = {{ flex: 1, height: undefined, width: undefined }}
                source={require('../assets/callIcon.png')}
                resizeMode='stretch'
            />
        </TouchableOpacity>
    );
};

export default Call;