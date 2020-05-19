import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import Login from '../components/Login';
import Register from '../components/Register';

export default class Home extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Image
                        style={{ height: '28%', aspectRatio: 991 / 388, marginTop: '42%' }}
                        source={require('../assets/title.png')}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <Login style={styles.buttonStyle} navigate={() => this.props.navigation.navigate('LoginScreen')} />
                    <Register style={styles.buttonStyle} navigate={() => this.props.navigation.navigate('RegisterScreen')} />
                </View>
            </View>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#4f3976',
        justifyContent: 'center',
        alignContent: 'stretch',
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
        marginBottom:'10%',
    },
    buttonStyle: {
        width:'50%',
        aspectRatio: 921/231, 
        marginVertical:'3%'
    }
});

