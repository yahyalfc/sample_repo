import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Card, Text, TouchableRipple } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

function DisplayProfileEducation({ educations }: any) {
	const navigation = useNavigation();
	const onEdit = (index: number) => {
		navigation.navigate('CandidateEditEducationScreen', { whichEducationOrExperience: index });
	}

	const onAdd = () => {
		navigation.navigate('CandidateAddEducationScreen');
	}

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
				<View>
					<Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653", marginBottom: educations?.length ? 15 : 0 }}>Education</Text>
					<View style={{ paddingTop: 7, paddingBottom: 7, }}>
						{educations?.length ? educations.map((val: any, index: number) => (
							<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
								<View style={{ borderLeftWidth: 2, borderColor: '#BC9623', marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', width: '90%', }}>
									<View style={{ paddingLeft: 20, width: '100%' }}>
										{val?.current == true && val?.startYear ?
											<Text style={{ marginBottom: 3, fontFamily: "Lato-Regular", fontWeight: "400", fontStyle: "italic", fontSize: 14, color: "rgba(0, 0, 0, 0.85)" }}>{`${val?.startYear} - Present`}</Text>
											:
											val?.startYear && val?.endYear ?
												<Text style={{ marginBottom: 3, fontFamily: "Lato-Regular", fontWeight: "400", fontStyle: "italic", fontSize: 14, color: "rgba(0, 0, 0, 0.85)" }}>{`${val?.startYear} - ${val?.endYear}`}</Text>
												: null}
										{val?.degree ?
											<Text style={{ marginBottom: 3, fontFamily: 'Lato-Regular', fontWeight: '700', fontSize: 16, color: "rgba(0, 0, 0, 0.85)", width: '90%' }} numberOfLines={1}>{val?.degree}</Text>
											: null}
										<View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-end' }}>
											{val.schoolName ?
												<Text style={{ fontFamily: 'Lato-Regular', fontWeight: '700', fontSize: 14, color: "rgba(0, 0, 0, 0.85)", maxWidth: wp("45%"), }} numberOfLines={1}>@{val?.schoolName}</Text> : null}
											{val.location ?
												<Text style={{ fontFamily: 'Lato-Regular', fontWeight: '400', fontSize: 14, color: "rgba(0, 0, 0, 0.85)", paddingTop: 3, width: Platform.OS === "ios" ? "35%" : "45%", }} numberOfLines={1}> | {val?.location?.city},{val?.location?.country}</Text> : null}
										</View>
									</View>
								</View>
								<View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, }}>
									<TouchableOpacity
										activeOpacity={1}
										onPress={() => onEdit(index)}
									>
										<Image style={{ width: 24, height: 24 }} source={require("../../../../../assets/icons/Profile_icons/edit_icon.png")} />
									</TouchableOpacity>
									<Image style={{ height: 36, width: 36, resizeMode: "contain", borderRadius: 100 }} source={val.logo ? { uri: val.logo } : require("../../../../../assets/icons/Profile_icons/company_default_icon.png")} />
								</View>
							</View>
						)) : null}
					</View>
					<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
						<TouchableOpacity
							activeOpacity={1}
							onPress={onAdd}
						>
							<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
								<Image style={{ marginRight: 15, height: 25, width: 25 }} source={require("../../../../../assets/icons/Profile_icons/add_button.png")}></Image>
								<Text style={{ color: "#1D97A2", fontFamily: 'Lato-Regular', fontWeight: '500', fontSize: 18 }}>Add a new education</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	)
}

export default DisplayProfileEducation

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f6fb',

		marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
	},
	card: {
		// borderWidth: 2,
		// borderColor: 'orange',
		paddingHorizontal: hp('2%'),
		borderRadius: 30,
		backgroundColor: '#ffffff',
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
	touchContainer: {
		marginTop: hp('1.5%'),
		paddingVertical: hp('0.2%'),
		borderRadius: hp('0.5%'),
		// borderWidth: 1,
	},
	subheading: {
		fontSize: hp('1.5%'),
		color: '#989898',
		fontFamily: 'Lato-Bold',
	},
	mainHeadingex: {
		fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.2%'),
		color: '#012653',
		fontFamily: 'Lato-Bold',
		marginTop: hp('0.5%'),
		// width: wp('70%'),
	},
	mainHeadingey: {
		fontSize: Platform.OS == 'ios' ? hp('1.6%') : hp('1.8%'),
		color: '#012653',
		fontFamily: 'Lato-Bold',
		marginTop: hp('0.5%'),
		// width: wp('70%'),
	},
	mainHeading1: {
		fontSize: hp('2.2%'),
		color: '#012653',
		fontFamily: 'Lato-Regular',
		marginTop: hp('0.5%'),
		marginLeft: hp('0.5%'),
	},
	arrow: {
		marginRight: Platform.OS == 'ios' ? 0 : hp('0.5%'),
		resizeMode: 'contain',
		height: hp('2%'),
		alignSelf: 'center',
		// borderColor: 'red',
		// borderWidth:1
	},
	attachmentsView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// marginBottom: hp('2%'),
		// borderWidth: 1
	},
	addAttachemttxt: {
		color: '#989898',
		fontFamily: 'Lato-Bold',
		// height: hp('2%'),
		alignSelf: 'center',
		// borderRadius: hp('2%'),
		// marginBottom: hp('0.9%'),
		// borderWidth:1
	},
});