import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, StatusBar, Switch, AppState, TextInput, Keyboard } from 'react-native';
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
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;


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
        updateStatus: false,
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
        AppState.addEventListener('change', this.handleAppStateChange);
        this.setState({ uid: this.props.route.params.uid });
        await this.loadUserData();
        await this.loadFontsAndPicture();
    }

    async componentWillUnmount() {
        this.manageInputUpdates();
        AppState.removeEventListener('change', this.handleAppStateChange)
    }

    loadUserData = async () => {
        if (this.props.route.params.isPsychologist) {
            let psychref = db.collection('registeredPsychologists').doc(this.props.route.params.uid);
            this.setState({ psychDBref: psychref }, () => {
                this.state.psychDBref.get().then((psych) => {
                    let data = psych.data();
                    this.setState({ isAvailable: data.isAvailable, status: data.status }, () => this.setState({ loadedProfileData: true }));
                })
            });
        } else {
            this.setState({ userDBref: db.collection('users').doc(this.props.route.params.uid) }, () => {
                this.state.userDBref.get().then((user) => {
                    let data = user.data();
                    this.setState({ emotionalState: data.emotionalState }, () => this.setState({ loadedProfileData: true }));
                })
            });
        }
    }

    loadFontsAndPicture = async () => {
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        if (this.props.route.params.profilePicture) {
            this.setState({ profilePicture: this.props.route.params.profilePicture }, () => this.setState({ fontsAndPictureLoaded: true }));
        } else {
            this.setState({ profilePicture: require('../assets/plus.png') }, () => this.setState({ fontsAndPictureLoaded: true }));
        }
        /* await st.ref(('profile pictures/' + this.state.uid)).getDownloadURL().then(img => {
            this.setState({ profilePicture: { uri: img } }, () => this.setState({ fontsAndPictureLoaded: true }));
        }).catch(() => {
            this.setState({ profilePicture: require('../assets/plus.png') }, () => this.setState({ fontsAndPictureLoaded: true }));
        }); */
    }

    manageInputUpdates = async () => {
        clearInterval(this.state.updateTimer);
        console.log('Uploading changes...')
        if (this.props.route.params.isPsychologist) {
            if (this.state.isAvailable != null) {
                this.state.psychDBref.update({ isAvailable: this.state.isAvailable }).catch(error => {
                    console.error('Error writing document', error);
                });
            }
            if (this.state.status != null && this.state.updateStatus) {
                this.setState({ updateStatus: false });
                this.state.psychDBref.update({ status: this.state.status }).catch(error => {
                    console.error('Error writing document', error);
                });
            }
        } else {
            if (this.state.emotionalState) {
                this.state.userDBref.update({ emotionalState: this.state.emotionalState })
            }
        }
    }

    setStatus = async () => {

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
                    <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3), paddingTop: '5%' }}>
                        ¿Te encuentras disponible?
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={styles.container2}>
                    <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3.125), paddingBottom: '1%', paddingTop: '10%' }}>
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
                    <View style={{ flex: 0.7, flexDirection: 'column', width: '100%', paddingHorizontal: '5%' }}>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: RFPercentage(3), textAlign: 'left', marginBottom: '2%' }}>
                            Estado:
                        </Text>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextInput style={{ width: '80%', height: '100%', borderColor: '#4b3c74', borderWidth: 1, borderRadius: 15, paddingHorizontal: '5%' }}
                                multiline={true}
                                onChangeText={status => { this.setState({ status }) }}
                            />
                            <Button onPress={() => {
                                Keyboard.dismiss();
                                this.setState({ updateStatus: true }, () => {
                                    clearInterval(this.state.updateTimer);
                                    this.setState({ updateTimer: setInterval(this.manageInputUpdates, UPDATE_DELAY) });
                                })
                            }} icon={
                                <Icon
                                    name="check-circle"
                                    size={60}
                                    color="#4b3c74"
                                />
                            }
                                buttonStyle={{ backgroundColor: '#transparent,', borderRadius: 1000, padding: 0 }} />
                        </View>
                    </View>

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
                        <Image style={{ height: '20%', aspectRatio: 310 / 128, margin: '10%' }} source={require('../assets/logo_register.png')} />
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
        width: '100%',
        height: SCREEN_HEIGHT + 10,
        flexDirection: 'column',
        backgroundColor: '#ffedd2',
        justifyContent: 'center',
        alignContent: 'stretch',
        paddingTop: '10%'
    },
    canvas: {
        flex: 4,
        flexDirection: 'column',
        width: undefined,
        height: undefined,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container1: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
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
    },
    containerInput: {
        flex: 2.5,
        flexDirection: 'column',
        justifyContent: 'space-around',
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
        width: '75%',
        aspectRatio: 1,
        borderRadius: 10000,
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: '#4f3976',
        backgroundColor: '#4f3976',
    },
});

