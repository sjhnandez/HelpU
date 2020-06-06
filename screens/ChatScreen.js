import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { db } from '../config/Firebase';
import { Header, Button } from 'react-native-elements';
import { View, Text, Alert, Image } from 'react-native';


export default class Chat extends React.Component {

    state = {
        messages: [],
        messageListener: null,
        convoListener: null,
        convoRef: null,
        willUnmount: false,
        profilePicture: null,
        chatClosed: false,
    };

    componentDidMount() {
        this.addMessageListener();
    }

    componentWillUnmount() {
        this.state.messageListener();
    }

    addMessageListener = async () => {
        if (this.state.convoRef == null) {
            var ref;
            if (this.props.route.params[0].isPsychologist) {
                ref = 'user2';
            } else {
                ref = 'user1';
            }
            await db.collection('conversations').where(ref, '==', this.props.route.params[0].uid).where('active', '==', true).get().then(querySnapshot => {
                let convoRef;
                if (!querySnapshot.empty) {
                    convoRef = querySnapshot.docs[0].ref;
                } else {
                    convoRef = db.collection('conversations').doc();
                    convoRef.set(
                        {
                            user1: this.props.route.params[0].uid,
                            user2: this.props.route.params[1],
                            active: true,
                        }
                    );

                }

                this.setState({ convoRef })
            });
        }
        let listener = this.state.convoRef.collection('Messages').orderBy('createdAt')
            .onSnapshot(snapshot => {
                snapshot.docChanges().map(change => {
                    const data = {
                        _id: change.doc.id,
                        ...change.doc.data(),
                        createdAt: change.doc.data().createdAt.toDate(),
                    };
                    if (change.type == 'added') {
                        this.setState(previousState => ({
                            messages: GiftedChat.append(previousState.messages, data),
                        }))
                    }
                })
            });
        let convoListener = this.state.convoRef
            .onSnapshot(snapshot => {
                if (!snapshot.get('active')) {
                    this.handleChatClosed();
                }
            });
        this.setState({ messageListener: listener });
    }

    onSend = (newMessage = []) => {
        newMessage.forEach(message => {
            console.log(this.state.convoRef.path);
            this.state.convoRef.collection('Messages').add(message);
        });
    }

    handleBack = () => {
        Alert.alert(
            "",
            "¿Estás seguro de que quieres finalizar esta conversación?",
            [
                {
                    text: "Finalizar",
                    onPress: () => {
                        this.setState({ chatClosed: true });
                        this.state.convoRef.update({ active: false }).then(this.props.navigation.goBack());
                    },
                    style: "cancel"
                },
                { text: "Cancelar" }
            ],
            { cancelable: false }
        );
    }

    handleChatClosed = () => {
        if (!this.state.chatClosed) {
            Alert.alert(
                "",
                "El otro participante finalizó la conversación",
                [
                    {
                        text: "ok",
                        onPress: () => {
                            this.props.navigation.goBack();
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#eeedd2' }}>
                <Header leftComponent={<Button type="clear" icon={{ name: 'arrow-back', size: 30, color: '#ffedd2', }} onPress={() => this.handleBack()} />} centerComponent={
                    <Text style={{ color: '#ffedd2', fontSize: 20 }}>{this.props.route.params[2]}</Text>
                }
                    containerStyle={{ backgroundColor: '#4f3976', }} />
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    showUserAvatar={true}
                    user={
                        {
                            _id: this.props.route.params[0].uid,
                            name: this.props.route.params[0].username,
                            avatar: this.props.route.params[0].profilePicture.uri,
                        }
                    }
                />
            </View>
        );
    }
}