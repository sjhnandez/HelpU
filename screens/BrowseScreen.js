import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView, ImageBackground } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import * as Font from 'expo-font';
import { AppLoading } from 'expo'
import Call from '../components/Call';
import Message from '../components/Message';
import { st } from '../config/Firebase';
import { db } from '../config/Firebase';
import SelectableProfile from '../components/SelectableProfile';
import * as Linking from 'expo-linking';
import ChatScreen from './ChatScreen';
import { isAvailable } from 'expo/build/AR';

const UPDATE_DELAY = 10000;

export default class BrowseScreen extends React.Component {

    state = {
        updateTimer: null,
        fontsLoaded: false,
        userList: [],
        selectedUser: '',
        fetchListener: null,
    }

    showProfile = uid => {
        if (this.state.userList) {
            this.state.userList.filter(profile => profile.uid == uid).map(selectedProfile => this.setState({ selectedUser: selectedProfile }));
        }
    }

    callVolunteer = () => {
        Linking.openURL('tel:+123456789');
    }

    /* messageVolunteer = () => {
        const volunteeruid = this.state.selectedUser.uid;
        const username = this.state.selectedUser.username;
        this.props.navigation.navigate('ChatScreen', [this.props.route.params, volunteeruid, username]);
    } */

    fetchAll = async () => {
        let listener;
        if (!this.props.route.params.isPsychologist) {
            listener = db.collection('registeredPsychologists')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(async change => {
                        let data = change.doc.data();
                        data['uid'] = change.doc.id;
                        if ((change.type == 'added' || change.type == 'modified') && change.doc.get('isAvailable')) {
                            await st.ref(('profile pictures/' + change.doc.id)).getDownloadURL().then(img => {
                                data['profilePicture'] = { uri: img };
                            }).catch(() => {
                                console.log('Error loading picture for ' + data.username);
                            });
                            this.setState({ userList: [...this.state.userList, data] });
                        } else if ((change.type == 'modified' && !change.doc.get('isAvailable')) || change.type == 'removed') {
                            let newList = this.state.userList.filter(profile => profile.uid != change.doc.id);
                            this.setState({ userList: newList });
                            if (this.state.selectedUser.uid == change.doc.id) {
                                this.setState({ selectedUser: '' });
                            }
                        }
                    });
                });
        } else {
            listener = db.collection('conversations').where('user2', '==', this.props.route.params.uid).where('active', '==', true).
                onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(async change => {
                        const doc = await db.collection('users').doc(change.doc.data().user1).get();
                        let data = doc.data();
                        if (change.type == 'added') {
                            data['uid'] = doc.id;
                            await st.ref(('profile pictures/' + data.uid)).getDownloadURL().then(img => {
                                data['profilePicture'] = { uri: img };
                            }).catch(() => {
                                console.log('Error loading picture for ' + data.username);
                            });
                            this.setState({ userList: [...this.state.userList, data] });
                        } else if (change.type == 'removed') {
                            let newList = this.state.userList.filter(profile => profile.uid != doc.id);
                            this.setState({ userList: newList });
                            if (this.state.selectedUser.uid == doc.id) {
                                this.setState({ selectedUser: '' });
                            }
                        }
                    })
                })
        }
        this.setState({ fetchListener: listener });
        /* const user = this.props.route.params;
        const splitEmail = user.email.split("@");
        const companiesRef = db.collection('companies');
        const query = companiesRef.where('email domain', '==', splitEmail[1]);
        query.get().then((querySnapshot) => {
            const company = querySnapshot.docs[0];
            const psychSnapshot = db.collection('companies').doc(company.id).collection('registeredPsychologists').get();
            
        }).catch(error => {
            console.log('No registered psychologists for this domain');
        }); */
    }

    async componentDidMount() {
        await this.fetchAll();
        /* this.setState({ updateTimer: setInterval(this.fetchAllAvailablePsychologists, UPDATE_DELAY) }); */
        await Font.loadAsync({
            'AvenirBold': require('../assets/fonts/AvenirNextLTPro-Bold.otf'),
            'AvenirItalic': require('../assets/fonts/AvenirNextLTPro-It.otf'),
            'AvenirReg': require('../assets/fonts/AvenirNextLTPro-Regular.otf')
        });
        this.setState({ fontsLoaded: true });
    }

    async componentWillUnmount() {
        clearInterval(this.state.updateTimer);
        if (this.state.fetchListener) {
            this.state.fetchListener();
        }
    }

    conditionalTitle = () => {
        if (!this.props.route.params.isPsychologist) {
            return ('¡Conoce a los profesionales disponibles!');
        } else {
            return ('¡Las siguientes personas desean hablar contigo!');
        }
    }

    conditionalInfo = () => {
        if (this.state.selectedUser) {
            if (this.props.route.params.isPsychologist) {
                return ('Se siente ' + this.state.selectedUser.emotionalState);
            } else {
                return this.state.selectedUser.description;
            }
        }
    }

    messageButtonShow = () => {
        if (this.state.selectedUser.uid) {
            return (
                <Message style={{ aspectRatio: 91 / 90, width: '10%' }} messageVolunteer={() => this.messageVolunteer()} />
            )
        } else {
            return null;
        }
    }

    render() {
        let scrollviewComponents;
        if (this.state.userList != null) {
            if (this.props.route.params.isPsychologist) {
                scrollviewComponents = this.state.userList.map((profile, i) => <SelectableProfile
                    name={profile.username}
                    info={profile.age}
                    profilePicture={profile.profilePicture}
                    key={i}
                    showProfile={() => this.showProfile(profile.uid)} />);
            } else {
                scrollviewComponents = this.state.userList.map((profile, i) => <SelectableProfile
                    name={profile.username}
                    info={profile.description}
                    profilePicture={profile.profilePicture}
                    key={i}
                    showProfile={() => this.showProfile(profile.uid)} />);
            }
        }
        if (this.state.fontsLoaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        <Text style={{ fontFamily: 'AvenirBold', color: '#4f3976', fontSize: RFPercentage(3), textAlign: 'center' }}>
                            {this.conditionalTitle()}
                        </Text>
                    </View>
                    <View style={styles.scrollContainer}>
                        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={{ alignItems: 'center' }}>
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
                                    style={{ fontFamily: 'AvenirBold', color: '#4f3976', textAlign: 'left', fontSize: RFPercentage(2.5) }}>
                                    {this.state.selectedUser.username}
                                </Text>
                                <Text adjustsFontSizeToFit
                                    numberOfLines={2}
                                    style={{ fontFamily: 'AvenirReg', fontSize: RFPercentage(2.5), color: '#4f3976', textAlign: 'left' }}>
                                    {this.conditionalInfo()}
                                </Text>
                                <Text
                                    style={{ fontFamily: 'AvenirItalic', fontSize: RFPercentage(2.5), color: '#4f3976', textAlign: 'left' }}>
                                    {this.state.selectedUser.age}
                                </Text>
                                <Text adjustsFontSizeToFit
                                    numberOfLines={5}
                                    style={{ fontFamily: 'AvenirBold', fontSize: RFPercentage(2.5), color: '#4f3976', textAlign: 'left' }}>
                                    {this.state.selectedUser.status}
                                </Text>
                            </View>
                            <View style={styles.canvasButtonContainer}>
                                {/* <Call style={{ aspectRatio: 85 / 89, width: '10%', marginRight: '5%' }} callVolunteer={() => this.callVolunteer()} /> */}
                                {this.messageButtonShow()}
                            </View>
                        </ImageBackground>
                        <View style={{ position: 'absolute', top: '4%', left: '10%', borderRadius: 10000, height: '30%', width: undefined, aspectRatio: 1, backgroundColor: '#4f3976', overflow: "hidden", alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Image style={{ height: '85%', width: undefined, aspectRatio: 1, borderRadius: 10000, marginRight: '2%', marginBottom: '2%', overflow: 'hidden' }}
                                source={this.state.selectedUser.profilePicture}
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollViewStyle: {
        flex: 1,
        width: '90%',
        borderWidth: 3,
        borderStyle: 'dotted',
        borderRadius: 15,
        borderColor: '#4f3976',
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
        flex: 1,
        width: '100%',
        paddingTop: '20%',
        paddingHorizontal: '10%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    canvasButtonContainer: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: '5%',
        paddingTop: '10%'
    },
});

