import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import Login from '../components/Login';
import Register from '../components/Register';

export default class Home extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={{color:'#ffffff'}}>
                    I am a chat screen!
                </Text>
            </View>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#4f3976',
        justifyContent:'center',
        alignItems:'center',
    },
    topContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: '10%',
    },
    buttonStyle: {
        width: '50%',
        aspectRatio: 921 / 231,
        marginVertical: '3%'
    }
});

