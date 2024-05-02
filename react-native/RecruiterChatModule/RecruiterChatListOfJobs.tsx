import { useQuery } from '@apollo/client';
import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Card } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import HeaderWithoutNextButton from '../../../components/HeaderWithoutNextButton';
import { GET_JOBS_OF_COMPANY } from '../../../helper/graphQL/queries/companies';
import { Notification } from '../../../interfaces/notifications';
import { saveCurrentScreen } from '../../../store/actions/DrawerNavigation';

const RecruiterChatListOfJobs = (props: any) => {
    let { token } = useSelector((state: any) => state.LoginCandidateReducer);
    const { companyName, companyId } = props.route.params;

    const { data, loading, error } = useQuery(GET_JOBS_OF_COMPANY, {
        variables: { companyId }, context: {
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

    const { notifications } = useSelector((state: any) => state.notificationBlip);
    const [jobData, setJobData] = useState([]);

    useEffect(() => {
        if (data?.getJobs) {
            setJobData(data?.getJobs)
        }
    }, [data])

    const goBack = () => props.navigation.goBack();

    const openJobPage = (id: string) => {
        props.navigation.navigate('JobDetail', {
            id,
            showChat: false
        });
    };

    const renderItem = (item: any) => {
        const companyName = item.title;
        const blip = notifications.find((notif: Notification) => notif.jobId === item._id && notif.type == "chat");
        let date = new Date(item.createdAt * 1); //converting to seconds from miliseconds
        let formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();

        return (
            <Card style={Platform.OS === 'ios' ? styles.cardIOS : styles.card}>

                <View key={item.key} style={{ flexDirection: 'row', height: hp(10), alignItems: "center", }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => openJobPage(item._id)}>
                        {
                            item?.company?.logoUrl ? <Image
                                style={Platform.OS === 'ios' ? styles.imageIOS : styles.image}
                                source={{ uri: item?.mobileBanner }}
                            />
                                :
                                <Image
                                    style={Platform.OS === 'ios' ? styles.imageIOS : styles.image}
                                    source={require("../../../assets/icons/chat/company_placeholder.png")}
                                />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} onPress={() => openJobPage(item._id)}>
                        <View style={Platform.OS === 'ios' ? styles.textBoxIOS : styles.textBox}>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#868686', fontSize: 12, fontWeight: "500", lineHeight: 14.4, marginTop: 2 }}>
                                {item?.title}
                            </Text>

                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#6274A9', fontSize: 12, fontWeight: "400", lineHeight: 14.4, marginTop: 2 }}>
                                {item?.company?.name}
                            </Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#898A8D', fontSize: 12, fontWeight: "400", lineHeight: 14.4, marginTop: 2 }}>
                                {formattedDate}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ justifyContent: 'center', alignContent: "center", paddingLeft: wp(1), width: wp(9), alignItems: "center", height: "100%" }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => props.navigation.navigate('ChatMainRecruiter', { jobId: item?._id, jobTitle: item?.name, companyId: item?.company?._id })}>
                            {/* <Icon name='envelope' size={35} color='#dab238' /> */}
                            {
                                blip ?
                                    <Image style={Platform.OS === 'ios' ? styles.iconIOS : styles.icon} source={require('../../../assets/icons/chat/open_blip.png')} />
                                    :
                                    <Image style={Platform.OS === 'ios' ? styles.iconIOS : styles.icon} source={require('../../../assets/icons/chat/open.png')} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>

            </Card >
        );
    };

    if (error) {
        console.log('error occured while loading list of jobs');
        console.log({ error });
    }
    return (
        <SafeAreaView edges={['right', 'left']} mode='padding' style={{ flex: 1, backgroundColor: '#f4f7fc', }}>
            <HeaderWithoutNextButton headerTitle='My chats' goBack={goBack} />
            <View style={styles.container}>
                {(!loading && data?.getJobs?.length != 0) ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 40, paddingLeft: wp(3), justifyContent: 'flex-start', }}>
                        <Image style={{ resizeMode: 'contain', width: wp(5), height: hp(5), }} source={require('../../../assets/icons/chat/find.png')} />
                        <TextInput style={{ alignContent: "center", marginLeft: wp(4), fontSize: 15, fontWeight: "400" }}
                            onChangeText={(newText: string) => {
                                const res = data?.getJobs.filter((job: any) => {
                                    return job.title.toLowerCase().includes(newText.toLowerCase())
                                });
                                setJobData(res);
                            }}
                            placeholder="Search for a job"
                            placeholderTextColor={"#181818"}
                        />
                    </View>
                ) : (null)}
                {!loading && data?.getJobs !== null ? (
                    <FlatList data={jobData} renderItem={({ item }) => renderItem(item)} keyExtractor={(item: any) => item.id} />
                ) : (
                    <View>
                        <ActivityIndicator size='small' color='#000000' />
                    </View>
                )}
                {!loading && data?.getJobs?.length == 0 && (
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#181818', textAlign: 'center', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: "400" }}>{'No chat yet.'}</Text>
                    </View>
                )}
                {
                    error ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#181818', textAlign: 'center', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: "400" }}>{'An error occured while loading jobs'}</Text>
                        </View> : null
                }
                {/* <Text style={{ color: '#dab238', textAlign: 'center', fontFamily: 'Lato-Black', fontSize: hp('2%') }}>happen soon, just keep on liking jobs</Text> */}
            </View>
        </SafeAreaView>
    );
};

export default RecruiterChatListOfJobs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f6fb',
        marginHorizontal: hp('1.5'),
        marginTop: hp('1'),
        justifyContent: 'center',
    },
    card: {
        borderRadius: 10, marginTop: 8
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

