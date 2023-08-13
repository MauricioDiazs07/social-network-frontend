import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';

import {
  moderateScale,
  screenWidth,
} from '../../../../common/constants';
import ZText from '../../../../components/common/ZText';
import {styles} from '../../../../themes';
import {
  ChatIcon_Dark,
  ChatIcon_Light,
  HeartIcon_Dark,
  HeartIcon_Light,
} from '../../../../assets/svgs';
import {StackNav} from '../../../../navigation/NavigationKeys';

const BottomIconContainer = () => {
  const colors = useSelector(state => state.theme.theme);
  return (
    <View style={localStyels.iconsContainer}>
      <View style={localStyels.leftIconsContainer}>
        <View style={localStyels.commentItemContainer}>
          {colors.dark ? (
            <HeartIcon_Dark
              width={moderateScale(28)}
              height={moderateScale(28)}
            />
          ) : (
            <HeartIcon_Light
              width={moderateScale(28)}
              height={moderateScale(28)}
            />
          )}
          <ZText type={'s14'}>{'44,389'}</ZText>
        </View>
        <View style={localStyels.commentItemContainer}>
          {colors.dark ? (
            <ChatIcon_Dark
              width={moderateScale(28)}
              height={moderateScale(28)}
            />
          ) : (
            <ChatIcon_Light
              width={moderateScale(28)}
              height={moderateScale(28)}
            />
          )}
          <ZText type={'s14'}>{'19,377'}</ZText>
        </View>
        <Ionicons
          name="paper-plane-outline"
          size={moderateScale(24)}
          color={colors.reverse}
          style={styles.ml10}
        />
      </View>

      <Ionicons
        name="bookmark-outline"
        size={moderateScale(24)}
        color={colors.reverse}
      />
    </View>
  );
};

const UserPost = ({item}) => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();

  const renderPostImages = ({item}) => {
    return <FastImage source={{uri: item}} style={localStyels.postImage} />;
  };

  const onPressProfile = (userName, userImage) => {
    navigation.navigate(StackNav.ProfileDetail, {
      userName: userName,
      userImage: userImage,
    });
  };

  return (
    <View style={localStyels.postContainer}>
      <View style={localStyels.headerContainer}>
        <TouchableOpacity
          style={localStyels.profileContainer}
          onPress={() => onPressProfile(item.name, item.profileImage)}>
          <FastImage
            source={{uri: item.profileImage}}
            style={localStyels.profileImage}
          />
          <View>
            <ZText type={'b16'}>{item.name}</ZText>
            <ZText
              type={'m14'}
              color={colors.dark ? colors.grayScale4 : colors.grayScale7}>
              {item.subtitle}
            </ZText>
          </View>
        </TouchableOpacity>
        <Ionicons
          name="ellipsis-horizontal"
          size={moderateScale(24)}
          color={colors.reverse}
        />
      </View>
      
      <View>
          <ZText>{item.text}</ZText>
          {item.image.length > 0 && (
            <View style={item.text !== "" ? styles.mt20 : styles.mt5}>
              <FlashList
                data={item.image}
                showsHorizontalScrollIndicator={false}
                keyExtractor={image => image}
                horizontal
                pagingEnabled
                renderItem={renderPostImages}
              />
            </View>
          )}
        </View>
      <BottomIconContainer />
    </View>
  );
};

const localStyels = StyleSheet.create({
  postContainer: {
    ...styles.mb10,
    ...styles.ph20,
  },
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.p10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    ...styles.mr10,
  },
  postImage: {
    width: screenWidth - moderateScale(40),
    aspectRatio: 1,
    // height: getHeight(380),
    borderRadius: moderateScale(25),
  },
  iconsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv20,
  },
  leftIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: moderateScale(150),
  },
  commentItemContainer: {
    ...styles.rowSpaceAround,
    width: moderateScale(90),
  },
});

export default UserPost;
