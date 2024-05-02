import React, { useState } from 'react';
import { Image, Text, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface DisplaySkillsInterface {
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
	objectives: any[]
	languages: any[]
	coverPhoto: string
	skillsCopy: any[]
	setskillsCopy: Function
}

interface ResumeInterface {
	url: string;
	name: string
}

function DisplaySkills({ bottomSheetHandler, skillsCopy, setskillsCopy, updatedata, profilePicture, experiences, educations, userBio, socialLinks, resume, coverLetter, objectives, languages, coverPhoto }: DisplaySkillsInterface) {
	const [loading, setloading] = useState(false);

	const deleteSkill = async (id: string) => {
		setloading(true)
		const filteredSkills = skillsCopy.filter((objective: any) => objective._id != id)

		try {
			const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, resume, coverLetter, filteredSkills, objectives, languages, coverPhoto);
			if (status === "complete") {
				setloading(false);
				setskillsCopy([...filteredSkills]);
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
					<Text style={{ fontFamily: 'Lato-Regular', textAlign: 'left', fontSize: 20, fontWeight: '600', color: '#012653', marginBottom: 15 }}> Skills</Text>
					{skillsCopy ? (
						<View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>

							{skillsCopy?.map((items: any) => {
								return (
									<View style={{ marginRight: 10, marginBottom: 15, paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#418394', borderRadius: 53, flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
										<Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: '#ffff', marginRight: 8 }}>{items?.title}</Text>
										<TouchableOpacity style={{ alignSelf: "center" }} activeOpacity={1} onPress={() => deleteSkill(items._id)}>
											<Image source={require('../../../../../assets/icons/Profile_icons/cross-icon.png')} style={{ height: 12, width: 12, resizeMode: 'cover' }}></Image>
										</TouchableOpacity>
									</View>
								)
							})}

							<View>
								<TouchableOpacity activeOpacity={1} onPress={() => bottomSheetHandler("skills")}>
									<Image source={require('../../../../../assets/icons/Profile_icons/add_button-empty.png')} style={{ height: 24, width: 24, resizeMode: 'contain' }}></Image>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View  >
							<TouchableOpacity activeOpacity={1} onPress={() => bottomSheetHandler('skills')}>
								<Image source={require('../../../../../assets/icons/Profile_icons/add_button-empty.png')} style={{ height: 24, width: 24, resizeMode: 'contain' }}></Image>
							</TouchableOpacity>
						</View>
					)}


				</View>
			</View>
		</View>
	);
}

export default DisplaySkills;
