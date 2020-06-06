import React from 'react';
import { StyleSheet, TextInput, View, Image, ImageBackground, Dimensions, Alert, StatusBar } from 'react-native';
import Login from '../components/Login';
import Firebase, { db , st} from '../config/Firebase';
import { CommonActions } from '@react-navigation/native';
import { RFPercentage } from "react-native-responsive-fontsize";

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class SignInScreen extends React.Component {
    state = {
        email: null,
        password: null,
        company: null,
        isPsychologist: false,
        isCompanyPsychologist: false,
    };

    goToProfile = (uid, picture) => {
        let dbref;
        if (this.state.isPsychologist) {
            dbref = 'registeredPsychologists';
        } else {
            dbref = 'users';
        }
        db.collection(dbref).doc(uid).get().then((user) => {
            let params = user.data();
            params.uid = uid;
            params.company = this.state.company;
            params.isPsychologist = this.state.isPsychologist;
            params.isCompanyPsychologist = this.state.isCompanyPsychologist;
            params.profilePicture = picture;
            console.log(params);
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
        }).then(async (result) => {
            if (result) {
                const user = result.user;
                const psychCollectionRef = db.collection('registeredPsychologists');
                await psychCollectionRef.doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        this.setState({ isPsychologist: true });
                    }
                });
                let picture;
                await st.ref(('profile pictures/' + user.uid)).getDownloadURL().then(img => {
                    picture = { uri: img };
                });
                const splitEmail = user.email.split("@");
                const companiesRef = db.collection('companies');
                const query = companiesRef.where('email domain', '==', splitEmail[1]);
                query.get().then((querySnapshot) => {
                    const company = querySnapshot.docs[0];
                    if (company) {
                        this.setState({ company: company.id });
                        const psych = db.collection('companies').doc(company.id).collection('registeredPsychologists').doc(splitEmail[0]);
                        psych.get().then((doc) => {
                            if (doc.exists) {
                                this.setState({ isCompanyPsychologist: true }, () => this.goToProfile(user.uid));
                            }
                        });
                    }
                }).then(this.goToProfile(user.uid, picture));
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.canvas}
                    source={require('../assets/loginbackground.png')}
                    resizeMode='stretch'
                >
                    <Image
                        style={{ height: '4%', aspectRatio: 828 / 103, marginTop: StatusBar.currentHeight }}
                        source={require('../assets/login_header.png')}
                    />
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={email => this.setState({ email })}
                        placeholder='Email'
                        placeholderTextColor='#e6b637'
                        autoCapitalize='none'
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={password => this.setState({ password })}
                        placeholder='Contraseña'
                        placeholderTextColor='#e6b637'
                        autoCapitalize='none'
                        secureTextEntry={true}
                    />
                    <Login style={styles.buttonStyle} navigate={() => this.handleLoginPress()} />
                </ImageBackground>
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
        flexDirection: 'column',
        width: '100%',
        height: SCREEN_HEIGHT * 0.9,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingBottom: 150,

    },
    bottomContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    inputBox: {
        width: '70%',
        fontSize: RFPercentage(2.5),
        color: "#e6b637",
        borderColor: '#e6b637',
        borderBottomWidth: 1,
        textAlign: 'left'
    },
    buttonStyle: {
        width: '50%',
        aspectRatio: 921 / 231,
    }
});
