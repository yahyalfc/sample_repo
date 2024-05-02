import { useMutation, useQuery } from '@apollo/client';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Card } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import HeaderWithoutNextButton from '../../../components/HeaderWithoutNextButton';
import { removeMultipleNotifications } from '../../../helper/graphQL/mutations/notificationMutation';
import { CANDIDATES_MATCHED_ON_A_JOB } from '../../../helper/graphQL/queries/recruiterJobs';
import { Notification } from '../../../interfaces/notifications';
import { saveCurrentScreen } from '../../../store/actions/DrawerNavigation';
import { removeMultipleNotificationsRdx } from '../../../store/actions/notificationBlip';
import { getFirebaseTimeStampsOfEachItem } from '../../../utils/firebase-services/getFirebaseTimeStampOfEachItem';

const RecruiterChatListOfCandidatesOnJob = (props: any) => {
    let { token } = useSelector((state: any) => state.LoginCandidateReducer);
    const { companyName, companyId, jobId } = props.route.params;
    const navigation: any = useNavigation();

    const { data, loading, error, refetch } = useQuery(CANDIDATES_MATCHED_ON_A_JOB, {
        variables: { jobId }, context: {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }, fetchPolicy: 'network-only'
    });

    const isFocused = useIsFocused();
    const route = useRoute();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!!isFocused) {
            dispatch(saveCurrentScreen(route.name));
        }
    }, [isFocused])

    useEffect(() => {
        refetch();
    }, [isFocused])

    const { notifications } = useSelector((state: any) => state.notificationBlip);
    const [candidateList, setCandidateListData] = useState([]);
    const [loadingDates, setloadingDates] = useState(true)

    useEffect(() => {
        if (data?.candidatesEligableForChatOnAJob) {
            if (data?.candidatesEligableForChatOnAJob?.length) {
                fetchDocuments(data?.candidatesEligableForChatOnAJob)
            } else {
                setloadingDates(false)
            }

        }
    }, [data])

    const fetchDocuments = async (items: any) => {
        if (items?.length) {
            try {
                const updatedArrayWithTimestamps: any = await getFirebaseTimeStampsOfEachItem(items);
                updatedArrayWithTimestamps.sort((first: any, second: any) => second.firebaseTimeStamp - first.firebaseTimeStamp)

                setCandidateListData(updatedArrayWithTimestamps)
                setloadingDates(false)
            } catch (error) {
                console.log(error);
            }
        }
    }

    const goBack = () => props.navigation.goBack();

    //id, matchId, refetch, source, candidateName, jobId, candidatePicture
    const openCandidatePage = (candidateId: string, matchId: string, candidateName: string, jobId: string, recruiterAction: string, lastAction: string) => {
        props.navigation.navigate('CandidateProfileAndRecruiterComments', {
            candidateId,
            matchId,
            candidateName,
            source: "chat",
            jobId,
            recruiterAction,
            lastAction
        });
        //CandidateProfileAndRecruiterComments
    };

    const [setMultipleNotificationsToRead, { data: data5 }] = useMutation(
        removeMultipleNotifications
    );
    // CandidateProfilePreview
    const clickOnChatIcon = (matchId: string, candidateName: string, candidateId: string, jobId: string, candidatePicture: string, companyId: string) => {
        const foundNotification = notifications
            .filter((notif: Notification) => notif.type == "chat" && notif.matchId == matchId)
            .map((notif: Notification) => notif._id);

        if (foundNotification.length) {
            setMultipleNotificationsToRead({
                variables: {
                    notificationsArray: [...foundNotification],
                },
                context: {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                },
            }).then((data: any) => {
                dispatch(removeMultipleNotificationsRdx(foundNotification));
            })
                .catch((err: any) => {
                    console.log("An error occured while deleting all notifications");
                    console.log({ err });
                });
        }
        navigation.navigate('ChatDetailRecruiter', { matchId, candidateName, candidateId, jobId, candidatePicture, companyId })
    }

    const renderItem = (item: any) => { 

        // const companyName = item.title;
        const blip = notifications.find((notif: Notification) => notif.matchId === item._id && notif.type == "chat");
        // let date = new Date(item.createdAt * 1); //converting to seconds from miliseconds
        // let formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear()
        return (
            <Card style={Platform.OS === 'ios' ? styles.cardIOS : styles.card}>
                <View key={item.key} style={{ flexDirection: 'row', height: hp(10), alignItems: "center" }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => openCandidatePage(item?.candidateListing?._id, item?._id, `${item?.candidateListing?.firstName} ${item?.candidateListing?.lastName}`, item?.jobListing?._id, item?.lastAction, item?.recruiterAction)}>
                        {
                            item?.candidateListing?.profilePicture ? <Image
                                style={Platform.OS === 'ios' ? styles.imageIOS : styles.image}
                                source={{ uri: item?.candidateListing?.profilePicture }}
                            />
                                :
                                <Image
                                    style={Platform.OS === 'ios' ? styles.imageIOS : styles.image}
                                    source={require("../../../assets/icons/chat/recruiter_placeholder.png")}
                                />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => openCandidatePage(item?.candidateListing?._id, item?._id, `${item?.candidateListing?.firstName} ${item?.candidateListing?.lastName}`, item?.jobListing?._id, item?.lastAction, item?.recruiterAction)}>
                        <View style={Platform.OS === 'ios' ? styles.textBoxIOS : styles.textBox}>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#012653', fontSize: 14, fontWeight: "500", lineHeight: 16.8, marginTop: 2 }}>
                                {item?.candidateListing?.firstName} {item?.candidateListing?.lastName}
                            </Text>

                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#868686', fontSize: 12, fontWeight: "500", lineHeight: 14.4, marginTop: 2 }}>
                                {item?.candidateListing?.position}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignContent: "center", paddingLeft: wp(1), width: wp(10), alignItems: "center", height: "100%" }}>
                        {
                            blip ?
                                <TouchableOpacity activeOpacity={1} onPress={() => clickOnChatIcon(item._id, `${item?.candidateListing?.firstName} ${item?.candidateListing?.lastName}`, item?.candidateListing?._id, item?.jobListing?._id, item?.candidateListing?.profilePicture, companyId)}>
                                    <Image style={Platform.OS === 'ios' ? styles.iconIOS : styles.icon} source={require('../../../assets/icons/chat/chaticon_blip.png')} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={1} onPress={() => props.navigation.navigate('ChatDetailRecruiter', { matchId: item._id, candidateName: `${item?.candidateListing?.firstName} ${item?.candidateListing?.lastName}  `, candidateId: item?.candidateListing?._id, jobId: item?.jobListing?._id, candidatePicture: item?.candidateListing?.profilePicture, companyId })}>
                                    <Image style={Platform.OS === 'ios' ? styles.iconIOS : styles.icon} source={require('../../../assets/icons/chat/chaticon.png')} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>

            </Card >
        );
    };
    if (error) {
        console.log('error occured while loading list of candidates');
        console.log({ error });
    }
    return (
        <SafeAreaView edges={['right', 'left']} mode='padding' style={{ flex: 1, backgroundColor: '#f4f7fc', }}>
            <HeaderWithoutNextButton headerTitle='My chats' goBack={goBack} />
            <View style={styles.container}>
                {(!loadingDates && !loading && data?.candidatesEligableForChatOnAJob?.length != 0) ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 40, paddingLeft: wp(3), justifyContent: 'flex-start', }}>
                        <Image style={{ resizeMode: 'contain', width: wp(5), height: hp(5), }} source={require('../../../assets/icons/chat/find.png')} />
                        <TextInput style={{ alignContent: "center", marginLeft: wp(4), fontSize: 15, fontWeight: "400" }}
                            onChangeText={(newText: string) => {
                                const res = data?.candidatesEligableForChatOnAJob.filter((candidate: any) => {
                                    return candidate.candidateListing?.firstName.toLowerCase().includes(newText.toLowerCase()) || candidate.candidateListing?.lastName.toLowerCase().includes(newText.toLowerCase())
                                });
                                setCandidateListData(res);
                            }}
                            placeholder="Search for a candidate"
                            placeholderTextColor={"#181818"}
                        />
                    </View>
                ) : (null)}
                {!loadingDates && !loading && data?.candidatesEligableForChatOnAJob !== null ? (
                    <FlatList data={candidateList} renderItem={({ item }) => renderItem(item)} keyExtractor={(item: any) => item.id} />
                ) : (
                    <View>
                        <ActivityIndicator size='small' color='#000000' />
                    </View>
                )}
                {!loading && data?.candidatesEligableForChatOnAJob?.length == 0 && (
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#181818', textAlign: 'center', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: "400" }}>{'No chat yet.'}</Text>
                    </View>
                )}
                {
                    error ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#181818', textAlign: 'center', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: "400" }}>{'An error occured while loading list of candidates.'}</Text>
                        </View> : null
                }
            </View>
        </SafeAreaView>
    );
};

export default RecruiterChatListOfCandidatesOnJob;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f6fb',
        marginHorizontal: hp('1.5'),
        marginTop: hp('1'),
        justifyContent: 'center',
    },
    card: {
        borderRadius: 10, marginTop: 8,
    },
    cardIOS: {
        borderRadius: 10, marginTop: 8,
    },
    textBox: {
        marginLeft: 10,
        textAlign: "left",
        width: wp('65%'),
    },
    textBoxIOS: {
        marginLeft: 10,
        textAlign: "left",
        // marginTop: hp(2),
        width: wp('65%'),
        // height: hp(8),
        // alignContent: "center",
    },
    image: {
        alignSelf: 'center',
        marginLeft: 6,
        borderRadius: 25,
        height: 50,
        width: 50,
    },
    imageIOS: {
        alignSelf: 'center',
        marginLeft: 6,
        borderRadius: 25,
        height: 50,
        width: 50,
    },
    icon: {
        resizeMode: 'contain',
        height: 30,
        width: 30,
    },
    iconIOS: {
        resizeMode: 'contain',
        height: 30,
        width: 30,
    },
});
