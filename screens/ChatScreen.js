import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView, ImageBackground } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import * as Font from 'expo-font';
import { AppLoading } from 'expo'
import Call from '../components/Call';
import Message from '../components/Message';

import SelectableProfile from '../components/SelectableProfile';

export default class ChatScreen extends React.Component {

    state = {
        fontsLoaded: false,
        onlineVolunteers: [
            {
                uid: 1,
                name: 'Camilo Andrés Barraza A.',
                description: 'Doctorado en Psicología de la Educación',
                profilePicture: require('../assets/placeholderAssistant.png'),
                age: 26,
                status: '"La salud mental es un proceso de todos los días..."'
            },
            {
                uid: 2,
                name: 'Nadia Bulag',
                description: 'Doctorado en Psicología Sexual',
                profilePicture: require('../assets/placeholderAssistant2.png'),
                age: 25,
                status: '"Tus fallos no te definen, pero tu fuerza y coraje sí lo hacen."'
            },
            {
                uid: 3,
                name: 'Esteban Jiménez',
                description: 'Doctorado en Psicología Astral y Espiritual.',
                profilePicture: require('../assets/placeholderAssistant3.png'),
                age: 28,
                status: '"Nunca tomes una decisión permanente para aliviar una emoción temporal."'
            }
        ],
        selectedVolunteer: '',
    }

    showProfile = uid => {
        this.state.onlineVolunteers.filter(profile => profile.uid == uid).map(selectedProfile => this.setState({ selectedVolunteer: selectedProfile }));
    }

    async componentDidMount() {
        this.showProfile(this.state.onlineVolunteers[0].uid);
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        this.setState({ fontsLoaded: true });
    }

    render() {
        const scrollviewComponents = this.state.onlineVolunteers.map((profile, i) => <SelectableProfile
            name={profile.name}
            description={profile.description}
            profilePicture={profile.profilePicture}
            key={i}
            showProfile={() => this.showProfile(profile.uid)} />);
        if (this.state.fontsLoaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4f3976', fontSize: RFPercentage(3), textAlign: 'center', marginTop: '5%' }}>
                            ¡Conoce los profesionales disponibles!
                        </Text>
                    </View>
                    <View style={styles.scrollContainer}>
                        <ScrollView style={{ flex: 1, borderWidth:3, borderStyle:'dotted', borderRadius:15, borderColor:'#4f3976'}}>
                            <>{scrollviewComponents}</>
                        </ScrollView>
                    </View>
                    <View style={styles.bottomContainer}>

                        <ImageBackground style={styles.canvas}
                            source={require('../assets/assistantOverviewBackground.png')}
                            resizeMode='stretch'
                        >
                            <View style={styles.canvasTextContainer}>
                                <Text
                                adjustsFontSizeToFit={true}
                                numberOfLines={1} 
                                style={{ fontFamily: 'AvenirBold', color: '#4f3976', textAlign: 'left', fontSize:RFPercentage(2.5) }}>
                                    {this.state.selectedVolunteer.name}
                                </Text>
                                <Text adjustsFontSizeToFit
                                numberOfLines={3}
                                style={{ fontFamily: 'AvenirReg', fontSize: RFPercentage(2.5), color: '#4f3976', textAlign: 'left', marginTop: '2%' }}>
                                    {this.state.selectedVolunteer.description}
                                </Text>
                                <Text adjustsFontSizeToFit
                                numberOfLines={3}
                                style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4f3976', textAlign: 'left', marginTop: '2%' }}>
                                    {this.state.selectedVolunteer.age}
                                </Text>
                                <Text style={{ fontFamily: 'AvenirBold', fontSize: RFPercentage(2.5), color: '#4f3976', textAlign: 'left', marginTop: '2%' }}>
                                    {this.state.selectedVolunteer.status}
                                </Text>
                            </View>
                            <View style={styles.canvasButtonContainer}>
                                <Call style={{aspectRatio:85/89, width:'10%', marginRight:'5%'}} />
                                <Message style={{aspectRatio:91/90, width:'10%', marginLeft:'5%'}} />
                            </View>
                        </ImageBackground>
                        <View style={{ position: 'absolute', top: '4%', left: '10%', borderRadius: 10000, height: '30%', width: undefined, aspectRatio: 1, backgroundColor: '#4f3976', overflow: "hidden", alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Image style={{ height: '85%', width: undefined, aspectRatio: 1, borderRadius: 10000, marginRight: '2%', marginBottom: '2%' , overflow:'hidden'}}
                                source={this.state.selectedVolunteer.profilePicture}
                            />
                        </View>
                    </View>
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
    },
    topContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 2,
    },
    bottomContainer: {
        flex: 4,
    },
    canvas: {
        flex: 4,
        flexDirection: 'column',
        width: undefined,
        height: undefined,
        alignSelf: 'stretch',
        alignItems: 'center',
        marginTop: '20%',
    },
    canvasTextContainer: {
        flex: 4,
        width: '100%',
        paddingTop: '20%',
        paddingHorizontal: '10%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    canvasButtonContainer: {
        flex: 1,
        flexDirection:'row',
    },
});

