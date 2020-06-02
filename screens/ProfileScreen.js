import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Alert, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo'
import Inseguro from '../components/Inseguro';
import Meh from '../components/Meh';
import Triste from '../components/Triste';
import Feliz from '../components/Feliz';
import Genial from '../components/Genial';
import OMG from '../components/OMG';
import Enojado from '../components/Enojado';
import Lloroso from '../components/Lloroso';
import { RFPercentage } from "react-native-responsive-fontsize";
import AddImg from '../components/AddImg';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { st } from '../config/Firebase';

export default class ProfileScreen extends React.Component {

    state = {
        pbackgroundStyle: styles.pbackground2,
        pStyle: styles.addimg2,
        fontsLoaded: false,
        emotionalState: '...',
        profilePicture: null,
        uid: null,
    }

    async componentDidMount() {
        this.setState({ uid: this.props.route.params.uid });
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        this.setState({ fontsLoaded: true });
        st.ref(('profile pictures/' + this.state.uid)).getDownloadURL().then(img => {
            this.setState({ profilePicture: { uri: img } });
            this.setState({ pbackgroundStyle: styles.pbackground });
            this.setState({ pStyle: styles.addimg });
        }).catch(() => {
            this.setState({ profilePicture: require('../assets/plus.png') });
        });
    }

    setEmotion = (emotion) => {
        this.setState({ emotionalState: emotion });
    }

    pickImg = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status == 'granted') {
            try {
                let result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.cancelled) {
                    const source = { uri: result.uri };
                    this.setState({ profilePicture: source });
                    this.uploadImage(result.uri);
                    this.setState({ pbackgroundStyle: styles.pbackground });
                    this.setState({ pStyle: styles.addimg });
                }
            } catch (E) {
                console.log(E);
            }
        }
    }

    uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return st.ref(('profile pictures/' + this.state.uid).put(blob));
    }

    render() {
        if (this.state.fontsLoaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.container1}>
                        <View style={styles.container1text}>
                            <Text style={{ fontFamily: 'AvenirBold', fontSize: RFPercentage(4.7), color: '#4b3c74', marginBottom: '5%', marginTop: '15%' }}>
                                Tu perfil
                            </Text>
                            <Text style={{ fontFamily: 'AvenirReg', color: '#4b3c74', fontSize: RFPercentage(3.125), marginBottom: '5%' }}>
                                {this.props.route.params.username}
                            </Text>
                            <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(3.125), marginBottom:'5%' }}>
                                {this.props.route.params.age}
                            </Text>
                            <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(2.6) }}>
                                {this.props.route.params.company}
                            </Text>
                            <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(2.6) }}>
                                Te sientes {this.state.emotionalState}
                            </Text>
                        </View>
                        <View style={styles.container1img}>
                            <View style={this.state.pbackgroundStyle} >
                                <AddImg style={this.state.pStyle} pickimg={this.pickImg} img={this.state.profilePicture} resizeMode='contain' />
                            </View>
                        </View>
                    </View>
                    <View style={styles.container2}>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125), marginBottom: '1%' }}>
                            Cuéntanos,
                        </Text>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125) }}>
                            ¿Cómo te has sentido hoy?
                        </Text>
                    </View>
                    <View style={styles.container_buttonrow}>
                        <View style={styles.container_singlebutton}>
                            <Inseguro setEmotion={() => this.setEmotion('Inseguro')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Inseguro/a
                            </Text>
                        </View>
                        <View style={styles.container_singlebutton}>
                            <Meh setEmotion={() => this.setEmotion('Meh')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Meh
                            </Text>
                        </View>
                        <View style={styles.container_singlebutton}>
                            <Triste setEmotion={() => this.setEmotion('Triste')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Triste
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container_buttonrow}>
                        <View style={styles.container_singlebutton}>
                            <Feliz setEmotion={() => this.setEmotion('Feliz')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Feliz
                            </Text>
                        </View>
                        <View style={styles.container_singlebutton}>
                            <Genial setEmotion={() => this.setEmotion('Genial')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Genial
                            </Text>
                        </View>
                        <View style={styles.container_singlebutton}>
                            <OMG setEmotion={() => this.setEmotion('OMG')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                OMG
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container_buttonrow}>
                        <View style={styles.container_singlebutton}>
                            <Enojado setEmotion={() => this.setEmotion('Enojado')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Enojado/a
                            </Text>
                        </View>
                        <View style={styles.container_singlebutton}>
                            <Lloroso setEmotion={() => this.setEmotion('Lloroso')}
                                style={styles.emotionButtonStyle} />
                            <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                                Lloroso/a
                            </Text>
                        </View>
                    </View>
                    <ImageBackground
                        style={styles.canvas}
                        source={require('../assets/profilebottombackground.png')}
                        resizeMode='stretch'
                    >
                        <Text style={{ color: '#ffedd2', fontFamily: 'AvenirBold', fontSize: RFPercentage(2.5), marginTop: '12%' }}>
                            Déjanos ayudarte si hoy
                        </Text>
                        <Text style={{ color: '#ffedd2', fontFamily: 'AvenirBold', fontSize: RFPercentage(2.5) }}>
                            no ha sido tu día...
                        </Text>
                        <Image style={{ height: '20%', aspectRatio: 310 / 128, margin: '5%' }} source={require('../assets/logo_register.png')} />
                    </ImageBackground>
                </View>
            );
        } else {
            return <AppLoading />;
        }
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffedd2',
        justifyContent: 'center',
        alignContent: 'stretch',
    },
    canvas: {
        flex: 4,
        flexDirection: 'column',
        width: undefined,
        height: undefined,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container1: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    container1text: {
        flex: 1,
        flexDirection: 'column',
        padding: 30,
        justifyContent: 'center',
    },
    container1img: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container2: {
        flex: 1.6,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '5%',
    },
    container_buttonrow: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    container_singlebutton: {
        flex: 1,
        alignItems: 'center',
    },
    emotionButtonStyle: {
        height: '60%',
        aspectRatio: 1,
    },
    addimg: {
        height: '95%',
        aspectRatio: 1,
        marginRight: '2%',
        marginTop: '2%',
        borderRadius: 10000,
        overflow: 'hidden'
    },
    addimg2: {
        height: '90%',
        aspectRatio: 1,
        borderRadius: 10000,
        overflow: 'hidden',
        marginTop: '6%'
    },
    pbackground: {
        height: '70%',
        borderRadius: 10000,
        aspectRatio: 1,
        backgroundColor: '#4f3976',
        overflow: "hidden",
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: '20%',
        marginRight: '20%'
    },
    pbackground2: {
        height: '70%',
        borderRadius: 10000,
        aspectRatio: 1,
        backgroundColor: '#4f3976',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "hidden",
        marginTop: '20%',
        marginRight: '20%'
    },
});

