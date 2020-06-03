import React from 'react';
import { StyleSheet, TextInput, View, Image, ImageBackground, Dimensions, Alert } from 'react-native';
import Login from '../components/Login';
import Firebase, { db } from '../config/Firebase';
import { CommonActions } from '@react-navigation/native';
import { RFPercentage } from "react-native-responsive-fontsize";

export default class SignInScreen extends React.Component {
    state = {
        email: null,
        password: null,
        company: null,
        isPsychologist: false,
    };

    goToProfile = uid => {
        db.collection('users').doc(uid).get().then((user) => {
            let params = user.data();
            params.uid = uid;
            params.company = this.state.company;
            params.isPsychologist = this.state.isPsychologist;
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {
                            name: 'TabbedHub',
                            params
                        },
                    ],
                })
            );

        });
    }

    handleLoginPress = () => {
        const { email, password } = this.state;
        Firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            Alert.alert(
                '',
                'Email o contraseña incorrecta',
                [{ text: "OK" }],
                { cancelable: false }
            );
            console.log(error);
            return;
        }).then((result) => {
            if (result) {
                const user = result.user;
                const splitEmail = user.email.split("@");
                const companiesRef = db.collection('companies');
                const query = companiesRef.where('email domain', '==', splitEmail[1]);
                query.get().then((querySnapshot) => {
                    querySnapshot.forEach((company) => {
                        this.setState({ company: company.id });
                        const psych = db.collection('companies').doc(company.id).collection('registeredPsychologists').doc(splitEmail[0]);
                        psych.get().then((doc) => {
                            if (doc.exists) {
                                console.log('is psych!!');
                                this.setState({ isPsychologist: true });
                            }
                        });
                    });
                }).then(() => this.goToProfile(user.uid));
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <ImageBackground
                        style={styles.canvas}
                        source={require('../assets/loginbackground.png')}
                        resizeMode='stretch'
                    >
                        <Image
                            style={{ height: '4%', aspectRatio: 828 / 103, marginTop: '42%' }}
                            source={require('../assets/login_header.png')}
                        />
                        <TextInput
                            style={styles.inputBox1}
                            onChangeText={email => this.setState({ email })}
                            placeholder='Email'
                            placeholderTextColor='#e6b637'
                            autoCapitalize='none'
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.inputBox2}
                            onChangeText={password => this.setState({ password })}
                            placeholder='Contraseña'
                            placeholderTextColor='#e6b637'
                            autoCapitalize='none'
                            secureTextEntry={true}
                        />
                        <Login style={styles.buttonStyle} navigate={() => this.handleLoginPress()} />
                    </ImageBackground>
                </View>
                <View style={styles.bottomContainer}>
                    <Image
                        style={{ height: '60%', aspectRatio: 311 / 128, marginTop: '3%' }}
                        source={require('../assets/logo_login.png')}
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
        backgroundColor: '#ffedd2',
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
    inputBox1: {
        marginTop: '13%',
        width: '70%',
        margin: '2.6%',
        fontSize: RFPercentage(2.5),
        color: "#e6b637",
        borderColor: '#e6b637',
        borderBottomWidth: 1,
        textAlign: 'left'
    },
    inputBox2: {
        marginTop: '1.3%',
        width: '70%',
        margin: '2.6%',
        fontSize: RFPercentage(2.5),
        color: "#e6b637",
        borderColor: '#e6b637',
        borderBottomWidth: 1,
        textAlign: 'left',
        marginBottom: '13%',
    },
    buttonStyle: {
        width: '50%',
        aspectRatio: 921 / 231,
    }
});
