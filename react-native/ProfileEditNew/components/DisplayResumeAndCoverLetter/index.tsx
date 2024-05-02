import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


function DiplayResumeAndCoverLetter({ resume, coverLetter, bottomSheetHandler }: any) {

	return (
		<View style={{ width: "100%" }}>
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
				<View >
					<Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653", marginBottom: 15 }}>Attachments</Text>

					<View>
						<View style={{ marginBottom: 15 }}>
							<Text style={{ marginBottom: 10, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#495057" }}>Resume</Text>
							{resume?.url ?
								<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
									{resume?.name ?
										<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#012653", width: '80%' }} numberOfLines={1}>{resume?.name}</Text>
										:
										<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#012653", width: '80%' }} numberOfLines={1}>Untitled</Text>
									}
									<TouchableRipple
										onPress={() => bottomSheetHandler("resume")}
									>
										<Image source={require("../../../../../assets/icons/Profile_icons/edit_icon.png")} style={{ height: 22, width: 22, }}></Image>
									</TouchableRipple>
								</View>
								:
								<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", }}>
									<Text style={{ color: "rgba(0, 0, 0, 0.25)", fontFamily: "Lato-Regular", fontSize: 14, fontWeight: '600' }}>Upload resume.</Text>
									<TouchableRipple
										onPress={() => bottomSheetHandler("resume")}
									>
										<Image source={require("../../../../../assets/icons/Profile_icons/upload_icon.png")} style={{ height: 22, width: 22, }}></Image>
									</TouchableRipple>
								</View>
							}
						</View>
						<View>
							<Text style={{ marginBottom: 10, fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#495057" }}>Attachment</Text>
							{
								coverLetter.url ?
									<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", }}>
										{coverLetter.name ?
											<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#012653", width: '80%' }} numberOfLines={1}>{coverLetter.name}</Text>
											:
											<Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#012653", width: '80%' }} numberOfLines={1}>Untitled</Text>
										}
										<TouchableRipple
											onPress={() => bottomSheetHandler("attachments-coverletter")}
										>
											<Image source={require("../../../../../assets/icons/Profile_icons/edit_icon.png")} style={{ height: 22, width: 22 }}></Image>
										</TouchableRipple>
									</View>
									:
									<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", }}>
										<Text style={{ color: "rgba(0, 0, 0, 0.25)", fontFamily: "Lato-Regular", fontSize: 14, fontWeight: '600' }}>Upload attachment.</Text>
										<TouchableRipple
											onPress={() => bottomSheetHandler("attachments-coverletter")}
										>
											<Image source={require("../../../../../assets/icons/Profile_icons/upload_icon.png")} style={{ height: 22, width: 22 }}></Image>
										</TouchableRipple>
									</View>
							}
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default DiplayResumeAndCoverLetter

/**
  
 */
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
	lastTxtContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	lastTxt: {
		color: '#989898',
		fontFamily: 'Lato-Bold',
		alignSelf: 'center',
	},
});