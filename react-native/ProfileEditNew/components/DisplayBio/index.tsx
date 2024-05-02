import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface EditBioInterface {
	setUserBio: Function,
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
	objectives: any[]
	languages: any[]
	coverPhoto: string
	skills: any[]
}

interface ResumeInterface {
	url: string;
	name: string
}

function DisplayProfileBio({ updatedata, userBio, setUserBio, closeBottomSheetHandler, profilePicture, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto }: EditBioInterface) {
	const [firstNameCopy, setfirstNameCopy] = useState(userBio?.firstName);
	const [lastNameCopy, setlastNameCopy] = useState(userBio?.lastName);
	const [positionCopy, setpositionCopy] = useState(userBio?.position);
	const [companyCopy, setcompanyCopy] = useState(userBio?.company)
	 
	const [isLoading, setisLoading] = useState(false);
	const [showButtons, setshowButtons] = useState(false)

	useEffect(() => {
		if (firstNameCopy == userBio.firstName && lastNameCopy == userBio.lastName && positionCopy == userBio.position && userBio.company == companyCopy) {
			setshowButtons(false)
		} else {
			setshowButtons(true)
		}
	}, [userBio, firstNameCopy, lastNameCopy, companyCopy, positionCopy])

	 

	const onSubmit = async () => {
		if (!firstNameCopy || !lastNameCopy || !companyCopy  || !positionCopy) {
			return Alert.alert('Some field data is missing');
		} 
			try {
				setisLoading(true);
				// updatedata = (profilePic: string, userBio: any, experiences: [], educations: [] )
				const { status } = await updatedata(profilePicture, { firstName: firstNameCopy, lastName: lastNameCopy, position: positionCopy, company: companyCopy, summary: userBio?.summary }, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto);
				if (status === "complete") {
					setisLoading(false);
					setUserBio({ firstName: firstNameCopy, lastName: lastNameCopy, position: positionCopy, company: companyCopy, summary: userBio?.summary })
					closeBottomSheetHandler();
					Keyboard.dismiss()
				}
			} catch (error: any) {
				//display error 
				Alert.alert('An error occured while updating the candidate bio.');
				//setting values to default
				setfirstNameCopy(userBio?.firstName);
				setlastNameCopy(userBio?.lastName);
				setpositionCopy(userBio?.position);
				setcompanyCopy(userBio?.company);
				 
				Keyboard.dismiss()
			}
		 
	}

	const onCancel = () => {
		//setting values to default
		setfirstNameCopy(userBio?.firstName);
		setlastNameCopy(userBio?.lastName);
		setpositionCopy(userBio?.position);
		setcompanyCopy(userBio?.company); 
	}

	return (
		<View style={{ width: "100%", }}>
			<View style={{
				backgroundColor: "#ffff", marginLeft: 15, marginRight: 15, marginTop: 15, borderRadius: 15, shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1,
				},
				shadowOpacity: 0.1,
				shadowRadius: 3,
				padding: 15,
			}}>
				<View  >
					<Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653", marginBottom: 15 }}>Personal information</Text>
				</View>

				<View>
					<View style={{ width: "100%", display: "flex", flexDirection: "column", marginBottom: 15, }}>
						{/** First name */}
						<View style={{ width: "100%", marginBottom: 15 }}>
							<View style={{ display: "flex", flexDirection: "column", borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5 }}>
								<View style={{ display: 'flex', flexDirection: 'row' }}>
									<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)' }}>*</Text>
									<Text style={{ marginBottom: 10, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)' }}>First name</Text>
								</View>
								<TextInput onChangeText={(text) => setfirstNameCopy(text)} value={firstNameCopy} style={{ fontFamily: "Lato-Regular",width:"100%", fontWeight: "400", fontSize: 16, color: "#495057", textAlign: "justify" }} />
							</View>
							<Text style={{ display: firstNameCopy ? "none" : "flex", fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 14, color: "#990000" }}>Please enter your first name</Text>
						</View>
						{/** Last name */}
						<View style={{ width: "100%", }}>
							<View style={{ display: "flex", flexDirection: "column", borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5 }}>
								<View style={{ display: 'flex', flexDirection: 'row' }}>
									<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)' }}>*</Text>
								<Text style={{ marginBottom: 10, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)',width:"100%",  }}>Last name</Text>
								</View>
								<TextInput onChangeText={(text) => setlastNameCopy(text)} value={lastNameCopy} style={{ fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 16, color: "#495057", textAlign: "justify" }} />
							</View>
							<Text style={{ display: lastNameCopy ? "none" : "flex", fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 14, color: "#990000" }}>Please enter your second name</Text>
						</View>
					</View>
					{/** position */}
					<View style={{ marginBottom: 15, }}>
						<View style={{ display: "flex", flexDirection: "column", borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5 }}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
									<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)' }}>*</Text>
							<Text style={{ marginBottom: 10, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)',width:"100%",  }}>Job title</Text>
							</View>
							<TextInput onChangeText={(text) => setpositionCopy(text)} value={positionCopy} style={{ fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 16, color: "#495057", textAlign: "justify", }} />
						</View>
						<Text style={{ display: positionCopy ? "none" : "flex", fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 14, color: "#990000" }}>Please enter your job title</Text>
					</View>
					{/** company */}
					<View style={{ marginBottom: 15 }}>
						<View style={{ display: "flex", flexDirection: "column", borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5 }}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
									<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)' }}>*</Text>
							<Text style={{ marginBottom: 10, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)',width:"100%",  }}>Company</Text>
							</View>
							<TextInput onChangeText={(text) => setcompanyCopy(text)} value={companyCopy} style={{ fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 16, color: "#495057", textAlign: "justify", }} />
						</View>
						<Text style={{ display: companyCopy ? "none" : "flex", fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 14, color: "#990000" }}>Please enter your company name</Text>
					</View>
					{/** summary section */}
					<View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
						{/* <View style={{ borderBottomWidth: 2, borderBottomColor: "#BC9623", paddingBottom: 5, marginBottom: 10 }}>
							<View style={{ display: 'flex', flexDirection: 'row' }}>
								<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400", color: 'rgba(0, 0, 0, 0.85)' }}>*</Text>
								<Text style={{ marginBottom: summaryCopy ? 15 : 0, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "400" }}>Summary</Text>
							</View>
							<TextInput maxLength={1499} multiline={true} onChangeText={(text) => setsummaryCopy(text)} value={summaryCopy} style={{ fontFamily: "Lato-Regular", fontWeight: "400", fontSize: 16, color: "#495057", textAlign: "justify",width:"100%"  }} />
						</View>
						<Text style={{ fontSize: 10, fontWeight: "400", color: "#008D8B", alignSelf: "flex-end" }}>{summaryCount > 0 ? summaryCount : 0} characters remaining</Text> */}
						{showButtons && <Text style={{ marginTop: 5, fontSize: hp('1.7%'), fontWeight: "400", color: "#990000", alignSelf: "flex-start", fontFamily: "Lato-Regular" }}>Please save, otherwise your changes will be discarded</Text>}
					</View>
				</View>
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
						style={{ marginRight: hp('2%'), borderRadius: 50, width: wp('25%') }}
						onPress={() => onSubmit()}
					>
						Save
					</Button>
				</View>
				}
			</View>
		</View >
	)
}

export default DisplayProfileBio

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f6fb',
		marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
	},
	card: {
		paddingHorizontal: hp('2%'),
		borderRadius: 30,
		backgroundColor: '#ffffff',
		marginHorizontal: wp('4%'),
		marginTop: Platform.OS == 'ios' ? hp('2.5%') : hp('2.8%'),
		paddingVertical: hp('2.5%'),
	},
	headingContainer: {
		flexDirection: 'row',
		paddingBottom: hp('1%'),
	},
	cardText: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.5%'),
		fontFamily: 'Lato-Bold',
		color: '#1570ee',
	},
	cardIcon: {
		resizeMode: 'contain',
		height: Platform.OS == 'ios' ? hp('2.5%') : hp('2.4%'),
		width: Platform.OS == 'ios' ? hp('2.5%') : hp('2.4%'),
		marginRight: hp('1.5%'),
	},
	mainHeading: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.2%'),
		color: '#012653',
		fontFamily: 'Lato-Bold',
		marginTop: hp('0.5%'),
		width: wp('70%'),
	},
	subheading: {
		fontSize: hp('1.5%'),
		color: '#989898',
		fontFamily: 'Lato-Bold',
	},
	arrow: {
		marginRight: Platform.OS == 'ios' ? 0 : hp('0.5%'),
		resizeMode: 'contain',
		height: hp('2%'),
		alignSelf: 'center',
	},
	mainHeadingNotAdded: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.2%'),
		color: '#989898',
		fontFamily: 'Lato-Bold',
		marginTop: hp('0.5%'),
	},
});