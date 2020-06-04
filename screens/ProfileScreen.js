import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, StatusBar, Switch, AppState } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo'
import EmotionButton from '../components/EmotionButton';

import { RFPercentage } from "react-native-responsive-fontsize";
import AddImg from '../components/AddImg';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { st } from '../config/Firebase';
import { db } from '../config/Firebase';
import Carousel from 'react-native-snap-carousel';
import { moderateScale } from 'react-native-size-matters';

const SCREEN_WIDTH = Dimensions.get("window").width;
const UPDATE_DELAY = 2000;

export default class ProfileScreen extends React.Component {


    state = {
        appState: AppState.currentState,
        userDBref: null,
        psychDBref: null,
        loadedProfileData: false,
        fontsAndPictureLoaded: false,
        emotionalState: '...',
        profilePicture: null,
        uid: null,
        isAvailable: false,
        status: null,
        updateTimer: null,
        carouselItems: [
            {
                title: "Felíz",
                image: require('../assets/emojibutton4.png')
            },
            {
                title: "Genial",
                image: require('../assets/emojibutton5.png')
            },
            {
                title: "OMG",
                image: require('../assets/emojibutton6.png')
            },
            {
                title: "Inseguro/a",
                image: require('../assets/emojibutton1.png')
            },
            {
                title: "Meh",
                image: require('../assets/emojibutton2.png')
            },
            {
                title: "Triste",
                image: require('../assets/emojibutton3.png')
            },

            {
                title: "Enojado/a",
                image: require('../assets/emojibutton7.png')
            },
            {
                title: "Lloroso/a",
                image: require('../assets/emojibutton8.png')
            },
        ]
    }

    async componentDidMount() {
        let psychref;
        if (this.props.route.params.isPsychologist && this.props.route.params.company) {
            psychref = db.collection('companies').doc(this.props.route.params.company).collection('registeredPsychologists').doc(this.props.route.params.email.split('@')[0]);
        } else if (this.props.route.params.isPsychologist) {
            psychref = db.collection('registeredPsychologists').doc(this.props.route.params.uid);
        }
        this.setState({ psychDBref: psychref }, () => {
            if (this.props.route.params.isPsychologist) {
                this.state.psychDBref.get().then((psych) => {
                    let data = psych.data();
                    this.setState({ isAvailable: data.isAvailable, status: data.status }, () => this.setState({ loadedProfileData: true }));
                })
            }
        });
        this.setState({ userDBref: db.collection('users').doc(this.props.route.params.uid) }, () => {
            if (!this.props.route.params.isPsychologist) {
                this.state.userDBref.get().then((user) => {
                    let data = user.data();
                    this.setState({ emotionalState: data.emotionalState }, () => this.setState({ loadedProfileData: true }));
                })
            }
        });
        AppState.addEventListener('change', this.handleAppStateChange);
        this.setState({ uid: this.props.route.params.uid });
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        st.ref(('profile pictures/' + this.state.uid)).getDownloadURL().then(img => {
            this.setState({ profilePicture: { uri: img } }, () => this.setState({ fontsAndPictureLoaded: true }));
        }).catch(() => {
            this.setState({ profilePicture: require('../assets/plus.png') }, () => this.setState({ fontsAndPictureLoaded: true }));
        });
    }

    async componentWillUnmount() {
        this.manageInputUpdates();
        AppState.removeEventListener('change', this.handleAppStateChange)
    }

    manageInputUpdates = async () => {
        clearInterval(this.state.updateTimer);
        console.log('Uploading changes...')
        if (this.props.route.params.isPsychologist) {
            this.state.psychDBref.update({ isAvailable: this.state.isAvailable }).catch(error => {
                console.error('Error writing document', error);
            });
        } else {
            this.state.userDBref.update({ emotionalState: this.state.emotionalState })
        }

    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/active/) && (nextAppState === 'background' || nextAppState === 'inactive')) {
            this.manageInputUpdates();
        }
        this.setState({ appState: nextAppState });
    }

    setEmotion = async (emotion) => {
        this.setState({ emotionalState: emotion }, () => {
            clearInterval(this.state.updateTimer);
            this.setState({ updateTimer: setInterval(this.manageInputUpdates, UPDATE_DELAY) });
        });
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
        return st.ref().child('profile pictures/' + this.state.uid).put(blob);
    }

    carouselRenderItem = ({ item, index }) => {
        return (
            <View style={styles.container_singlebutton}>
                <EmotionButton setEmotion={() => this.setEmotion(item.title)}
                    style={styles.emotionButtonStyle}
                    emoji={item.image} />
                <Text style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4b3c74' }}>
                    {item.title}
                </Text>
            </View>
        );
    }

    conditionalCompanyName = () => {
        if (this.props.route.params.company) {
            return (
                <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(2.6) }}>
                    {this.props.route.params.company}
                </Text>
            )
        } else {
            return null;
        }
    }

    conditionalGreeting = () => {
        if (this.props.route.params.isPsychologist) {
            return (
                <View style={styles.container2}>
                    <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125), marginBottom: '1%' }}>
                        ¿Te encuentras disponible
                    </Text>
                    <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125) }}>
                        para dar ayuda psicológica?
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container2}>
                    <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125), marginBottom: '1%' }}>
                        Cuéntanos,
                    </Text>
                    <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125) }}>
                        ¿Cómo te has sentido hoy?
                    </Text>
                </View>
            );
        }
    }

    conditionalEmotion_Availability = () => {
        if (this.props.route.params.isPsychologist) {
            if (this.state.isAvailable) {
                return (
                    <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(2.6) }}>
                        Disponible
                    </Text>
                );
            } else {
                return (
                    <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(2.6) }}>
                        No disponible
                    </Text>
                );
            }
        } else {
            return (
                <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(2.6) }}>
                    Te sientes {this.state.emotionalState}
                </Text>
            )
        }
    }

    conditionalInput = () => {
        if (this.props.route.params.isPsychologist) {
            return (
                <View style={styles.containerInput}>
                    <Switch
                        value={this.state.isAvailable}
                        trackColor={{ false: "#767577", true: "#4f3976" }}
                        thumbColor={this.state.isAvailable ? "#ffbc31" : "#ffffff"}
                        onValueChange={() => {
                            this.setState({ isAvailable: !this.state.isAvailable }, () => {
                                clearInterval(this.state.updateTimer);
                                this.setState({ updateTimer: setInterval(this.manageInputUpdates, UPDATE_DELAY) });
                            });
                        }}
                        style={{
                            transform: [
                                { scaleX: moderateScale(1.5, 0.2) },
                                { scaleY: moderateScale(1.5, 0.2) }
                            ]
                        }}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.containerInput}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.carouselItems}
                        renderItem={this.carouselRenderItem}
                        sliderWidth={SCREEN_WIDTH}
                        itemWidth={SCREEN_WIDTH / 3}
                        autoplay={true}
                        autoplayInterval={2000}
                        contentContainerCustomStyle={{ alignItems: 'center' }}
                    />
                </View>
            );
        }
    }

    render() {
        if (this.state.fontsAndPictureLoaded && this.state.loadedProfileData) {
            return (
                <View style={styles.container}>
                    <View style={styles.container1}>
                        <View style={styles.container1text}>
                            <Text style={{ fontFamily: 'AvenirBold', fontSize: RFPercentage(4.7), color: '#4b3c74' }}>
                                Tu perfil
                            </Text>
                            <Text style={{ fontFamily: 'AvenirReg', color: '#4b3c74', fontSize: RFPercentage(3.125) }}>
                                {this.props.route.params.username}
                            </Text>
                            <Text style={{ fontFamily: 'AvenirItalic', color: '#4b3c74', fontSize: RFPercentage(3.125) }}>
                                {this.props.route.params.age}
                            </Text>
                            <this.conditionalCompanyName />
                            <this.conditionalEmotion_Availability />
                        </View>
                        <View style={styles.container1img}>
                            <AddImg style={styles.addimg} pickimg={this.pickImg} img={this.state.profilePicture} resizeMode='contain' />
                        </View>
                    </View>
                    <this.conditionalGreeting />
                    <this.conditionalInput />
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
        justifyContent: 'center',
    },
    container1: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: StatusBar.currentHeight,
    },
    container1text: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingLeft: '5%',
    },
    container1img: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container2: {
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10%'
    },
    containerInput: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container_singlebutton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0
    },
    emotionButtonStyle: {
        width: '60%',
        aspectRatio: 1,
    },
    addimg: {
        height: '75%',
        aspectRatio: 1,
        borderRadius: 10000,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: '#4f3976',
        backgroundColor: '#4f3976',
    },
});

