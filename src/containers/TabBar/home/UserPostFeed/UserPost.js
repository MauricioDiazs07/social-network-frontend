import React, { useState } from 'react';
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
  LikedHeart
} from '../../../../assets/svgs';
import {StackNav} from '../../../../navigation/NavigationKeys';

const BottomIconContainer = ({item}) => {
  const colors = useSelector(state => state.theme.theme);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(item['likes']['count']);
 
  const onPressLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
    } else {
      setLikes(likes - 1);
    }

    setIsLiked(!isLiked);
  };

  return (
    <View style={localStyels.iconsContainer}>
      <View style={localStyels.leftIconsContainer}>
        <View style={localStyels.commentItemContainer}>
          <TouchableOpacity
            onPress={onPressLike}
          >
            {isLiked ? (
              <LikedHeart
                width={moderateScale(28)}
                height={moderateScale(28)}
              />
            ) : (
              colors.dark ? (
                <HeartIcon_Dark
                  width={moderateScale(28)}
                  height={moderateScale(28)}
                />
              ) : (
                <HeartIcon_Light
                  width={moderateScale(28)}
                  height={moderateScale(28)}
                />
              )
            )}
          </TouchableOpacity>
          <ZText type={'s14'}>{likes}</ZText>
        </View>
        <View style={localStyels.commentItemContainer}>
          <TouchableOpacity>
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
          </TouchableOpacity>
          <ZText type={'s14'}>{item['comments']['count']}</ZText>
        </View>
      </View>
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
      <BottomIconContainer item={item} />
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
    ...styles.mv20,
  },
  leftIconsContainer: {
    ...styles.rowSpaceBetween
  },
  commentItemContainer: {
    ...styles.rowSpaceAround,
    width: moderateScale(90),
  },
});

export default UserPost;
