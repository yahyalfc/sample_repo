import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

interface EditProfilePictureInterface {
	setProfilePictureCopy: Function;
	profilePicture: string;
	experiences: object[];
	educations: object[];
	userBio: {
		firstName: string;
		lastName: string;
		position: string;
		company: string;
		summary: string;
	};
	socialLinks: {
		github: string;
		facebook: string;
		linkedIn: string;
		twitter: string;
	};
	resume: ResumeInterface;
	coverLetter: ResumeInterface;
	updatedata: Function;
	closeBottomSheetHandler: Function;
	skills: any[]
	objectives: any[]
	languages: any[]
	coverPhoto: string
}

interface ResumeInterface {
	url: string;
	name: string;
}

function EditProfilePicture({
	updatedata,
	profilePicture,
	setProfilePictureCopy,
	closeBottomSheetHandler,
	experiences,
	educations,
	userBio,
	socialLinks,
	resume,
	coverLetter,
	skills,
	objectives,
	languages,
	coverPhoto
}: EditProfilePictureInterface) {
	const [loading, setloading] = useState(false);

	const addProfile = async (action: string) => {
		setloading(true);
		if (action == 'remove') {
			// make picture to null
			setProfilePictureCopy('');
			try {
				// updatedata = (profilePic: string, userBio: any, experiences: [], educations: [] )
				const { status } = await updatedata('', userBio, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto);
				if (status === 'complete') {
					setloading(false);
					closeBottomSheetHandler();
				}
			} catch (error: any) {
				console.log({ UpdatingProfilePicError: error });
				//display error
				Alert.alert('An error occured while updating the recruiter info.');
			}
		} else {
			ImagePicker.openPicker({
				width: 900,
				height: 900,
				cropping: true,
				includeBase64: true,
			})
				.then((image: any) => {
					uploadImageOnCloud(image.data);
				})
				.catch((err) => {
					setloading(false);
				});
		}
	};

	const uploadImageOnCloud = async (imageData: any) => {
		const formData = new FormData();
		formData.append('upload_preset', 'cqdbrmkw');
		formData.append('file', `data:image/jpeg;base64,${imageData}`);

		await axios
			.post('https://api.cloudinary.com/v1_1/blonk-group/image/upload', formData)
			.then(async (res) => {
				setProfilePictureCopy(res.data.secure_url);
				try {
					// updatedata = (profilePic: string, userBio: any, experiences: [], educations: [] )
					const { status } = await updatedata(res.data.secure_url, userBio, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto);

					if (status === 'complete') {
						setloading(false);
						closeBottomSheetHandler();
					}
				} catch (error: any) {
					setloading(false);
					Alert.alert('An error occured while updating the recruiter info.');
				}
			})
			.catch((err) => {
				console.log({ UpdatingProfilePicToCloudinaryError: err });
				setloading(false);
				Alert.alert('An error occured while uploading the file to our server.');
			});
	};

	return (
		<View style={{ backgroundColor: 'white', height: '100%', borderRadius: 15, shadowColor: 'rgba(0, 0, 0, 0.1)' }}>
			<Card style={{ borderRadius: 15, shadowColor: 'white', paddingHorizontal: 15 }} elevation={2}>
				<TouchableRipple onPress={() => closeBottomSheetHandler()}>
					<Image style={styles.logo} source={require('../../../../../assets/icons/line.png')} />
				</TouchableRipple>
				{loading ? (
					<ActivityIndicator style={{ marginTop: hp('5%') }} size={'small'} color='#000' />
				) : (
					<View style={{ paddingBottom: hp('2%') }}>
						<Text style={{ fontFamily: 'Lato-Regular', fontSize: 20, fontWeight: '600', color: '#012653' }}>Profile Picture</Text>
						{/* <TouchableRipple onPress={() => addProfile('add')}>
							<View style={{ marginVertical: hp('1%'), paddingHorizontal: hp('1%') }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image style={styles.bs1logo} source={require('../../../../../assets/icons/retweetA.png')} />
									<View>
										<Text style={styles.subheading1}>This will replace your existing profile picture.</Text>
										<Text style={styles.mainHeading2}>{profilePicture ? 'Replace' : 'Add'} profile picture</Text>
									</View>
								</View>
							</View>
						</TouchableRipple>
						<TouchableRipple style={{ marginTop: hp('1%') }} onPress={() => addProfile('remove')}>
							<View style={{ marginVertical: hp('1%'), paddingHorizontal: hp('1%') }}>
								<View style={{ flexDirection: 'row' }}>
									<Image style={styles.bs1logo} source={require('../../../../../assets/icons/trashA.png')} />
									<View>
										<Text style={styles.subheading1}>This will permanently delete your profile picture.</Text>
										<Text style={styles.mainHeading2}>Remove profile picture</Text>
									</View>
								</View>
							</View>
				</TouchableRipple> */}
						{profilePicture ? (
							<View>
								<View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, justifyContent: "space-between" }}>
									<View style={{ marginRight: 10 }}>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}>Replace my profile picture</Text>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 12, fontWeight: '600' }}>Max size 10MB, format: jpg or png</Text>
									</View>
									<TouchableRipple onPress={() => addProfile('add')}>
										<Image source={require('../../../../../assets/icons/Profile_icons/Replace_icon.png')} style={{ alignSelf: 'center', height: 22, width: 22 }}></Image>
									</TouchableRipple>
								</View>
								<View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, justifyContent: "space-between" }}>
									<View style={{ marginRight: 10 }}>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}>Remove my profile picture</Text>
									</View>
									<TouchableRipple onPress={() => addProfile('remove')}>
										<Image source={require('../../../../../assets/icons/Profile_icons/delete_icon.png')} style={{ alignSelf: 'center', height: 22, width: 22 }}></Image>
									</TouchableRipple>
								</View>
							</View>

						) : (
							<>
								<View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, justifyContent: "space-between" }}>
									<View style={{ marginRight: 10 }}>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}>Upload a profile picture</Text>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 12, fontWeight: '600' }}>Max size 10MB, format: jpg or png</Text>
									</View>
									<TouchableRipple onPress={() => addProfile('add')}>
										<Image source={require('../../../../../assets/icons/Profile_icons/upload_icon.png')} style={{ alignSelf: 'center', height: 22, width: 22 }}></Image>
									</TouchableRipple>
								</View><Text style={{ fontFamily: 'Lato-Regular', fontSize: 14, fontWeight: '400', color: '#990000' }}>Please enter a valid format.</Text>
							</>

						)}

					</View>
				)}
			</Card>
			{/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15, marginTop: "auto" }}>
				<TouchableRipple onPress={() => closeBottomSheetHandler()}>
					<Button
						mode='contained'
						labelStyle={{ color: '#C30000', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}
						color='#fff'
						style={{ borderRadius: 50, width: wp('25%'), marginRight: 50 }}
						uppercase={false}
					>
						Cancel
					</Button>
				</TouchableRipple>
				<Button
					// loading={isLoading}
					mode='contained'
					color="#012653"
					labelStyle={{ fontFamily: 'Lato-Regular', fontWeight: '400', fontSize: 16, color: 'white' }}
					uppercase={false}
					style={{ marginRight: hp('2%'), borderRadius: 50, width: wp('25%') }}
				>
					Save
				</Button>
			</View> */}
		</View>
	);
}

export default EditProfilePicture;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f6fb',

		marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
	},
	card: {
		height: hp('70%'),
		paddingHorizontal: hp('2%'),
		borderRadius: 30,
		backgroundColor: '#ffffff',
		// marginHorizontal: wp('4%'),
		// marginTop: Platform.OS == 'ios' ? hp('2.5%') : hp('2.8%'),
		paddingVertical: hp('2.5%'),
		// marginBottom: hp('3%'),
		// width: wp('87.69%'),
	},
	headingContainer: {
		flexDirection: 'row',
		paddingBottom: hp('1%'),
	},
	cardText: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.5%'),
		fontFamily: 'Lato-Bold',
		color: '#1570ee',
		// borderWidth: 2,
		// borderColor: 'orange',
	},
	cardIcon: {
		resizeMode: 'contain',
		height: Platform.OS == 'ios' ? hp('2.5%') : hp('2.4%'),
		width: Platform.OS == 'ios' ? hp('2.5%') : hp('2.4%'),
		marginRight: hp('1.5%'),

		// borderWidth: 2,
		// borderColor: 'orange',
	},
	cardText1: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.5%'),
		fontFamily: 'Lato-Bold',
		color: '#1570ee',
		marginBottom: hp('2%'),
		// borderWidth: 2,
		// borderColor: 'orange',
	},
	bs1logo: {
		marginRight: Platform.OS == 'ios' ? hp('1%') : hp('1%'),
		resizeMode: 'contain',
		height: hp('2.5%'),
		width: hp('4%'),
		alignSelf: 'center',
		marginBottom: hp('0.5%'),
		// borderColor: 'red',
		// borderWidth:1
	},

	subheading1: {
		fontSize: hp('1.7%'),
		color: '#989898',
		fontFamily: 'Lato-Bold',
		marginBottom: hp('0.5%'),
	},
	mainHeading2: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.2%'),
		color: '#012653',
		fontFamily: 'Lato-Bold',
		marginBottom: hp('0.5%'),
	},
	logo: {
		marginRight: Platform.OS == 'ios' ? hp('1%') : hp('1%'),
		resizeMode: 'contain',
		height: hp('4%'),
		width: hp('100%'),
		alignSelf: 'center',
	},
});
