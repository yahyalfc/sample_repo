import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import HeaderWithoutShadow from '../../../../../components/HeaderWithoutShadow';
import { useNavigation } from '@react-navigation/native';


const AddSummary = (props: any) => {
    // const route = useRoute();
    const { updatedata, userBio, setUserBio, profilePicture, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto, } = props?.route?.params;
    const navigation: any = useNavigation();
    const [summaryCopylocal, setsummaryCopyLocal] = useState<any>(userBio?.summary);
    const [summaryCount, setsummaryCount] = useState(1500)
    const [isLoading, setisLoading] = useState(false);


    useEffect(() => {
        if (summaryCopylocal?.length) {
            setsummaryCount(1500 - summaryCopylocal?.length)
        } else {
            setsummaryCount(1500 - 0)
        }

        return () => {
            setsummaryCount(1500);
        }
    }, [summaryCopylocal])

    const goBack = () => navigation.goBack(); //\u2022
    const onCancel = () => {
        setsummaryCopyLocal(userBio?.summary);
        setsummaryCount(1500 - userBio?.summary?.length)
        goBack()
    }

    const onSubmit = async () => {
        if (!summaryCopylocal) {
            return Alert.alert('Some field data is missing');
        }

        if (summaryCount > 0) {
            try {
                setisLoading(true);
                // updatedata = (profilePic: string, userBio: any, experiences: [], educations: [] )
                const { status } = await updatedata(profilePicture, { firstName: userBio?.firstName, lastName: userBio?.lastName, position: userBio?.position, company: userBio?.company, summary: summaryCopylocal }, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto);
                if (status === "complete") {
                    setisLoading(false);
                    setUserBio({ firstName: userBio?.firstName, lastName: userBio?.lastName, position: userBio?.position, company: userBio?.company, summary: summaryCopylocal })
                    Keyboard.dismiss()
                    goBack()
                }
            } catch (error: any) {
                //display error 
                Alert.alert('An error occured while updating the candidate bio.');
                //setting values to default 
                setsummaryCopyLocal(userBio?.summary);
                setsummaryCount(1500 - userBio?.summary?.length)
                Keyboard.dismiss()
            }
        } else {
            Alert.alert('Summary should at most contain 1500 characters');
        }
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.select({ ios: hp('-10%'), android: -120 })}>
            <SafeAreaView edges={['right', 'left']} mode='padding' style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
                <View style={{ backgroundColor: 'white', height: '100%' }}>
                    <HeaderWithoutShadow headerTitle={`Add summary`} goBack={goBack} />
                    <View style={{ paddingHorizontal: 15, paddingVertical: 24, height: "80%" }} >

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontFamily: "Lato-Regular", fontSize: 20, fontWeight: "600", color: "#012653", marginBottom: 24 }}>Summary</Text> 
                                <ScrollView> 
                                    <TextInput
                                        maxLength={1499}
                                        multiline={true}
                                        onChangeText={(text: any) => setsummaryCopyLocal(text)}
                                        value={summaryCopylocal}
                                        placeholder="Your profile and your motivations in a few lines..."
                                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                        style={{ fontFamily: "Lato-Regular", fontWeight: "400", fontSize: wp('4%'), color: "#495057", textAlign: "justify", width: "100%", borderBottomWidth: 2, borderBottomColor: "#BC9623", paddingBottom: 10, marginBottom: 10, bottom: 0 }}    
                                    />
                                    <Text style={{ fontSize: 10, fontWeight: "400", color: "#008D8B", alignSelf: "flex-end", height:50 }}>{summaryCount > 0 ? summaryCount : 0} characters remaining</Text> 
                                </ScrollView> 
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 15, marginTop: 'auto', backgroundColor: "white", alignItems: "center" }}>
                        <TouchableRipple>
                            <Button
                                mode='contained'
                                labelStyle={{ color: '#C30000', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '600' }}
                                color='#fff'
                                style={{ borderRadius: 44, width: wp('25%'), marginRight: 50 }}
                                uppercase={false}
                                onPress={() => onCancel()}
                            >
                                Cancel
                            </Button>
                        </TouchableRipple>
                        <TouchableRipple>
                            <Button
                                loading={isLoading}
                                mode='contained'
                                labelStyle={{ fontFamily: 'Lato-Regular', fontWeight: '400', fontSize: 16, color: 'white', }}
                                uppercase={false}
                                style={{ borderRadius: 44, width: wp('25%'), backgroundColor: userBio?.summary?.length ? "#1F406B" : "rgba(0, 0, 0, 0.25)", shadowColor: userBio?.summary?.length ? "" : "rgba(0, 0, 0, 0.25)" }}
                                onPress={() => onSubmit()}
                            >
                                Save
                            </Button>
                        </TouchableRipple>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default AddSummary;