import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Image, Platform, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Text, TouchableRipple, Switch, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


interface EditBioInterface {
    setUserBio: Function,
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
    objectives: any[]
    languages: any[]
    coverPhoto: string
    skills: any[]
}

interface ResumeInterface {
    url: string;
    name: string
}

const Summary = ({ updatedata, userBio, setUserBio, closeBottomSheetHandler, profilePicture, experiences, educations, socialLinks, resume, coverLetter, skills, objectives, languages, coverPhoto }: EditBioInterface) => {
    const navigation = useNavigation();

    const [isExpanded, setIsExpanded] = useState(false);
    const [maxLines, setMaxLines] = useState(10)
    const [TextLines, setTextLines] = useState<any>()
    const lineHeight = 1.4
    const maxHeight = lineHeight * maxLines * 14

    const toggleExpansion = () => {
        setMaxLines(TextLines)
        setIsExpanded(false)
    }

    return (
        <View style={{ width: "100%", }}>
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
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                        <View  >
                            <Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653" }}>My summary</Text>
                        </View>
                        {userBio?.summary?.length ? (
                            <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-end" }}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("CandidateSummary", { updatedata: updatedata, userBio: userBio, setUserBio: setUserBio, profilePicture: profilePicture, experiences: experiences, educations: educations, socialLinks: socialLinks, resume: resume, coverLetter: coverLetter, skills: skills, objectives: objectives, languages: languages, coverPhoto: coverPhoto })}
                                >
                                    <Image style={{ width: 24, height: 24 }} source={require("../../../../../assets/icons/Profile_icons/edit_icon.png")} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            null
                        )
                        }
                    </View>
                    {userBio?.summary?.length ? (
                        <>
                            <View style={{ overflow: 'hidden', display: "flex", justifyContent: "flex-start", }}>
                                <Text
                                    // numberOfLines={maxLines}
                                    onTextLayout={({ nativeEvent: { lines } }) => {
                                        if (lines.length > maxLines) {
                                            setIsExpanded(true)
                                        }
                                        setTextLines(lines.length)
                                    }
                                    }
                                    style={{ fontFamily: 'Lato-Regular', textAlign: 'justify', fontSize: 16, fontWeight: '400', color: '#495057' }}>{userBio?.summary}</Text>
                            </View>
                            {/* {isExpanded && (TextLines > maxLines) && (
                                <TouchableRipple onPress={() => toggleExpansion()} style={{ backgroundColor: "white", position: "absolute", width: "27%", display: "flex", justifyContent: "flex-end", alignContent: "flex-end", alignItems: "flex-end", top: hp("27%"), right: 0, left: "auto" }}>
                                    <Button uppercase={false} color='#1890FF' labelStyle={{ fontFamily: 'Lato-Regular', fontSize: hp("2%"), fontWeight: '400', lineHeight: hp(2), width:"80%", backgroundColor:"white" }} style={{ marginLeft: wp("-4%"), marginTop: hp("-1%"), marginRight: -12 }} >
                                        ...See more
                                    </Button>
                                </TouchableRipple>
                            )} */}
                        </>
                    ) : (
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => navigation.navigate("CandidateSummary", { updatedata: updatedata, userBio: userBio, setUserBio: setUserBio, profilePicture: profilePicture, experiences: experiences, educations: educations, socialLinks: socialLinks, resume: resume, coverLetter: coverLetter, skills: skills, objectives: objectives, languages: languages, coverPhoto: coverPhoto })}
                            >
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                                    <Image style={{ marginRight: 15, height: 25, width: 25 }} source={require("../../../../../assets/icons/Profile_icons/add_button.png")}></Image>
                                    <Text style={{ color: "#1D97A2", fontFamily: 'Lato-Regular', fontWeight: '500', fontSize: 18 }}>Add summary</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </View>
        </View>
    )
}

export default Summary;