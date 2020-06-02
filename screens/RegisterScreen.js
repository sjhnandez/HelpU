import React from 'react';
import { StyleSheet, View, Image, Dimensions, ImageBackground, TextInput, Alert, Text } from 'react-native';
import Firebase, { db } from '../config/Firebase';
import Register from '../components/Register';
import { CommonActions } from '@react-navigation/native';
import RadioForm from 'react-native-simple-radio-button';
import { RFPercentage } from "react-native-responsive-fontsize";
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};


export default class RegisterScreen extends React.Component {
    state = {
        username: '',
        age: '',
        gender: 'Masculino',
        email: '',
        password: '',
        genderTypes: [
            { label: 'Masculino', value: 0 },
            { label: 'Femenino', value: 1 }
        ],
    };

    handleRegisterPress = () => {
        let component = this;
        const navigation = this.props.navigation;
        try {
            let { username, age, gender, email, password } = this.state;
            if (username == null || age == null || gender == null || email == null || password == null) {
                throw new Error();
            }
            Firebase.auth().createUserWithEmailAndPassword(email, password)
                .catch(function (error) {
                    component.createInvalidInputAlert(error);
                    return;
                })
                .then((result) => {
                    if (result) {
                        const user = result.user;
                        user.updateProfile({
                            displayName: username,
                        });
                        db.collection('users').doc(user.uid).set({
                            username,
                            age,
                            gender,
                            email
                        });
                        component.goToLogin(navigation);
                    }
                }
                )
                .catch(function (error) {
                    component.createInvalidInputAlert(error);
                    return;
                })
        } catch (error) {
            console.log(error);
            this.createInvalidInputAlert({ code: 'empty-field' });
            return;
        }

    }

    goToLogin = (navigation) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'HomeScreen' },
                    { name: 'LoginScreen', },
                ],
            })
        );
    }

    createInvalidInputAlert = (error) => {
        console.log(error);
        let errorText = '';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorText = 'Ya existe una cuenta registrada con la dirección de correo electrónico introducida';
                break;
            case 'empty-field':
                errorText = 'Todos los campos son necesarios';
                break;
            case 'auth/invalid-email':
                errorText = 'La dirección de correo electrónico es inválida';
            case 'auth/invalid-password':
                errorText = 'La contraseña es inválida. Debe ser una cadena de al menos seis caracteres';
            default:
                errorText = 'Datos inválidos';
        }
        Alert.alert(
            'Error',
            errorText,
            [{ text: "OK" }],
            { cancelable: false }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <ImageBackground
                        style={styles.canvas}
                        source={require('../assets/registerbackground.png')}
                        resizeMode='stretch'
                    >
                        <Image
                            style={{ height: '4%', aspectRatio: 820 / 100, marginTop: '13%' }}
                            source={require('../assets/register_header.png')}
                        />
                        <TextInput
                            style={styles.inputBox1}
                            onChangeText={username => this.setState({ username })}
                            placeholder='Nombre'
                            placeholderTextColor='#4b3c74'
                        />
                        <TextInput
                            style={styles.inputBox4}
                            onChangeText={age => this.setState({ age })}
                            placeholder='Edad'
                            placeholderTextColor='#4b3c74'
                            keyboardType="numeric"
                            contextMenuHidden={true}
                        />
                        <View style={styles.radioButtonContainer}>
                            <Text style={{ fontSize: RFPercentage(2.5), color: "#4b3c74", marginBottom: '5%' }}>
                                Género:
                            </Text>
                            <RadioForm
                                radio_props={this.state.genderTypes}
                                initial={0}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={'#2196f3'}
                                animation={true}
                                buttonSize={15}
                                labelStyle={{ fontSize: RFPercentage(2.5), color: '#4b3c74', marginHorizontal: '4%' }}
                                onPress={(value) => {
                                    if (value == 0) {
                                        this.setState({ gender: 'Masculino' });
                                    } else if (value == 1) {
                                        this.setState({ gender: 'Femenino' });
                                    }
                                }}
                            />
                        </View>
                        <TextInput
                            style={styles.inputBox3}
                            onChangeText={email => this.setState({ email })}
                            placeholder='Correo electrónico'
                            placeholderTextColor='#4b3c74'
                            autoCapitalize='none'
                            keyboardType='email-address'
                        />
                        <TextInput
                            style={styles.inputBox2}
                            onChangeText={password => this.setState({ password })}
                            placeholder='Contraseña'
                            placeholderTextColor='#4b3c74'
                            autoCapitalize='none'
                            secureTextEntry={true}
                        />
                        <Register style={styles.buttonStyle} navigate={() => this.handleRegisterPress()} />
                    </ImageBackground>
                </View>
                <View style={styles.bottomContainer}>
                    <Image
                        style={{ height: '60%', aspectRatio: 311 / 128, marginTop: '3%' }}
                        source={require('../assets/logo_register.png')}
                    />
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
    },
    canvas: {
        flex: 1,
        flexDirection: 'column',
        width: undefined,
        height: undefined,
        alignSelf: 'stretch',
        alignItems: 'center',

    },
    topContainer: {
        marginHorizontal: 0,
        width: '100%',
        height: Dimensions.get('window').height - (Dimensions.get('window').height / 10),
        flexDirection: 'column',
        alignItems: 'center',
    },
    bottomContainer: {
        width: '100%',
        height: Dimensions.get('window').height / 10,
        alignItems: 'center',
        flexDirection: 'column',
    },
    radioButtonContainer: {
        width: '71%',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    inputBox1: {
        marginTop: '13%',
        width: '70%',
        margin: '2.6%',
        fontSize: RFPercentage(2.5),
        color: "#4b3c74",
        borderColor: '#4b3c74',
        borderBottomWidth: 1,
        textAlign: 'left'
    },
    inputBox2: {
        marginTop: '1.3%',
        width: '70%',
        margin: '2.6%',
        fontSize: RFPercentage(2.5),
        color: "#4b3c74",
        borderColor: '#4b3c74',
        borderBottomWidth: 1,
        textAlign: 'left',
        marginBottom: '13%',
    },
    inputBox3: {
        marginTop: '3%',
        width: '70%',
        margin: '2.6%',
        fontSize: RFPercentage(2.5),
        color: "#4b3c74",
        borderColor: '#4b3c74',
        borderBottomWidth: 1,
        textAlign: 'left',
    },
    inputBox4: {
        marginTop: '1.3%',
        marginBottom: '4%',
        width: '70%',
        margin: '2.6%',
        fontSize: RFPercentage(2.5),
        color: "#4b3c74",
        borderColor: '#4b3c74',
        borderBottomWidth: 1,
        textAlign: 'left',
    },
    buttonStyle: {
        width: '50%',
        aspectRatio: 921 / 231,
    }
});
