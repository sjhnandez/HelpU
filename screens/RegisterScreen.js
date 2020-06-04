import React from 'react';
import { StyleSheet, View, Image, Dimensions, ImageBackground, TextInput, Alert, Text, StatusBar } from 'react-native';
import Firebase, { db } from '../config/Firebase';
import Register from '../components/Register';
import { CommonActions } from '@react-navigation/native';
import RadioForm from 'react-native-simple-radio-button';
import { RFPercentage } from "react-native-responsive-fontsize";
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements'

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

const SCREEN_HEIGHT=Dimensions.get('window').height;


export default class RegisterScreen extends React.Component {
    state = {
        username: '',
        age: null,
        isMale: true,
        email: '',
        password: '',
        isPsychologist: false,
    };

    handleRegisterPress = () => {
        let component = this;
        const navigation = this.props.navigation;
        try {
            let { username, age, isMale, email, password } = this.state;
            if (username == null || age == null || isMale == null || email == null || password == null) {
                throw new Error();
            }
            let gender;
            if (!isMale) {
                gender = 'Female';
            } else {
                gender = 'Male';
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
                        let dbref;
                        if (this.state.isPsychologist) {
                            dbref = 'registeredPsychologists';
                        } else {
                            dbref = 'users';
                        }
                        db.collection(dbref).doc(user.uid).set({
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
                <ImageBackground
                    style={styles.canvas}
                    source={require('../assets/registerbackground.png')}
                    resizeMode='stretch'
                >
                    <Image
                        style={{ height:'5%', aspectRatio: 820 / 100, marginTop: StatusBar.currentHeight, marginBottom:'5%'}}
                        source={require('../assets/register_header.png')}
                    />
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={username => this.setState({ username })}
                        placeholder='Nombre'
                        placeholderTextColor='#4f3976'
                    />
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={age => this.setState({ age })}
                        placeholder='Edad'
                        placeholderTextColor='#4f3976'
                        keyboardType="numeric"
                        contextMenuHidden={true}
                    />
                    <View style={{ flex: 0, width: '70%', flexDirection: 'row' }}>
                        <Text style={{ fontSize: RFPercentage(2.5), color: "#4f3976", textAlign: 'left' }}>
                            Género:
                            </Text>
                    </View>
                    <View style={styles.radioButtonContainer}>
                        <CheckBox title="Masculino" checked={this.state.isMale}
                            onPress={() => this.setState({ isMale: true })}
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 0 }}
                            textStyle={{ color: '#4f3976' }}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='#4f3976' />
                        <CheckBox title="Femenino" checked={!this.state.isMale}
                            onPress={() => this.setState({ isMale: false })}
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 0 }}
                            textStyle={{ color: '#4f3976' }}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checkedColor='#4f3976' />
                    </View>
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={email => this.setState({ email })}
                        placeholder='Correo electrónico'
                        placeholderTextColor='#4f3976'
                        autoCapitalize='none'
                        keyboardType='email-address'
                    />
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={password => this.setState({ password })}
                        placeholder='Contraseña'
                        placeholderTextColor='#4f3976'
                        autoCapitalize='none'
                        secureTextEntry={true}
                    />
                    <CheckBox title="¿Te registras como psicólogo?" checked={this.state.isPsychologist}
                        onPress={() => this.setState({ isPsychologist: !this.state.isPsychologist })}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                        textStyle={{ color: '#4f3976' }}
                        checkedColor='#4f3976' />
                    <Register style={styles.buttonStyle} navigate={() => this.handleRegisterPress()} />
                </ImageBackground>
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
        flexDirection:'column',
        height: SCREEN_HEIGHT*0.9,
        width:'100%',
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingBottom: 150,
        justifyContent:'space-evenly'
    },
    bottomContainer: {
        width: '100%',
        height: SCREEN_HEIGHT*0.1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    radioButtonContainer: {
        width: '71%',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 0,
    },
    inputBox: {
        width: '70%',
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
