import React, { useState } from 'react'
import { View, StyleSheet, Image, Platform, Keyboard, Alert } from 'react-native';
import { Button, Card, Text, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DocumentPicker from 'react-native-document-picker';
import uploadDocument from '../../../../../utils/upload-document';

interface ResumeInterface {
  url: string;
  name: string
}
interface UploadOrrRemoveResume {
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
  resume: ResumeInterface;
  coverLetter: ResumeInterface,
  updatedata: Function;
  closeBottomSheetHandler: Function,
  skills: any[]
  objectives: any[]
  languages: any[]
  coverPhoto: string
}

function UploadOrRemoveCoverLetter({ updatedata, profilePicture, closeBottomSheetHandler, experiences, educations, userBio, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto,setCoverLetterCopy }: any) {

  const [loading, setloading] = useState(false);

  const uploadcover = async (val: string) => {
    setloading(true);
    if (val == 'remove') {
      const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, resume, { name: "", url: "" }, skills, objectives, languages, coverPhoto);
      if (status === "complete") {
        setloading(false);
        // setCoverLetterCopy({name: "", url:""})
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
          const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, resume, { name: file[0].name, url: documentUrl }, skills, objectives, languages, coverPhoto);
          if (status === "complete") {
            setloading(false);
            // setCoverLetterCopy({name: file[0]?.name, url:documentUrl})
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

          <View>
            {!coverLetter?.url ? (
              <>
                <Text style={{ fontFamily: "Lato-Regular", fontSize: 20, fontWeight: "600", color: "#012653", }}>Attachment</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#495057" }}>Upload an attachment </Text>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 14, fontWeight: "600", color: "#495057" }}>Upload an attachment.</Text>
                  </View>
                  <View >
                    <TouchableRipple onPress={() => uploadcover('add')}>
                      <Image source={require("../../../../../assets/icons/Profile_icons/Replace_icon.png")} style={{ height: 22, width: 22, resizeMode: "cover" }}></Image>
                    </TouchableRipple>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text style={{ fontFamily: "Lato-Regular", fontSize: 20, fontWeight: "600", color: "#012653", }}>Attachment</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15, alignItems: "center" }}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#495057" }}>Replace your attachment</Text>
                  </View>
                  <View >
                    <TouchableRipple onPress={() => uploadcover('add')}>
                      <Image source={require("../../../../../assets/icons/Profile_icons/Replace_icon.png")} style={{ height: 22, width: 22, resizeMode: "contain" }}></Image>
                    </TouchableRipple>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15, alignItems: "center" }}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 16, fontWeight: "600", color: "#495057" }}>Remove your attachment </Text>
                    <Text style={{ fontFamily: "Lato-Regular", fontSize: 14, fontWeight: "600", color: "#495057" }}>Your attachment will permanently deleted.</Text>
                  </View>
                  <TouchableRipple style={{ marginTop: hp('1%'), }} onPress={() => uploadcover('remove')}>
                    <Image source={require("../../../../../assets/icons/Profile_icons/delete_icon.png")} style={{ width: 22, height: 22 }}></Image>
                  </TouchableRipple>
                </View>
              </>
            )}
          </View>
      }

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15, marginTop: 'auto', }}>
        <TouchableRipple onPress={() => closeBottomSheetHandler()}>
          <Button
            mode='contained'
            labelStyle={{ color: '#C30000', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}
            color='#fff'
            style={{ borderRadius: 50, width: wp('25%'), marginRight: 50 }}
            uppercase={false}
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
          style={{ marginRight: hp('2%'), borderRadius: 50, width: wp('25%'), }}
        >
          Save
        </Button>
      </View>
    </Card>
  )
}

export default UploadOrRemoveCoverLetter;

const styles = StyleSheet.create({

  card: {
    height: hp('70%'),
    paddingHorizontal: hp('2%'),
    borderRadius: 30,
    backgroundColor: '#ffffff',
    paddingVertical: hp('2.5%'),
  },
  logo: {
    marginRight: Platform.OS == 'ios' ? hp('1%') : hp('1%'),
    resizeMode: 'contain',
    height: hp('4%'),
    width: hp('100%'),
    alignSelf: 'center',
  },
});