import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useImmerState } from '@shrugsy/use-immer-state';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
//mutation for updating recruiter
import { useMutation } from '@apollo/client';
//redux actions
import { saveCandidateProfileData } from '../../../store/actions/candidateProfile/recruiterProfileAction';
//Components to display the data
import DisplayProfilePicture from './components/DisplayPicture';
import DisplayProfileBio from './components/DisplayBio';
import DisplayProfileExperience from './components/DisplayExperience';
import DisplayProfileEducation from './components/DisplayEducation';
//Components to Edit the data
import DisplaySocialLinks from './components/DisplaySocialLinks';
import EditSocialLinks from './components/EditSocialLinks';
import DiplayResumeAndCoverLetter from './components/DisplayResumeAndCoverLetter';
import { UpdateCandidateDocument } from '../../../helper/graphQL/mutations/candidateMutations';
import EditProfilePicture from './components/EditProfilePicture';
import EditBannerPicture from './components/EditBannerPicture';
import DisplaySkills from './components/DisplaySkill';
import DisplayObjectives from './components/DisplayObjectives';
import AddSkills from './components/AddSkills';
import AddObjectives from './components/AddObjectives';
import DisplayLanguages from './components/DisplayLanguages';
import AddLanguages from './components/AddLanguages';
import UploadOrRemoveResume from './components/UploadOrEditResume';
import UploadOrRemoveCoverLetter from './components/UplaodOrRemoveCoverLetter';
import Summary from './components/Summary/Summary';
import { useIsFocused } from '@react-navigation/native';

interface UserBioInterface {
	firstName: string;
	lastName: string;
	position: string;
	company: string;
	summary: string;
}
interface ResumeInterface {
	url: string;
	name: string;
}

interface SocialLinksInterface {
	github: string;
	linkedIn: string;
	facebook: string;
	twitter: string;
}

const CandidateProfileEdit = (props: any) => {
	//we are getting our values from redux
	const values: any = useSelector((state: any) => state.candidateProfileReducer);
	const { candidateId, profilePicture, firstName, lastName, position, company, summary, experiences, educations, resume, coverLetter, socialLinks, objectives, skills, languages, coverPhoto } = values;
	const dispatch = useDispatch();
	// we should save all the values we need in our modals to our state variables so that we can play around with them.
	const [updateCandidateDocument, { data }] = useMutation(UpdateCandidateDocument);
	//our copystates - we will use these to manipulate the data on our end.
	const [profilePictureCopy, setProfilePictureCopy] = useState(profilePicture); //profilePicture
	const [coverPhotoCopy, setcoverPhotoCopy] = useState(coverPhoto);
	const [userBio, setUserBio] = useImmerState<UserBioInterface>({ firstName, lastName, position, company, summary });
	// experiences and education
	const [experiencesCopy, setExperiencesCopy] = useState(experiences);
	const [educationsCopy, setEducationsCopy] = useState(educations);
	//social links, resume and cover letter
	const [socialLinksCopy, setSocialLinksCopy] = useImmerState<SocialLinksInterface>({ ...socialLinks });
	const [resumeCopy, setResumeCopy] = useImmerState<ResumeInterface>(resume);
	const [coverLetterCopy, setCoverLetterCopy] = useImmerState<ResumeInterface>(coverLetter);
	const [skillsCopy, setskillsCopy] = useState<any>(skills)
	const [objectivesCopy, setobjectivesCopy] = useState<any>(objectives)
	const [languagesCopy, setLanguagesCopy] = useState(languages);
	//state variable to decide which sheet to open
	const [whichSheet, setWhichSheeet] = useState('');
	// variables to manipulate the sheet
	const sheetRef: any = React.useRef(null);
	const fall = new Animated.Value(1); //close the bottom sheet at index 1 

	//we will use a variable to store the index of array item clicked in edit experience or edit educations
	//for nnot refetching 
	//this useEffect is being used for setting values whenever values are loaded from redux 
	const isFocused = useIsFocused();
	useEffect(() => { 
			setProfilePictureCopy(values?.profilePicture);
			setUserBio({ firstName: values?.firstName, lastName: values?.lastName, position: values?.position, company: values?.company, summary: values?.summary });
			setExperiencesCopy(values?.experiences);
			setEducationsCopy(values?.educations);
			setSocialLinksCopy({ ...values?.socialLinks });
			setResumeCopy(values?.resume);
			setCoverLetterCopy(values?.coverLetter);
			setobjectivesCopy(values?.objectives)
			setskillsCopy(values?.skills)
			setLanguagesCopy(values?.languages);
			setcoverPhotoCopy(values?.coverPhoto)  
	}, [isFocused]);
	//update the recruiter on changes.
	const updatedata = (profilePicture: string, userBio: UserBioInterface, experiences: [], educations: [], socialLinks: SocialLinksInterface, resume: ResumeInterface, coverLetter: ResumeInterface, skillsLocal: string[], objectives: string[], languages: any[], coverPhoto: string) => {
		return new Promise((resolve, reject) => {
			updateCandidateDocument({
				variables: {
					candidateId: candidateId,
					candidate: {
						firstName: userBio.firstName,
						lastName: userBio.lastName,
						position: userBio.position,
						description: userBio.summary, //in our redux as well as userBio it is saved as summary but in database it is saved as description.
						company: userBio.company,
						profilePicture: profilePicture,
						resume: resume?.url ? resume?.url : '',
						resumeName: resume?.name ? resume?.name : '',
						coverLetter: coverLetter?.url ? coverLetter?.url : '',
						coverLetterName: coverLetter?.name ? coverLetter?.name : '',
						experiences: experiences,
						education: educations, //in db it is saved as education
						facebook: socialLinks?.facebook ? socialLinks?.facebook : '',
						twitter: socialLinks?.twitter ? socialLinks?.twitter : '',
						linkedIn: socialLinks?.linkedIn ? socialLinks?.linkedIn : '',
						github: socialLinks?.github ? socialLinks?.github : '',
						skills: skillsLocal.length ? skillsLocal.map((skill: any) => skill._id) : [],
						objectives: objectives.length ? objectives.map((obj: any) => obj._id) : [],
						languages,
						coverPhoto
					},
				},
			})
				.then((res: any) => {
					if (!!res) {
						//after we've updated values to database we will dispatch the updated values to redux so that changed values appear in preview.
						dispatch(
							saveCandidateProfileData(
								candidateId,
								profilePicture,
								values.email,
								userBio.firstName,
								userBio.lastName,
								userBio.position,
								userBio.company,
								userBio.summary,
								resume,
								coverLetter,
								values.location,
								objectives,
								values.professionalInterests,
								skillsLocal,
								educations,
								experiences,
								socialLinks,
								values.profileVideo,
								languages,
								coverPhoto
							),
						);
						setProfilePictureCopy(profilePicture);
						setUserBio({ firstName: userBio.firstName, lastName: userBio.lastName, position: userBio?.position, company: userBio?.company, summary: userBio?.summary });
						setExperiencesCopy(experiences);
						setEducationsCopy(educations);
						setSocialLinksCopy({ ...socialLinks });
						setResumeCopy(resume);
						setCoverLetterCopy(coverLetter);
						setobjectivesCopy(objectives)
						setskillsCopy(skillsLocal)
						setLanguagesCopy(languages);
						setcoverPhotoCopy(coverPhoto)
						resolve({ status: 'complete' });
					}
				})
				.catch((err: any) => {
					console.log({ err });
					reject('An error occured while udating the candidate.');
				});
		});
	};
	//conditionally render content here. each case will open the corresponding view
	const renderContent = () => {
		switch (whichSheet) {
			case 'profile-picture':
				return (
					<EditProfilePicture
						updatedata={updatedata}
						profilePicture={profilePictureCopy}
						setProfilePictureCopy={setProfilePictureCopy}
						closeBottomSheetHandler={closeBottomSheetHandler}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						skills={skillsCopy}
						objectives={objectivesCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
					/>
				); // picture - picture upload


			// case "profile": return (<EditBio updatedata={updatedata} userBio={userBio} setUserBio={setUserBio} closeBottomSheetHandler={closeBottomSheetHandler} profilePicture={profilePictureCopy} educations={educationsCopy} experiences={experiencesCopy} socialLinks={socialLinksCopy} resume={resumeCopy} coverLetter={coverLetterCopy} />) //profile - update profile info
			case 'social-links':
				return (
					<EditSocialLinks
						updatedata={updatedata}
						userBio={userBio}
						closeBottomSheetHandler={closeBottomSheetHandler}
						profilePicture={profilePictureCopy}
						educations={educationsCopy}
						experiences={experiencesCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						socialLinks={socialLinksCopy}
						setSocialLinks={setSocialLinksCopy}
						skills={skillsCopy}
						objectives={objectivesCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
					/>
				);
			// upload or remove resume from bottom sheet
			case 'resume':
				return (
					<UploadOrRemoveResume
						updatedata={updatedata}
						profilePicture={profilePictureCopy}
						closeBottomSheetHandler={closeBottomSheetHandler}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						skills={skillsCopy}
						setResumeCopy={setResumeCopy}
						objectives={objectivesCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
					/>
				);
			// upload or remove cover letter from bottom sheet 
			case 'attachments-coverletter':
				return (
					<UploadOrRemoveCoverLetter
						updatedata={updatedata}
						profilePicture={profilePictureCopy}
						closeBottomSheetHandler={closeBottomSheetHandler}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						setCoverLetterCopy={setCoverLetterCopy}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						skills={skillsCopy}
						objectives={objectivesCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
					/>
				);
			case 'banner-picture':
				return (
					<EditBannerPicture
						updatedata={updatedata}
						profilePicture={profilePictureCopy}
						setcoverPhotoCopy={setcoverPhotoCopy}
						closeBottomSheetHandler={closeBottomSheetHandler}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						skills={skillsCopy}
						objectives={objectivesCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
					/>
				); // picture - picture upload
			// select skills from bottom sheet 
			case 'skills':
				return (
					<AddSkills
						updatedata={updatedata}
						profilePicture={profilePictureCopy}
						setcoverPhotoCopy={setcoverPhotoCopy}
						closeBottomSheetHandler={closeBottomSheetHandler}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						objectives={objectivesCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
						setskillsCopy={setskillsCopy}
						skillsCopy={skillsCopy}
					/>
				);
			// select objectives 
			case 'objectives':
				return (
					<AddObjectives
						closeBottomSheetHandler={closeBottomSheetHandler}
						setobjectivesCopy={setobjectivesCopy}
						objectivesCopy={objectivesCopy}
						updatedata={updatedata}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						skills={skillsCopy}
						languages={languagesCopy}
						coverPhoto={coverPhotoCopy}
						profilePicture={profilePictureCopy}
					/>
				);
			// select languages and languages level bottom sheet 
			case 'languages':
				return (
					<AddLanguages
						closeBottomSheetHandler={closeBottomSheetHandler}
						setLanguagesCopy={setLanguagesCopy}
						languagesCopy={languagesCopy}
						updatedata={updatedata}
						skills={skillsCopy}
						objectives={objectivesCopy}
						coverPhoto={coverPhotoCopy}
						educations={educationsCopy}
						experiences={experiencesCopy}
						userBio={userBio}
						socialLinks={socialLinksCopy}
						resume={resumeCopy}
						coverLetter={coverLetterCopy}
						profilePicture={profilePictureCopy}
					/>
				);
		}

	};

	// header which comes above the bottom sheeet.
	const renderHeader = () => {
		return <View></View>;
		//header to close the sheet
	};
	//Close our bottomsheet
	const closeBottomSheetHandler = () => {
		sheetRef.current.snapTo(1); //at zero index of snapPoints the modal will close
	};
	// In case we want to open a small bottom sheeet which takes 30% of the screen
	const smallBottomSheetHandler = (sheet: string) => {
		setWhichSheeet(sheet);
		sheetRef.current.snapTo(0); //this will open the larger bottomsheet at index 1.
	};
	// In case we want to open a larger bottom sheeet which takes 50% of the screen
	const largeBottomSheetHandler = (sheet: string) => {
		setWhichSheeet(sheet);
		sheetRef.current.snapTo(0); //this will open the larger bottomsheet at index 2.
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.select({ ios: hp('16.3%'), android: 120 })}>
			<SafeAreaView edges={['right', 'left']} mode='padding' style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
				<View style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
					{/* This bottom sheet will be rendered upon opening the sheet from below */}
					<BottomSheet
						ref={sheetRef}
						snapPoints={[500, 0]} // points at which the bottom sheet should open. 300 means 30% of the screen
						borderRadius={1}
						renderContent={renderContent} //content which will be rendered
						// renderHeader={renderHeader} //header of our bottom sheet
						initialSnap={1} //index 1. means initially it will be at zero initially. Means bottom sheet will be closed when component is rendered
						callbackNode={fall}
						enabledGestureInteraction={false} //to close the bottom sheet on pulling down
						enabledContentGestureInteraction={false} // content behind scrollable or not
						enabledInnerScrolling={true}
						enabledContentTapInteraction={true}
					// onOpenEnd={()=>setpullDownBottomSheet(false)} //when bottom sheet is full opened this function runs
					// onCloseStart={()=>setpullDownBottomSheet(true)} //when you close bottom sheet this function runds
					/>
					<ScrollView scrollIndicatorInsets={{ right: 1 }} style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
						<DisplayProfilePicture profilePic={profilePictureCopy} coverPhoto={coverPhotoCopy} bottomSheetHandler={(component: any) => smallBottomSheetHandler(component)} />
						<DisplayProfileBio
							updatedata={updatedata}
							userBio={userBio}
							setUserBio={setUserBio}
							closeBottomSheetHandler={closeBottomSheetHandler}
							profilePicture={profilePictureCopy}
							educations={educationsCopy}
							experiences={experiencesCopy}
							socialLinks={socialLinksCopy}
							resume={resumeCopy}
							coverLetter={coverLetterCopy}
							skills={skillsCopy}
							objectives={objectivesCopy}
							languages={languagesCopy}
							coverPhoto={coverPhotoCopy}
						/>
						<Summary
							updatedata={updatedata}
							userBio={userBio}
							setUserBio={setUserBio}
							closeBottomSheetHandler={closeBottomSheetHandler}
							profilePicture={profilePictureCopy}
							educations={educationsCopy}
							experiences={experiencesCopy}
							socialLinks={socialLinksCopy}
							resume={resumeCopy}
							coverLetter={coverLetterCopy}
							skills={skillsCopy}
							objectives={objectivesCopy}
							languages={languagesCopy}
							coverPhoto={coverPhotoCopy}
						/>
						<DisplaySkills
							bottomSheetHandler={(component: any) => smallBottomSheetHandler(component)} skillsCopy={skillsCopy}
							setskillsCopy={setskillsCopy}
							updatedata={updatedata}
							profilePicture={profilePictureCopy}
							objectives={objectivesCopy}
							educations={educationsCopy}
							experiences={experiencesCopy}
							userBio={userBio}
							socialLinks={socialLinksCopy}
							resume={resumeCopy}
							coverLetter={coverLetterCopy}
							languages={languagesCopy}
							coverPhoto={coverPhotoCopy}
						/>
						<DisplayObjectives
							bottomSheetHandler={(component: any) => smallBottomSheetHandler(component)} objectivesCopy={objectivesCopy}
							setobjectivesCopy={setobjectivesCopy}
							updatedata={updatedata}
							profilePicture={profilePictureCopy}
							skills={skillsCopy}
							educations={educationsCopy}
							experiences={experiencesCopy}
							userBio={userBio}
							socialLinks={socialLinksCopy}
							resume={resumeCopy}
							coverLetter={coverLetterCopy}
							languages={languagesCopy}
							coverPhoto={coverPhotoCopy}
						/>
						<DisplayProfileExperience experiences={experiencesCopy} />
						<DisplayProfileEducation educations={educationsCopy} />
						<DisplayLanguages largeBottomSheetHandler={(component: any) => largeBottomSheetHandler(component)} languagesCopy={languagesCopy} />
						<DiplayResumeAndCoverLetter resume={resumeCopy} coverLetter={coverLetterCopy} bottomSheetHandler={(component: any) => largeBottomSheetHandler(component)} />
						<DisplaySocialLinks
							updatedata={updatedata}
							userBio={userBio}
							closeBottomSheetHandler={closeBottomSheetHandler}
							profilePicture={profilePictureCopy}
							educations={educationsCopy}
							experiences={experiencesCopy}
							resume={resumeCopy}
							coverLetter={coverLetterCopy}
							socialLinks={socialLinksCopy}
							setSocialLinks={setSocialLinksCopy}
							skills={skillsCopy}
							objectives={objectivesCopy}
							languages={languagesCopy}
							coverPhoto={coverPhotoCopy}
						/>
					</ScrollView>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default CandidateProfileEdit;

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'red',
	},
});
