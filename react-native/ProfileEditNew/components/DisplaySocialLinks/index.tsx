import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface EditBioInterface {
	profilePicture: string,
	experiences: object[];
	educations: object[];
	userBio: {
		firstName: string;
		lastName: string;
		position: string;
		company: string;
		summary: string;
	}
	socialLinks: {
		github: string;
		facebook: string;
		linkedIn: string;
		twitter: string;
	};
	resume: ResumeInterface;
	coverLetter: ResumeInterface;
	updatedata: Function;
	closeBottomSheetHandler: Function,
	setSocialLinks: Function
	objectives: any[]
	languages: any[]
	coverPhoto: string
	skills: any[]
}

interface ResumeInterface {
	url: string;
	name: string
}

function DisplaySocialLinks({ updatedata, userBio, closeBottomSheetHandler, profilePicture, experiences, educations, resume, coverLetter, socialLinks, setSocialLinks, skills, objectives, languages, coverPhoto }: EditBioInterface) {
	// const { github, linkedIn, facebook, twitter } = socialLinks;
	const { github, facebook, twitter, linkedIn } = socialLinks;
	const [linkedInCopy, setlinkedInCopy] = useState(linkedIn)
	const [githubInCopy, setgithubInCopy] = useState(github)
	const [facebookCopy, setfacebookCopy] = useState(facebook)
	const [twitterCopy, settwitterCopy] = useState(twitter)
	const [isLoading, setisLoading] = useState(false);

	const [showButtons, setshowButtons] = useState(false);

	useEffect(() => {
		if (github == githubInCopy && facebook == facebookCopy && twitterCopy == twitter && linkedIn == linkedInCopy) {
			setshowButtons(false)
		} else {
			setshowButtons(true)
		}
	}, [github, facebook, twitter, linkedIn, linkedInCopy, githubInCopy, facebookCopy, twitterCopy])


	const onSubmit = async () => {
		try {
			setisLoading(true);
			const { status } = await updatedata(profilePicture, userBio, experiences, educations, { github: githubInCopy, linkedIn: linkedInCopy, facebook: facebookCopy, twitter: twitterCopy }, resume, coverLetter, skills, objectives, languages, coverPhoto);
			if (status === "complete") {
				setisLoading(false)
				setSocialLinks({ github: githubInCopy, linkedIn: linkedInCopy, facebook: facebookCopy, twitter: twitterCopy });
				closeBottomSheetHandler();
				Keyboard.dismiss()
			}
		} catch (error: any) {
			console.log({ error });

			//display error 
			Alert.alert('An error occured while updating the recruiter info.');
			Keyboard.dismiss()
		}
	}

	const onCancel = () => {
		setlinkedInCopy(linkedIn)
		setgithubInCopy(github)
		setfacebookCopy(facebook)
		settwitterCopy(twitter)
	}

	return (
		<View style={{ width: "100%" }}>
			<View style={{
				backgroundColor: "#ffff", marginLeft: 15, marginRight: 15, marginTop: 15, borderRadius: 15, shadowColor: '#000', marginBottom: 15,
				shadowOffset: {
					width: 1,
					height: 1,
				},
				shadowOpacity: 0.1,
				shadowRadius: 3,
				padding: 15,
			}}>
				<View >
					<Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#02295A", marginBottom: 15 }} >Social media</Text>
					<View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderColor: "#BC9623", marginBottom: 15 }}>
							<View>
								<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: "#7C7C7C" }}>LinkedIn</Text>
								<TextInput autoCapitalize="none" style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400",paddingLeft:-1 }} placeholderTextColor="rgba(0, 0, 0, 0.25)" onChangeText={(text: any) => setlinkedInCopy(text)} value={linkedInCopy} placeholder="www.linkedIn.com"  />
							</View>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderColor: "#BC9623", marginBottom: 15 }}>
							<View>
								<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: "#7C7C7C" }}>Facebook</Text>
								<TextInput autoCapitalize="none" placeholder='www.facebook.com' style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400",paddingLeft:-1 }} placeholderTextColor="rgba(0, 0, 0, 0.25)" onChangeText={(text: any) => setfacebookCopy(text)} value={facebookCopy} />
							</View>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderColor: "#BC9623", marginBottom: 15 }}>
							<View>
								<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: "#7C7C7C" }}>Github</Text>
								<TextInput onChangeText={(text: any) => setgithubInCopy(text)} value={githubInCopy} autoCapitalize="none" style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400",paddingLeft:-1 }} placeholderTextColor="rgba(0, 0, 0, 0.25)" placeholder="www.github.com" />
							</View>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderColor: "#BC9623", marginBottom: 15 }}>
							<View>
								<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: "#7C7C7C" }}>Twitter</Text>
								<TextInput autoCapitalize="none" style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400",paddingLeft:-1 }} placeholderTextColor="rgba(0, 0, 0, 0.25)" placeholder="www.twitter.com" onChangeText={(text: any) => settwitterCopy(text)} value={twitterCopy} />
							</View>
						</View>
					</View>
					{showButtons && <Text style={{ marginTop: 5, fontSize: hp('1.7%'), fontWeight: "400", color: "#990000", alignSelf: "flex-start", fontFamily:"Lato-Regular" }}>Please save, otherwise your changes will be discarded.</Text>}
					{/** action buttons */}
					{showButtons && <View style={{ marginVertical: hp('2%'), flexDirection: 'row', justifyContent: 'space-between', }}>
						<Button
							mode="contained"
							labelStyle={{ color: '#C30000', fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600" }}
							color="#fff"
							onPress={() => onCancel()}
							style={{ borderRadius: 50, width: wp('25%') }}
							uppercase={false}
						>
							Cancel
						</Button>
						<Button
							loading={isLoading}
							mode="contained"
							color="#012653"
							labelStyle={{ fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 16, color: "white" }}
							uppercase={false}
							style={{ marginRight: hp('2%'), borderRadius: 50, width: wp('25%'), shadowColor: "rgba(31, 64, 107, 0.25)" }}
							onPress={() => onSubmit()}
						>
							Save
						</Button>
					</View>}
				</View>
			</View>
		</View >
	)
}

export default DisplaySocialLinks

/**
  
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f6fb',
		marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
	},
	subheading: {
		fontSize: 16,
		fontWeight: "400",
		color: '#7C7C7C',
		fontFamily: 'Lato-Regular',
	},
	inputField: {
		marginTop: 15, fontSize: 16, fontWeight: "400", fontFamily: "Lato-Regular"
	}
});