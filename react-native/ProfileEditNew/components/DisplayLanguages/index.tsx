
import React from 'react';
import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

function DisplayLanguages({ largeBottomSheetHandler, languagesCopy }: any) { 
    return (
        <View style={{ width: '100%' }}>
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
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",marginBottom:languagesCopy?.length > 0 ?15:0 }}>
                        {languagesCopy?.length  ? (
                            <>
                                <Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653" }}>Languages</Text>
                                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-end" }}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => largeBottomSheetHandler("languages")}
                                    >
                                        <Image style={{ width: 24, height: 24 }} source={require("../../../../../assets/icons/Profile_icons/edit_icon.png")} />
                                    </TouchableOpacity>

                                </View>
                            </>
                        ) : (
                            <>
                            <Text style={{ fontFamily: "Lato-Regular", textAlign: 'left', fontSize: 20, fontWeight: "600", color: "#012653" }}>Languages</Text>
                            </>
                        )}

                    </View>


                    {languagesCopy ? (
                        <>
                            <View style={{ paddingTop: 7, paddingBottom: 7,marginBottom:languagesCopy?.length > 0 ? 15:0 }}>
                                <View>
                                    {languagesCopy?.map((item: any, index:number) => {
                                        return (
                                            <View key={index} style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', marginBottom:2 }}> 
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 3 }}>
                                                            <Text style={{ textAlign: 'left', width: '40%', fontFamily: 'Lato-Regular', fontWeight: '400', fontSize: 14 }}>{item?.language}</Text>
                                                            <Text style={{ textAlign: 'left', width: '60%', color: "#2E4A79", fontFamily: 'Lato-Regular', fontWeight: '400', fontSize: 14 }}>{item?.level}</Text>
                                                        </View> 
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => largeBottomSheetHandler("languages")}
                                >
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <Image style={{ marginRight: 15, height: 25, width: 25 }} source={require("../../../../../assets/icons/Profile_icons/add_button.png")}></Image>
                                        <Text style={{ color: "#1D97A2", fontFamily:'Lato-Regular', fontWeight:'500', fontSize:18 }}>Add a new language</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => largeBottomSheetHandler("languages")}
                            >
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <Image style={{ marginRight: 15, height: 25, width: 25 }} source={require("../../../../../assets/icons/Profile_icons/add_button.png")}></Image>
                                    <Text style={{ color: "#1D97A2",  fontFamily:'Lato-Regular', fontWeight:'500', fontSize:18  }}>Add a new language</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </View>
        </View>
    )

}
export default DisplayLanguages;