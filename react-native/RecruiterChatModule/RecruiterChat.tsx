import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
// import DocumentPicker from 'react-native-document-picker';\]
// import RNFetchBlob from 'rn-fetch-blob';
// import storage from '@react-native-firebase/storage';
import { useMutation } from '@apollo/client';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { reverse } from 'lodash';
import moment from 'moment';
import 'react-native-get-random-values';
import { Bubble, Day, GiftedChat, Time } from 'react-native-gifted-chat';
import HeaderWithChatAndBackButton from '../../../components/HeaderWithChatAndBackButton';
import { SEND_FCM_TOKEN_ON_MESSAGE } from '../../../helper/graphQL/mutations/notificationMutation';
import { saveCurrentScreen } from '../../../store/actions/DrawerNavigation';
import { Notification } from '../../../interfaces/notifications';
import HeaderNextButton from '../../../components/HeaderNextButton';
import HeaderBackButton from '../../../components/HeaderBackButton';
import HeaderWithoutNextButton from '../../../components/HeaderWithoutNextButton';

interface Chat {
	name: string;
	message: string;
	timestamp: any;
	id?: number;
}

const RecruiterChat = (props: any) => {
	const goBack = () => {
		props.navigation.goBack();
	};
	const isFocused = useIsFocused();

	// const flatlistRef = useRef<ScrollView>(null);
	// const [inputVal, setinputVal] = useState('');
	// const [progress, setProgress] = useState(0);

	const { matchId, candidateName, candidateId, jobId, candidatePicture, companyId } = props.route.params;
	const [isImageUpload, setIsImageUpload] = useState(false);
	const [isKeyboardVisible, setKeyboardVisible] = useState(hp('1%'));

	let user = useSelector((state: any) => state.LoginCandidateReducer);
	let { fullName, profilePicture, token, _id } = user;
	const { notifications } = useSelector((state: any) => state.notificationBlip);
	const showBlip = notifications.find((notif: Notification) => notif.type == "chat") ? true : false;

	const [sendMessage, { data: data, error: error }] = useMutation(SEND_FCM_TOKEN_ON_MESSAGE);
	const [messages, setMyMessages] = useState<any>([]);

	const route = useRoute();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!!isFocused) {
			dispatch(saveCurrentScreen(route.name));
		}
		// const updatedNotificationList = notifications.filter((notif: { matchId: String, jobId: String }) => notif.matchId !== matchId);
	}, [isFocused])

	const handleChat = () => {
		props.navigation.navigate('ChatCompaniesList');
	}

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e: any) => {
			if (Platform.OS == 'ios') {
				setKeyboardVisible(e.startCoordinates.height + hp('6%'));
			}
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			if (Platform.OS == 'ios') {
				setKeyboardVisible(hp('1%'));
			}
		});

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);


	const sendNewMessage = (newMessage: any[]) => {
		newMessage[0].createdBy = user.id;
		sendMessageRequestToBackend(token, newMessage[0].text);
		setMyMessages(GiftedChat.append(messages, newMessage));
	};

	const sendMessageRequestToBackend = async (token: any, message: string) => {
		// const lastMessageOfCandidate = messages.find((message: any) => message.createdBy === candidateId);
		const lastMessageOfRecruiter = messages.find((message: any) => message.createdBy === user.id);
		const payload = { type: "chat", source: "mobile", matchId, recruiterId: user.id, senderId: user.id, jobId, candidateId, companyId, timeStampOfMyLastMessage: lastMessageOfRecruiter?.firebaseTimestamp || null }

		sendMessage({
			variables: {
				sendTo: candidateId,
				myRole: "recruiter",
				message,
				payload
				// recruiterId is _id of recruiter in recruiters table
				//senderId is candidate's _id in candidateListing table
			},
			context: {
				headers: {
					authorization: `Bearer ${token}`,
				},
			},
		})
			.then((res) => {
				if (Platform.OS == 'ios') {
					Keyboard.dismiss();
				}

				// setinputVal('');
			}).catch((err) => {
				console.log('🚀 ~ Chat message error', err);
				console.log({ err })
			})
	}

	useEffect(() => {
		try {
			if (matchId) {
				firestore()
					.collection('new-chats')
					.doc(matchId)
					.collection(user.id)
					.orderBy('timestamp', 'asc')
					.onSnapshot((snapshot: any) => {
						let result = snapshot?.docs?.map((s: any) => ({ id: s.id, ...s?.data() }));
						result = result.map((e: any) => {
							const seconds = e?.timestamp?.seconds || 0
							const nanoseconds = e?.timestamp?.nanoseconds || 0

							if (seconds || nanoseconds) {
								let dt = new firebase.firestore.Timestamp(e?.timestamp?.seconds, e?.timestamp?.nanoseconds);
								return {
									_id: e.id,
									text: e.message.replace(/<\/?[^>]+(>|$)/g, ''),
									createdAt: moment(new Date(dt.toDate())).format('M/D/YY HH:mm:ss',),
									createdBy: e.senderId,
									firebaseTimestamp: e?.timestamp,
									user: {
										_id: e.senderId,
										avatar: e.senderId === user.id ? profilePicture : candidatePicture,
										name: e.senderId === user.id ? user.fullName : candidateName,
									},
								};
							}
						});
						setMyMessages(reverse(result));
					});
			}
		} catch (error) {
			console.log({ error });
		}
	}, []);

	useEffect(() => {
		getPermissionIOS();
	}, []);

	const getPermissionIOS = async () => {
		if (Platform.OS === 'ios') {
			// console.log('we using ios');
			//   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			//   if (status !== 'granted') {
			// 	 Alrt('Sorry, we need camera roll permissions to make this work!');
			//   }
		}
	};

	const renderTime = (props: any) => {
		return (
			<Time
				{...props}
				timeTextStyle={{
					right: {
						color: '#333333',
						size: 12,
					},
					left: {
						color: '#333333',
						size: 12,
					},
				}}
				timeFormat="HH:mm"

			/>
		);
	}

	const renderDay = (props: any) => {
		return (
			<Day
				{...props}
				dateFormat="DD/MM/YY"
				textStyle={{ fontWeight: "600", fontSize: 14 }}

			/>
		);
	}

	const renderBubble = (props: any) => {
		if (props?.currentMessage?.createdBy !== user?.id) {
			return (
				<View style={{ marginTop: 15, }}>
					<Text style={{ fontWeight: "400", fontSize: 14, color: "#012653", }}>{props?.currentMessage?.user?.name}</Text>
					<Bubble
						{...props}
						wrapperStyle={{
							left: {
								backgroundColor: '#FFFFFF',
							},
						}}
						textStyle={{
							left: {
								lineHeight: 19.2,
								fontSize: 16,
								color: '#000000',
							},
						}}
						timeTextStyle={{
							left: { color: 'black' },
						}}
						renderTime={renderTime}
					/>
				</View>
			);
		} else {
			return (
				<View style={{ marginTop: 15 }}>
					<Bubble
						{...props}
						wrapperStyle={{
							right: {
								backgroundColor: "#B8D8FF80",
							},
						}}
						key={props.currentMessage._id}
						textStyle={{
							right: {
								lineHeight: 19.2,
								fontSize: 16,
								color: '#000000',
							},
						}}
						timeTextStyle={{
							right: { color: 'black' }
						}}
						renderTime={renderTime}

					/>
				</View>
			);
		}

	}

	if (isImageUpload) {
		return (
			<View style={{ flex: 1 }}>
				<HeaderWithoutNextButton headerTitle={`${candidateName}`} goBack={goBack} />
				{/* <HeaderBackButton headerTitle={`${candidateName}`} showBlip={showBlip} handleChat={handleChat} goBack={goBack} /> */}

				<View style={{ justifyContent: 'center', flexDirection: 'row', padding: 10 }}>
					<ActivityIndicator size="large" color={'f4f7fc'} />
				</View>
			</View>
		);
	} else {
		return (
			<SafeAreaView style={styles.container} edges={['right', 'left']} mode='margin'>
				{/* <HeaderBackButton headerTitle={`${candidateName}`} showBlip={showBlip} handleChat={handleChat} goBack={goBack} /> */}
				<HeaderWithoutNextButton headerTitle={`${candidateName}`} goBack={goBack} />
				<GiftedChat
					messages={messages}
					onSend={(msg) => sendNewMessage(msg)}
					user={{
						_id: user.id,
						avatar: profilePicture,
						name: user.fullName,
					}}
					timeTextStyle={{ left: { color: 'red' }, right: { color: 'red' } }}
					// renderUsernameOnMessage={true}
					renderAvatar={(props) => {
						return null
						// (<Avatar {...props}/>)
					}}
					renderDay={renderDay}

					showAvatarForEveryMessage={true}
					// renderActions={() => (
					// 	<React.Fragment>
					// 		<IconButton
					// 			icon="paperclip"
					// 			color='black'
					// 			size={hp('3%')}
					// 			//    onPress={pickDocument}
					// 			onPress={() => console.log('hello')}
					// 		/>
					// 	</React.Fragment>
					// )}
					renderBubble={renderBubble}
				/>
			</SafeAreaView>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f4f7fc',
	},
	ActivityIndicator: {
		position: 'absolute',
		right: '5%',
	},
	card: {
		borderRadius: 30,
		backgroundColor: '#ffffff',
		marginHorizontal: wp('4%'),
		marginTop: hp('3%'),
		marginBottom: hp('3%'),
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,

		elevation: 4,
	},
	cardContainer: {
		justifyContent: 'center',
		marginTop: hp('5.5%'),
		marginBottom: hp('4.5%'),
		marginHorizontal: wp('7%'),
	},
	txt: {
		flexDirection: 'row',
		flex: 1, //mycomment
		borderWidth: 1,
		borderColor: '#ffffff',
		fontFamily: 'Lato-Bold',
		fontSize: hp('2%'),
		height: hp('5%'),
	},
	txtIOS: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#ffffff',
		fontFamily: 'Lato-Bold',
		fontSize: hp('1.8%'),
		flex: 1,
		height: hp('5%'),
	},
	errorMessage: {
		marginBottom: hp('2.5%'),
		marginTop: hp('0.5%'),
		marginLeft: wp('1%'),
		fontFamily: 'Lato-Bold',
		fontSize: hp('1.8%'),
	},

	errorMessageIOS: {
		marginBottom: hp('2.5%'),
		marginTop: hp('0.5%'),
		marginLeft: wp('1%'),
		fontFamily: 'Lato-Bold',
		fontSize: hp('1.6%'),
	},
	sendMessageContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: hp('2%'),
		padding: hp('1%'),
		width: '100%',
		backgroundColor: '#f4f7fc',
		marginBottom: hp('1%'),
	},
	chatMessage: {
		position: 'relative',
		fontSize: 16,
		padding: 10,
		borderRadius: 10,
		backgroundColor: '#DAB238',
		marginBottom: 30,
		borderTopLeftRadius: 2,
	},
	chatReceiver: {
		marginLeft: 'auto',
		backgroundColor: '#2E4A79',
	},
	textRight: {
		textAlign: 'right',
		fontWeight: '600',
	},
	textJustify: {
		textAlign: 'justify',
		color: 'white',
		fontWeight: '600',
	},
});

export default RecruiterChat;


/*					
				<ScrollView ref={flatlistRef} style={{ paddingHorizontal: 10, backgroundColor: '#f4f7fc' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						{messages.length && flatlistRef.current !== null ? (
							<FlatList
								onContentSizeChange={() => flatlistRef.current?.scrollToEnd({ animated: true })}
								onLayout={() => flatlistRef.current?.scrollToEnd({ animated: true })}
								data={messages}
								renderItem={renderItem}
								// keyExtractor={(item) => item.id}
							/>
						) : null}
					</View>
				</ScrollView>
				{
				Platform.OS === "ios" ? 
				<KeyboardAvoidingView behavior='padding'>
					<View style={{ ...styles.sendMessageContainer, }}>
						// Removed the attachment icon for now 
						// <View style={{backgroundColor: '#2E4A79', borderRadius:30, marginRight: hp('0.5%')}}>
						//	<IconButton
						//		  icon="paperclip"
						//		  color='white'
						//		  size={hp('2.3%')}
						//		//   onPress={pickDocument}
						//	/>
					//	</View> 
					
						<View style={[Platform.OS === 'ios' ? styles.txtIOS : styles.txt, { borderColor: '#949494', borderRadius: 30, paddingHorizontal: 15, backgroundColor: '#2E4A79', height: hp('5.5%') }]}>
							<TextInput
								style={{ flex: 1, color: 'white' }}
								onChangeText={(text) => setinputVal(text)}
								value={inputVal}
								maxLength={500}
								placeholder='Type a message'
								placeholderTextColor="white"
								underlineColorAndroid="transparent"
							/>
							<IconButton icon="send" color="white" size={hp('2.5%')} onPress={() => sendNewMessage()} />
						</View>
						
					
					</View>
					</KeyboardAvoidingView>

					: <View style={{ ...styles.sendMessageContainer, }}>
					// Removed the attachment icon for now 
					// <View style={{backgroundColor: '#2E4A79', borderRadius:30, marginRight: hp('0.5%')}}>
					//	<IconButton
					//		  icon="paperclip"
					//		  color='white'
					//		  size={hp('2.3%')}
					//		//   onPress={pickDocument}
					//	/>
				//	</View> 
				
					<View style={[ styles.txt, { borderColor: '#949494', borderRadius: 30, paddingHorizontal: 15, backgroundColor: '#2E4A79', height: hp('5.5%') }]}>
						<TextInput
							style={{ flex: 1, color: 'white' }}
							onChangeText={(text) => setinputVal(text)}
							value={inputVal}
							maxLength={500}
							placeholder='Type a message'
							placeholderTextColor="white"
							underlineColorAndroid="transparent"
						/>
						<IconButton icon="send" color="white" size={hp('2.5%')} onPress={() => sendNewMessage()} />
					</View>
					
				
				</View>
				}
				
	*/