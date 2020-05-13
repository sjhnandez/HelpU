import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo'
import Insegura from '../components/Insegura';

export default class ProfileScreen extends React.Component {
    state = {
        fontsLoaded: false,
        emotionalState: '',
    };
    async componentDidMount() {
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        this.setState({ fontsLoaded: true });
    }

    setEmotion = (emotion) => {
        this.setState({ emotionalState: emotion });
    }

    render() {
        if (this.state.fontsLoaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.container1}>
                        <View style={styles.container1text}>
                            <Text style={{ fontFamily: 'AvenirBold', fontSize: 30, color: '#4b3c74', marginBottom: '5%' }}>
                                Tu perfil
                            </Text>
                            <Text style={{ fontFamily: 'AvenirReg', color: '#4b3c74', fontSize: 20 }}>
                                {this.props.route.params.username}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container2}>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: 20, marginBottom: '1%' }}>
                            Cuéntanos,
                        </Text>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4b3c74', fontSize: 20 }}>
                            ¿Cómo te has sentido hoy?
                        </Text>
                    </View>
                    <View style={styles.contaier_buttonrow}>
                        <View style={styles.container_singlebutton}>
                            <Insegura setEmotion={() => this.setEmotion('Insegura')}
                            style={styles.emotionButtonStyle} />
                            <Text style={{fontFamily:'AvenirItalic', fontSize:16,  color: '#4b3c74'}}>
                                Inseguro/a
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container_buttonrow}>

                    </View>
                    <View style={styles.container_buttonrow}>

                    </View>
                </View>
            );
        } else {
            return <AppLoading />
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
    container1: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    container1text: {
        flex: 1,
        flexDirection: 'column',
        padding: 30,
    },
    container2: {
        flex: 0.5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container_buttonrow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container_singlebutton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    emotionButtonStyle: {
        height:50,
        aspectRatio:1,
    }
});

