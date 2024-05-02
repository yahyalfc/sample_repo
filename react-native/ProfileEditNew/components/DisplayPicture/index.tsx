import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image as REImage } from 'react-native-elements';

function DisplayProfilePicture({ profilePic, coverPhoto, bottomSheetHandler }: any) {
	const [profilePicLocal, setprofilePicLocal] = useState(profilePic);
	useEffect(() => {
		setprofilePicLocal(profilePic);
	}, [profilePic])

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
				<View>
					<Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653", marginBottom: 15 }}>Profile & banner pictures</Text>
					<View style={{ width: "100%", height: 125, display: "flex", flexDirection: "row", }}>
						<View style={{ position: "relative", width: "35%", height: "100%" }}>
							<TouchableOpacity
								onPress={() => bottomSheetHandler("profile-picture")} //onclick array index 0 will be chosen
							>
								<REImage style={{ width: "100%", height: "100%", resizeMode: "cover", zIndex: 10 }} source={profilePicLocal ? { uri: profilePicLocal } : require('../../../../../assets/icons/Profile_icons/user_icon.png')} />
								<Image style={{ resizeMode: "contain", zIndex: 50, position: "absolute", alignSelf: "center", top: 95, height: 21, width: 25 }} source={require("../../../../../assets/icons/Profile_icons/camera_icon.png")}></Image>
							</TouchableOpacity>

						</View>
						<View style={{ position: "relative", width: "65%", height: "100%", paddingLeft: 20 }}>
							<TouchableOpacity
								onPress={() => bottomSheetHandler("banner-picture")} //onclick array index 0 will be chosen
							>
								<REImage style={{ width: "100%", height: "100%", resizeMode: "cover", }} source={coverPhoto ? { uri: coverPhoto } : require('../../../../../assets/icons/Profile_icons/cover_default.png')}></REImage>
								<Image style={{ resizeMode: "contain", zIndex: 50, position: "absolute", top: 95, alignSelf: "center", height: 21, width: 25 }} source={require("../../../../../assets/icons/Profile_icons/camera_icon.png")}></Image>
							</TouchableOpacity>

						</View>
					</View>
				</View>

			</View>
		</View>
	)
}

export default DisplayProfilePicture

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
	},
	card: {
		// borderWidth: 2,
		// borderColor: 'orange',
		paddingHorizontal: hp('2%'),
		borderRadius: 30,
		backgroundColor: 'red',
		marginHorizontal: wp('4%'),
		marginTop: Platform.OS == 'ios' ? hp('2.5%') : hp('2.8%'),
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
	imageContainer: {
		flexDirection: 'row',
		marginVertical: hp('2%'),
	},
	userImage: {
		height: hp('13%'),
		width: hp('10%'),
		resizeMode: 'cover',
		borderColor: 'rgba(0,0,0,0.2)',
		borderWidth: 1,
		borderRadius: 5,
		// paddingRight: hp('2%'),
	}
});