import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView, Alert, Keyboard } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import uploadDocument from '../../../../../utils/upload-document';

interface EditPictureInterface {
  profilePicture: string,
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
  coverLetter: ResumeInterface;
  resume: ResumeInterface;
  updatedata: Function;
  closeBottomSheetHandler: Function,
}

interface ResumeInterface {
  url: string;
  name: string
}

function EditResume({ updatedata, profilePicture, closeBottomSheetHandler, experiences, educations, userBio, socialLinks, coverLetter, resume }: EditPictureInterface) { 
  const [loading, setloading] = useState(false); 
  const uploadresume = async (val: string) => {
    setloading(true);
    if (val == 'remove') {
      const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, { name: "", url: "" }, coverLetter);
      if (status === "complete") {
        setloading(false);
        closeBottomSheetHandler();
        Keyboard.dismiss()
      }
    } else {
      try {
        const file: any = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc],
        });

        //the size is returing Byte size
        if (file[0].size <= 2000000) {
          const documentUrl = await uploadDocument(file[0]);
          const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, { name: file[0].name, url: documentUrl }, coverLetter);
          if (status === "complete") {
            setloading(false);
            closeBottomSheetHandler();
            Keyboard.dismiss()
          }
        } else {
          setloading(false);
          Alert.alert('Alert', 'The size of the file must be less then 2MB');
        }
      } catch (err) {
        setloading(false);
        if (DocumentPicker.isCancel(err)) {
          return
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          Alert.alert('Alert', `${err}`)
        }
      }
    }
  }

  return (
    <Card style={styles.card} elevation={2}>
      <TouchableRipple
        onPress={() => closeBottomSheetHandler()}
      >
        <Image style={styles.logo} source={require('../../../../../assets/icons/line.png')} />
      </TouchableRipple>
      {
        loading ? <ActivityIndicator style={{ marginTop: hp('5%') }} size={'small'} color="#000" />
          :
          <View style={{ paddingBottom: hp('2%') }}>
            <Text style={{backgroundColor:"yellow"}}>Attachments</Text>
            <TouchableRipple onPress={() => uploadresume('add')}>
              <View style={{ marginVertical: hp('1%'), paddingHorizontal: hp('1%') }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.bs1logo} source={require('../../../../../assets/icons/retweetA.png')} />
                  <View>
                    <Text style={styles.subheading1}>Upload resume in pdf format</Text>
                    <Text style={styles.mainHeading2}>{resume.name ? 'Replace' : 'Add'} resume</Text>
                  </View>
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple style={{ marginTop: hp('1%') }} onPress={() => uploadresume('remove')}>
              <View style={{ marginVertical: hp('1%'), paddingHorizontal: hp('1%') }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.bs1logo} source={require('../../../../../assets/icons/trashA.png')} />
                  <View>
                    <Text style={styles.mainHeading2}>Remove resume</Text>
                  </View>
                </View>
              </View>
            </TouchableRipple>
          </View>
      }
    </Card>
  )
}

export default EditResume

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',

    marginBottom: Platform.OS == 'ios' ? hp('1.5%') : hp('3%'),
  },
  card: {
    height: hp('70%'),
    paddingHorizontal: hp('2%'),
    borderRadius: 30,
    backgroundColor: '#ffffff',
    // marginHorizontal: wp('4%'),
    // marginTop: Platform.OS == 'ios' ? hp('2.5%') : hp('2.8%'),
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
  cardText1: {
    fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.5%'),
    fontFamily: 'Lato-Bold',
    color: '#1570ee',
    marginBottom: hp('2%'),
    // borderWidth: 2,
    // borderColor: 'orange',
  },
  bs1logo: {
    marginRight: Platform.OS == 'ios' ? hp('1%') : hp('1%'),
    resizeMode: 'contain',
    height: hp('2.5%'),
    width: hp('4%'),
    alignSelf: 'center',
    marginBottom: hp('0.5%'),
    // borderColor: 'red',
    // borderWidth:1
  },

  subheading1: {
    fontSize: hp('1.7%'),
    color: '#989898',
    fontFamily: 'Lato-Bold',
    marginBottom: hp('0.5%'),
  },
  mainHeading2: {
    fontSize: Platform.OS == 'ios' ? hp('2%') : hp('2.2%'),
    color: '#012653',
    fontFamily: 'Lato-Bold',
    marginBottom: hp('0.5%'),
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