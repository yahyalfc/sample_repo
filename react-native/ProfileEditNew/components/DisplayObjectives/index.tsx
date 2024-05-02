import React, { useState } from 'react';
import { Image, Text, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface DisplayObjectivesInterface {
	profilePicture: string
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
	bottomSheetHandler: Function,
	languages: any[]
	coverPhoto: string
	skills: any[]
	objectivesCopy: any[],
	setobjectivesCopy: Function
}

interface ResumeInterface {
	url: string;
	name: string
}
function DisplayObjectives({ bottomSheetHandler, objectivesCopy, setobjectivesCopy, updatedata, profilePicture, experiences, educations, userBio, socialLinks, resume, coverLetter, skills, languages, coverPhoto }: DisplayObjectivesInterface) {
	const [loading, setloading] = useState(false);

	const deleteObjective = async (id: string) => {
		const filteredObjectives = objectivesCopy.filter((objective: any) => objective._id != id)

		try {
			const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, resume, coverLetter, skills, filteredObjectives, languages, coverPhoto);
			if (status === "complete") {
				setloading(false);
				setobjectivesCopy(filteredObjectives)
			}
		} catch (error: any) {
			console.log({ error });
			setloading(false);
			//display error 
			Alert.alert('An error occured while updating the candidate info.');
		}
	}

	return (
		<View style={{ width: '100%' }}>
			<View
				style={{
					backgroundColor: '#ffff',
					marginLeft: 15,
					marginRight: 15,
					marginTop: 15,
					borderRadius: 15,
					shadowColor: '#000',
					shadowOffset: {
						width: 1,
						height: 1,
					},
					shadowOpacity: 0.1,
					shadowRadius: 3,
					padding: 15,
				}}
			>
				<View>
					<Text style={{ fontFamily: 'Lato-Regular', textAlign: 'left', fontSize: 20, fontWeight: '600', color: '#012653', marginBottom: 15 }}>Objectives</Text>

					{objectivesCopy ? (
						<View style={{ flexDirection: 'row', flexWrap: "wrap" , alignItems: 'center' }}>
							{objectivesCopy?.map((items: any) => {
								return (

									<View style={{ marginRight: 10, marginBottom: 15, paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#418394', borderRadius: 53, flexDirection: 'row', justifyContent: "center", alignItems: "center", }}>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: '#ffff', marginRight: 8 }}>{items?.title}</Text>
										<TouchableOpacity activeOpacity={1} onPress={() => deleteObjective(items._id)}>
											<Image source={require('../../../../../assets/icons/Profile_icons/cross-icon.png')} style={{ height: 12, width: 12, alignSelf: 'center', resizeMode: 'cover' }}></Image>

										</TouchableOpacity>
									</View>

								)
							})}
							<View>
								<TouchableOpacity activeOpacity={1} onPress={() => bottomSheetHandler("objectives")}>
									<Image source={require('../../../../../assets/icons/Profile_icons/add_button-empty.png')} style={{ height: 24, width: 24, resizeMode: 'contain' }}></Image>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View style={{ display: "none" }}>
							<TouchableOpacity activeOpacity={1} onPress={() => bottomSheetHandler("objectives")}>
								<Image source={require('../../../../../assets/icons/Profile_icons/add_button-empty.png')} style={{ height: 24, width: 24, resizeMode: 'contain' }}></Image>
							</TouchableOpacity>
						</View>
					)}

				</View>
			</View>
		</View>
	);
}

export default DisplayObjectives;
