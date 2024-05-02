import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, Platform, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Card, TouchableRipple } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GET_OBJECTIVES } from '../../../../../helper/graphQL/queries/registerCandidate';

interface Objectives {
	_id: string,
	title: string,
	isArchived: boolean
	isDeleted: boolean
	createdBy: string
}

interface FormattedSkills {
	_id: string;
	title: string
}

function AddObjectives({ closeBottomSheetHandler, setobjectivesCopy, objectivesCopy, updatedata, profilePicture, experiences, educations, userBio, socialLinks, resume, coverLetter, skills, languages, coverPhoto }: any) {

	const [objectivesLocal, setObjectivesLocal] = useState(objectivesCopy);
	const [loading, setloading] = useState(false);

	useEffect(() => {
		setObjectivesLocal(objectivesCopy)
	}, [objectivesCopy])

	const deleteObjective = async (id: string) => {
		setObjectivesLocal((objectivesLocal: any) => objectivesLocal.filter((objective: any) => objective._id != id))
	}


	//fetching all the objectives
	const {
		data: candidateObjectives,
		loading: loadingObjectives,
		error,
	} = useQuery(GET_OBJECTIVES, {
		variables: {
			status: 'Approved',
		},
		fetchPolicy: 'network-only',
	})
	// we will set all of fetched objectives into this variable
	const [objectiveData, setObjectiveDataCopy] = useState([]);
	//updating the format to dropdown format to display all the values
	useEffect(() => {
		if (candidateObjectives?.Objectives?.length) {
			const formattedObjectives = candidateObjectives?.Objectives?.map((objective: Objectives) => {
				return { label: objective.title, value: objective._id, ...objective }
			})
			setObjectiveDataCopy(formattedObjectives)
		}
	}, [candidateObjectives])

	const storeSelectedValue = (item: any) => {
		const find = objectivesLocal?.find((present: any) => present._id === item._id)
		if (find) {
			Alert.alert('This objective is already selected');
			// setobjectivesCopy([item, ...selectedObjective])
		} else {
			setObjectivesLocal((objectivesLocal: FormattedSkills[]) => [...objectivesLocal, { title: item.title, _id: item._id }]);
		}

	}

	const updateSelectedObjectives = async () => {
		setloading(true)
		try {
			const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, resume, coverLetter, skills, objectivesLocal, languages, coverPhoto);
			if (status === "complete") {
				setloading(false);
				setobjectivesCopy([...objectivesLocal]);
				closeBottomSheetHandler()
			}
		} catch (error: any) {
			console.log({ error });
			setloading(false);
			//display error 
			Alert.alert('An error occured while updating the recruiter info.');
		}
	}

	const onCancel = () => {
		setObjectivesLocal([...objectivesCopy]);
		closeBottomSheetHandler()
	}

	return (
		<View style={{ backgroundColor: 'white', height: '100%', borderRadius: 15, shadowColor: 'rgba(0, 0, 0, 0.1)' }}>
			<Card style={{ borderRadius: 15, shadowColor: 'white', paddingHorizontal: 15, height:"87%"  }} elevation={2}>
				<TouchableRipple onPress={() => onCancel()}>
					<Image style={styles.logo} source={require('../../../../../assets/icons/line.png')} />
				</TouchableRipple>
				{loading ? (
					<ActivityIndicator style={{ marginTop: hp('5%') }} size={'small'} color='#000' />
				) : (
				<View  style={{ height:"90%"}}>
					<Text style={{ fontFamily: 'Lato-Regular', fontSize: 20, fontWeight: '600', color: '#012653' }}>Objectives</Text>
					<View style={{ flexDirection: 'column', marginTop: 15, marginBottom: 15, }}>
						<View style={{ borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5, paddingBottom: 5, width: "100%" }}>
							<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: "black" }}>Add your objectives</Text>
							<Dropdown
								data={objectiveData}
								maxHeight={200}
								labelField="label"
								valueField="value"
								placeholder={'Select an objective'}
								value={"Select an objective"}
								style={{ width: "100%", }}
								containerStyle={{ marginBottom: 10 }}
								itemContainerStyle={{ marginBottom: 10, padding: -1 }}
								itemTextStyle={{ margin: -1, padding: -1, height: 20 }}
								dropdownPosition="top"
								onChange={(item) => storeSelectedValue(item)} />
						</View>
						{objectivesLocal ? (
							<View style={{ height: "81%", paddingTop: 5, }}>
								<ScrollView>
									<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
										{objectivesLocal?.map((items: any) => (
											<View style={{ marginRight: 10, marginBottom: 16, paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#418394', borderRadius: 53, flexDirection: 'row', alignSelf: "flex-start", justifyContent: "center", alignItems: "center" }}>
												<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: '#ffff', marginRight: 8 }}>{items?.title}</Text>
												<TouchableOpacity style={{ alignSelf: "center" }} activeOpacity={1} onPress={() => deleteObjective(items._id)}>
													<Image source={require('../../../../../assets/icons/Profile_icons/cross-icon.png')} style={{ height: 12, width: 12, alignSelf: 'center', resizeMode: 'cover' }} />
												</TouchableOpacity>
											</View>
										)
										)}
									</View>
								</ScrollView>
							</View>
						) : null}

					</View>
				</View>
				)}
			</Card>

			<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15, marginTop: 'auto', }}>
				<TouchableRipple onPress={() => closeBottomSheetHandler()}>
					<Button
						mode='contained'
						labelStyle={{ color: '#C30000', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}
						color='#fff'
						style={{ borderRadius: 50, width: wp('25%'), marginRight: 50 }}
						uppercase={false}
						onPress={() => onCancel()}
					>
						Cancel
					</Button>
				</TouchableRipple>
				<Button
					// loading={isLoading}
					mode='contained'
					color="#012653"
					labelStyle={{ fontFamily: 'Lato-Regular', fontWeight: '400', fontSize: 16, color: 'white', }}
					uppercase={false}
					style={{ marginRight: hp('2%'), borderRadius: 50, width: wp('25%') }}
					onPress={() => updateSelectedObjectives()}
				>
					Save
				</Button>
			</View>
		</View>
	);
}

export default AddObjectives;


const styles = StyleSheet.create({

	logo: {
		marginRight: Platform.OS == 'ios' ? hp('1%') : hp('1%'),
		resizeMode: 'contain',
		height: hp('4%'),
		width: hp('100%'),
		alignSelf: 'center',
		marginTop: 5
	},
});