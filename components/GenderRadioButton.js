import React from 'react';
import RadioForm from 'react-native-simple-radio-button';
import View from 'react-native';

var radio_props = [
    { label: 'Masculino', value: 0 },
    { label: 'Femenino', value: 1 }
];

state = {
    value: 0,
};


export default class genderbutton extends React.Component{
    render() {
        return (
            <View>
                <RadioForm
                    radio_props={radio_props}
                    initial={0}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    animation={true}
                    onPress={(value) => { this.setState({ value: value }) }}
                />
            </View>
        );
    }
}
