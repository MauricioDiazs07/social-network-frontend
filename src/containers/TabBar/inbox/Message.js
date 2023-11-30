// Library import
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';


// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import ZText from '../../../components/common/ZText';
import {StackNav} from '../../../navigation/NavigationKeys';
import { getAsyncStorageData } from '../../../utils/helpers';
import { PROFILE_ID } from '../../../common/constants';
import { getActiveChats } from '../../../api/chats/chats';

export default function Message({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const [messageDataList, setMessageDataList] = useState([]);

  useEffect(() => {
    getActiveChats_();
  }, []);

  const getActiveChats_ = async () => {
    let profileID = await getAsyncStorageData(PROFILE_ID);
    let activeChats = await getActiveChats(profileID);
    
    setMessageDataList(activeChats['active_chats']);
  }
  
  const RenderHeader = ({title}) => {
    return (
      <View>
        <ZText type="b20" style={styles.mt20}>
          {title}
        </ZText>
      </View>
    );
  };

  const RenderMessageItem = memo(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressMessage(item)}
        style={localStyles.renderItemCoontainer}>
        <FastImage
          source={{uri: item?.imageUrl}}
          style={localStyles.userMsgImage}
        />
        <View style={styles.flex}>
          <View style={localStyles.userName}>
            <ZText type="b18" numberOfLines={1}>
              {item?.name}
            </ZText>
            {item?.pending !== 0 && (
              <View
                style={[
                  localStyles.pendingContainer,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}>
                <ZText type="m14" numberOfLines={2} color={colors.white}>
                  {item?.pending.length > 9
                    ? item?.pending.substring(0, 9) + '...'
                    : item?.pending}
                </ZText>
              </View>
            )}
          </View>
          <View style={localStyles.userName}>
            <ZText type="m14" color={colors.grayScale5} numberOfLines={1}>
              {item?.message}
            </ZText>
            <ZText type="m14" color={colors.grayScale5}>
              {item?.time}
            </ZText>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const onPressMessage = item =>
    navigation.navigate(StackNav.Chat, {
      userName: item.name,
      userImage: item.imageUrl,
      profileId: item.receiver_id
    });

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.messages} />
      <ScrollView
        style={styles.ph20}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pb20}
        bounces={false}>
          
        <FlatList
          data={messageDataList}
          renderItem={({item, index}) => (
            <RenderMessageItem item={item} key={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          ListHeaderComponent={() => <RenderHeader title={strings.message} />}
        />
      </ScrollView>
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  userImage: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(32),
  },
  flatListStoryContainer: {
    ...styles.mt20,
    ...styles.mb10,
  },
  storyContainer: {
    ...styles.mr15,
    ...styles.nonFlexCenter,
  },
  renderItemCoontainer: {
    ...styles.rowCenter,
    ...styles.mt20,
  },
  userMsgImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  userName: {
    ...styles.mh10,
    ...styles.flex,
    ...styles.rowSpaceBetween,
  },
  pendingContainer: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(5),
    borderRadius: 20,
  },
});
