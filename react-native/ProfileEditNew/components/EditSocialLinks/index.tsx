import { useImmerState } from '@shrugsy/use-immer-state';
import React, { useState } from 'react'
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
  skills: any[]
  objectives: any[]
  languages: any[]
  coverPhoto: string
}

interface ResumeInterface {
  url: string;
  name: string
}

function EditSocialLinks({ updatedata, userBio, closeBottomSheetHandler, profilePicture, experiences, educations, resume, coverLetter, socialLinks, setSocialLinks, skills, objectives, languages, coverPhoto }: EditBioInterface) {
  const [loading, setloading] = useState(false);
  const { github, linkedIn, facebook, twitter } = socialLinks;
  const [githubLocal, setgithubLocal] = useState(github);
  const [linkedInLocal, setlinkedInLocal] = useState(linkedIn)
  const [facebookLocal, setfacebookLocal] = useState(facebook);
  const [twitterLocal, settwitterLocal] = useState(twitter);

  const onSubmit = async (condition: string) => {
    setloading(true);

    if (condition == "submit") {
      setSocialLinks({ github: githubLocal, linkedIn: linkedInLocal, facebook: facebookLocal, twitter: twitterLocal });
      try {
        const { status } = await updatedata(profilePicture, userBio, experiences, educations, { github: githubLocal, linkedIn: linkedInLocal, facebook: facebookLocal, twitter: twitterLocal }, resume, coverLetter, skills, objectives, languages, coverPhoto);
        if (status === "complete") {
          setloading(false);
          closeBottomSheetHandler();
          Keyboard.dismiss()
        }
      } catch (error: any) {
        setloading(false);
        //display error 
        Alert.alert('An error occured while updating the recruiter info.');
        Keyboard.dismiss()
      }

    } else if (condition == "cancel") {
      //now making our variables to initial values coming from database
      setloading(false);
      closeBottomSheetHandler();
      Keyboard.dismiss()
    }
  }

  return (
    <View style={{ ...styles.card, height: '100%', borderRadius: 30 }}>
      <TouchableRipple
        onPress={() => closeBottomSheetHandler()}
      >
        <Image style={styles.logo} source={require('../../../../../assets/icons/line.png')} />
      </TouchableRipple>
      <ScrollView>
        {
          loading ? <ActivityIndicator style={{ marginTop: hp('5%') }} size={'small'} color="#000" />
            :
            <Card style={{ ...styles.card }} elevation={2}>
              <View style={styles.headingContainer}>
                <Image style={styles.cardIcon} source={require('../../../../../assets/icons/briefcase.png')} />
                <Text style={styles.cardText}>Edit Social Links</Text>
              </View>

              <View>
                <Text style={{ paddingVertical: 20, fontFamily: 'Lato-Bold', fontSize: hp('2%'), color: '#012653' }}>LinkedIn profile url</Text>
                <TextInput placeholder={'LinkedIn account'} onChangeText={(text) => setlinkedInLocal(text)} value={linkedInLocal} style={[Platform.OS == 'ios' ? styles.txtIOS : styles.txt]} />
                <Text style={{ paddingVertical: 20, fontFamily: 'Lato-Bold', fontSize: hp('2%'), color: '#012653' }}>Twitter profile url</Text>
                <TextInput placeholder={'Twitter account'} onChangeText={(text) => settwitterLocal(text)} value={twitterLocal} style={[Platform.OS == 'ios' ? styles.txtIOS : styles.txt]} />
                <Text style={{ paddingVertical: 20, fontFamily: 'Lato-Bold', fontSize: hp('2%'), color: '#012653' }}>Facebook profile url</Text>
                <TextInput placeholder={'Facebook account'} onChangeText={(text) => setfacebookLocal(text)} value={facebookLocal} style={[Platform.OS == 'ios' ? styles.txtIOS : styles.txt]} />
                <Text style={{ paddingVertical: 20, fontFamily: 'Lato-Bold', fontSize: hp('2%'), color: '#012653' }}>Github profile url</Text>
                <TextInput placeholder={'Github account'} onChangeText={(text) => setgithubLocal(text)} value={githubLocal} style={[Platform.OS == 'ios' ? styles.txtIOS : styles.txt]} />

                <View>
                </View>
                <View style={{ marginVertical: hp('4%'), flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Button
                    // loading={isLoading}
                    mode="contained"
                    color="#012653"
                    uppercase={false}
                    style={{ marginRight: hp('2%'), borderRadius: 50, width: wp('25%') }}
                    onPress={() => onSubmit("submit")}
                  >
                    Update
                  </Button>
                  <Button
                    mode="contained"
                    labelStyle={{ color: 'red' }}
                    color="#fff"
                    onPress={() => onSubmit("cancel")}
                    style={{ borderRadius: 50, width: wp('25%') }}
                    uppercase={false}
                  >
                    Cancel
                  </Button>
                </View>
              </View>

            </Card>
        }
      </ScrollView>
    </View>
  )
}

export default EditSocialLinks

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',

    marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
  },
  card: {
    paddingBottom: hp('1%'),
    paddingHorizontal: hp('2%'),
    backgroundColor: '#ffffff',
    // marginHorizontal: wp('4%'),
    // marginTop: Platform.OS == 'ios' ? hp('2.5%') : hp('2.8%'),
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
  txtIOS: {
    borderBottomWidth: 1, // borderColor: '#ffffff',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    // paddingBottom: hp('0.5%'),
    color: '#012653',
    fontFamily: 'Lato-Bold',
    fontSize: hp('1.8%'),
  },
  txt: {
    borderBottomWidth: 1,
    // backgroundColor: 'transparent',
    // borderBottomColor: '#989898',
    paddingHorizontal: 0,
    // paddingBottom: hp('-0.5%'),
    color: '#012653',
    fontFamily: 'Lato-Regular',
    fontSize: hp('2%'),
    // height: hp('3.5%'),
    margin: 0,
    padding: 0,
  },
  input: {
    width: 200,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  logo: {
    marginRight: Platform.OS == 'ios' ? hp('1%') : hp('1%'),
    resizeMode: 'contain',
    height: hp('4%'),
    width: hp('100%'),
    alignSelf: 'center',
    // marginBottom: hp('0.5%'),
    // borderColor: 'red',
    // borderWidth:1
  },
});