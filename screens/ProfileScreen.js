import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Alert, Dimensions, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo'
import EmotionButton from '../components/EmotionButton';

import { RFPercentage } from "react-native-responsive-fontsize";
import AddImg from '../components/AddImg';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { st } from '../config/Firebase';
import Carousel from 'react-native-snap-carousel';

const SCREEN_WIDTH=Dimensions.get("window").width;

export default class ProfileScreen extends React.Component {

    state = {
        pbackgroundStyle: styles.pbackground2,
        pStyle: styles.addimg2,
        fontsLoaded: false,
        emotionalState: '...',
        profilePicture: null,
        uid: null,
        carouselItems: [
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
                title: "Feliz",
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

    render() {
        if (this.state.fontsLoaded) {
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
                    <View style={styles.containerCarousel}>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.carouselItems}
                            renderItem={this.carouselRenderItem}
                            sliderWidth={SCREEN_WIDTH}
                            itemWidth={SCREEN_WIDTH/3}
                            firstItem={0}
                            initialScrollIndex={0}
                            loop={true}
                            loopClonesPerSide={4}
                            enableMomentum={true}
                            autoplay={true}
                            autoplayDelay={0}
                            contentContainerCustomStyle={{alignItems:'center'}}
                        />
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
        justifyContent:'center',
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
        marginTop:'10%'
    },
    containerCarousel: {
        flex: 2.5,
        justifyContent:'center',
        alignItems:'center',
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
        height: '95%',
        aspectRatio: 1,
        marginRight: '2%',
        marginTop: '2%',
        borderRadius: 10000,
        overflow: 'hidden'
    },
    addimg2: {
        height: '80%',
        aspectRatio: 1,
        borderRadius: 10000,
        overflow: 'hidden',

    },
    pbackground: {
        height: '70%',
        borderRadius: 10000,
        aspectRatio: 1,
        backgroundColor: '#4f3976',
        overflow: "hidden",
        alignItems: 'flex-end',
        justifyContent: 'flex-start',

    },
    pbackground2: {
        height: '70%',
        borderRadius: 10000,
        aspectRatio: 1,
        backgroundColor: '#4f3976',
        justifyContent: 'center',
        alignItems: 'center',

    },
});

