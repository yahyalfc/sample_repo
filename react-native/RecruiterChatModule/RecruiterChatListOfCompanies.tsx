import { useQuery } from '@apollo/client';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Card } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import HeaderWithDrawerButton from '../../../components/HeaderWithDrawerButton';
import { GET_RECRUITER_COMPANIES } from '../../../helper/graphQL/queries/companies';
import { Notification } from '../../../interfaces/notifications';
import { saveCurrentScreen } from '../../../store/actions/DrawerNavigation';

const RecruiterChatListOfCompanies = (props: any) => {
    let { token } = useSelector((state: any) => state.LoginCandidateReducer);
    const { data, loading, error } = useQuery(GET_RECRUITER_COMPANIES, {
        context: {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }, fetchPolicy: 'network-only'
    });
    const isFocused = useIsFocused();
    const { notifications } = useSelector((state: any) => state.notificationBlip);
    const [companyData, setcompanyData] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!!isFocused) {
            dispatch(saveCurrentScreen(route.name));
        }
    }, [isFocused])

    const drawerOpen = () => {
        props.navigation.openDrawer();
    };

    useEffect(() => {
        if (data?.userCompanies) {
            setcompanyData(data?.userCompanies)
        }
    }, [data])
    const renderItem = (item: any) => {
        const blip = notifications.find((notif: Notification) => notif.companyId === item._id && notif.type == "chat");
        let date = new Date(item.createdAt * 1); //converting to seconds from miliseconds
        let formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear()

        return (
            <Card style={Platform.OS === 'ios' ? styles.cardIOS : styles.card}>

                <View key={item.key} style={{ flexDirection: 'row', alignItems: "center", height: hp(10) }}>
                    {
                        item?.logoUrl ?
                            <Image
                                style={Platform.OS === 'ios' ? styles.imageIOS : styles.image}
                                source={{ uri: item?.logoUrl }}
                            />
                            :
                            <Image
                                style={Platform.OS === 'ios' ? styles.imageIOS : styles.image}
                                source={require("../../../assets/icons/chat/company_placeholder.png")}
                            />
                    }
                    <View style={Platform.OS === 'ios' ? styles.textBoxIOS : styles.textBox}>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('CompanyPage', { companyName: item?.name, companyId: item._id, data: item })}
                        >
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#6274A9', fontSize: 14, fontWeight: "700", lineHeight: 14.4, marginTop: 2 }}>
                                {item?.name}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row" }}>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#BC9623B2', fontSize: 12, fontWeight: "500", lineHeight: 14.4, marginTop: 2 }}>
                            {item?.sector?.title}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ textTransform: "capitalize", fontFamily: 'Lato-Regular', color: '#898A8D', fontSize: 12, fontWeight: "400", lineHeight: 14.4, marginTop: 2 }}>
                            {formattedDate}
                        </Text>
                    </View>

                    <View style={{ justifyContent: 'center', alignContent: "center", paddingLeft: wp(1), width: wp(10), alignItems: "center", height: "100%", }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => props.navigation.navigate('ChatJobsList', { companyName: item?.name, companyId: item._id, })}>
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
            <HeaderWithDrawerButton headerTitle='My chats' drawerOpen={drawerOpen} showChat={false} />
            <View style={styles.container}>
                {(!loading && data?.userCompanies?.length != 0) ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', justifyContent: 'flex-start', borderRadius: 40, paddingLeft: wp(3) }}>
                        <Image style={{ height: hp(5), width: wp(5), resizeMode: 'contain' }} source={require('../../../assets/icons/chat/find.png')} />
                        <TextInput style={{ alignContent: "center", marginLeft: wp(4), fontSize: 15, fontWeight: "400" }}
                            onChangeText={(newText: string) => {
                                const res = data?.userCompanies.filter((company: any) => {
                                    return company.name.toLowerCase().includes(newText.toLowerCase())
                                });
                                setcompanyData(res);
                            }}
                            placeholder=" Search for a company"
                            placeholderTextColor={"#181818"}
                        />
                    </View>
                ) : (null)}
                {!loading && data?.userCompanies !== null ? (
                    <FlatList data={companyData} renderItem={({ item }) => renderItem(item)} keyExtractor={(item: any) => item.id} />
                ) : (
                    <View>
                        <ActivityIndicator size='small' color='#000000' />
                    </View>
                )}
                {!loading && data?.userCompanies?.length == 0 && (
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#181818', textAlign: 'center', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: "400" }}>{'No companies'}</Text>
                    </View>
                )}
                {
                    error ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#181818', textAlign: 'center', fontFamily: 'Lato-Regular', fontSize: 16, fontWeight: "400" }}>{'An error occured while loading companies.'}</Text>
                        </View> : null
                }
                {/* <Text style={{ color: '#dab238', textAlign: 'center', fontFamily: 'Lato-Black', fontSize: hp('2%') }}>happen soon, just keep on liking jobs</Text> */}
            </View>
        </SafeAreaView>
    );
};

export default RecruiterChatListOfCompanies;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f6fb',
        marginHorizontal: hp('1.5'),
        marginTop: hp('1'),
        justifyContent: 'center',
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    card: {
        borderRadius: 10, marginTop: 8
    },
    cardIOS: {
        borderRadius: 10, marginTop: 8
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