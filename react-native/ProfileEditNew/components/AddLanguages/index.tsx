import React, { useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, Platform, Alert, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ActivityIndicator, Button, Card, TouchableRipple } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


interface selectedLanguages {
    language: string
    level: string
}

function AddLanguages({ closeBottomSheetHandler, setLanguagesCopy, languagesCopy, updatedata, profilePicture, experiences, educations, userBio, socialLinks, resume, coverLetter, skills, objectives, coverPhoto }: any) {
    const [loading, setloading] = useState(false);

    const [languagesDataCopy, setLanguagesDataCopy] = useState([
        { label: 'English', value: 'English' },
        { label: 'French', value: 'French' },
        { label: 'German', value: 'German' }
    ]);

    const [languagesLevelDataCopy, setLanguagesLevelDataCopy] = useState([
        { label: 'C2 - Mastery ', value: 'C2 - Mastery ' },
        { label: 'C1 - Advanced ', value: 'C1 - Advanced ' },
        { label: 'B2 - Upper-intermediate', value: 'B2 - Upper-intermediate' },
        { label: 'B1 - Intermediate', value: 'B1 - Intermediate' },
        { label: 'A2 - Pre-intermediate', value: 'A2 - Pre-intermediate' },
        { label: 'A1 - Beginner', value: 'A1 - Beginner' },
    ]);

    // selected languages from languages bottom sheet to display
    const [selectedLanguages, setSelectedLanguages] = useState<selectedLanguages[]>(languagesCopy? languagesCopy : [])
    //creating a temporary object to store the selected languages and levels 
    const [tempLanguage, setTempLanguage] = useState<selectedLanguages>({
        language: "",
        level: ""
    })

    const storeSelectedLanguage = (language: string) => {
        setTempLanguage(tempLanguage => ({ ...tempLanguage, language: language }))
    }
    const storeSelectedLevel = (level: string) => {
        setTempLanguage(tempLanguage => ({ ...tempLanguage, level: level }))
    }

    useEffect(() => {
        if (!!tempLanguage.language && !!tempLanguage.level) {
            const foundLanguage = selectedLanguages?.find((lang) => (lang.language === tempLanguage?.language))
            if (foundLanguage) {
                Alert.alert('You have already selected this language.');
                setTempLanguage({ language: "", level: "" })
            } else {
                setSelectedLanguages(selectedLanguages => ([...selectedLanguages, { ...tempLanguage }]))
                setTempLanguage({ language: "", level: "" })
            }

        }
    }, [tempLanguage])

    const onSave = async () => {
        setloading(true);
        try {
            const { status } = await updatedata(profilePicture, userBio, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, selectedLanguages, coverPhoto);
            if (status === "complete") {
                setloading(false);
                setLanguagesCopy(selectedLanguages)
                closeBottomSheetHandler()
            }
        } catch (error: any) {
            console.log({ error });
            setloading(false);
            //display error 
            Alert.alert('An error occured while updating the recruiter info.');
        }
    }

    const onClose = () => {
        setSelectedLanguages(languagesCopy);
        closeBottomSheetHandler()
    }

    const deleteLanguage = (indexOfLanguage: any) => {
        setSelectedLanguages((selectedLanguages) => selectedLanguages.filter((language: any, index: number) => index !== indexOfLanguage))
    }

    return (
        <View style={{ backgroundColor: 'white', height: '100%', borderRadius: 15, shadowColor: 'rgba(0, 0, 0, 0.1)' }}>
            <Card style={{ borderRadius: 15, shadowColor: 'white', paddingHorizontal: 15 }} elevation={2}>
                <TouchableRipple onPress={() => closeBottomSheetHandler()}>
                    <Image style={styles.logo} source={require('../../../../../assets/icons/line.png')} />
                </TouchableRipple>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: hp('5%') }} size={'small'} color='#000' />
                ) : (
                    <View>
                        <Text style={{ fontFamily: 'Lato-Regular', fontSize: 20, fontWeight: '600', color: '#012653' }}>Languages</Text>
                        <View style={{ flexDirection: 'column', marginTop: 15, marginBottom: 15, }}>
                            <View style={{ flexDirection: "column", marginBottom: 15 }}>
                                <View style={{ borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5, paddingBottom: 5, width: "100%" }}>
                                    <Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: "black", marginBottom: 15 }}>Add a language</Text>
                                    <Dropdown
                                        data={languagesDataCopy}
                                        maxHeight={200}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={'Select a language'}
                                        value={tempLanguage?.language ? tempLanguage?.language : "Select a language"}
                                        style={{ width: "100%" }}
                                        iconColor="#000"
                                        containerStyle={{ marginBottom: 10, }}
                                        selectedTextStyle={{ color: "#000" }}
                                        itemContainerStyle={{  marginBottom: 10, }}
                                        itemTextStyle={{margin: -10, padding: -10, }}
                                        dropdownPosition="top"
                                        onChange={(item) => storeSelectedLanguage(item?.label)} />
                                </View>

                                <View style={{ borderBottomWidth: 2, borderBottomColor: "#BC9623", marginBottom: 5, paddingBottom: 5, width: "100%" }}>
                                    <Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: "black", marginBottom: 15, marginTop: 15 }}>Indicate your level</Text>
                                    <Dropdown
                                        data={languagesLevelDataCopy}
                                        maxHeight={200}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={'Select your level'}
                                        value={tempLanguage?.level ? tempLanguage?.level : "Select a level"}
                                        style={{ width: "100%", }}
                                        iconColor="#000"
                                        selectedTextStyle={{ color: "#000" }}
                                        containerStyle={{ marginBottom: 10 }}
                                        itemContainerStyle={{ marginBottom: 10,  }}
                                        itemTextStyle={{ margin: -10, padding: -10, }}
                                        dropdownPosition="top"
                                        onChange={(item) => storeSelectedLevel(item?.label)} />
                                </View>
                            </View>


                            {selectedLanguages ? (
                                <View>
                                    {selectedLanguages?.map((items: any, index: number) => {
                                        return (
                                            <View style={{ justifyContent: "center", alignItems: "center", marginRight: 10, marginBottom: 16, paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#418394', borderRadius: 53, flexDirection: 'row', alignSelf: "flex-start" }}>
                                                <Text style={{ fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: '400', color: '#ffff', marginRight: 8 }}>{items?.language},{items?.level}</Text>
                                                <TouchableOpacity onPress={() => deleteLanguage(index)}>
                                                    <Image source={require('../../../../../assets/icons/Profile_icons/cross-icon.png')} style={{ height: 12, width: 12, alignSelf: 'center', resizeMode: 'cover' }}></Image>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            ) : (
                                <View></View>
                            )}
                        </View>
                    </View>)}
            </Card>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15, marginTop: 'auto', }}>
                <TouchableRipple onPress={() => onClose()}>
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
                    onPress={() => onSave()}
                >
                    Save
                </Button>
            </View>
        </View>
    );
}

export default AddLanguages;


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