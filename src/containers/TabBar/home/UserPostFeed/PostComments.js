// libraries import
import React, { useState, useEffect } from 'react';
import { StyleSheet,
         View,
         TouchableOpacity,
         RefreshControl,
         ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';

// local imports
import ZHeader from '../../../../components/common/ZHeader';
import ZSafeAreaView from '../../../../components/common/ZSafeAreaView';
import ZText from '../../../../components/common/ZText';
import ZInput from '../../../../components/common/ZInput';
import ZKeyBoardAvoidWrapper from '../../../../components/common/ZKeyBoardAvoidWrapper';
import { getAsyncStorageData } from '../../../../utils/helpers';
import { addLike, disLike } from '../../../../api/feed/interaction';
import { moderateScale, screenWidth } from '../../../../common/constants';
import { StackNav } from '../../../../navigation/NavigationKeys';
import { styles } from '../../../../themes';
import { 
    ChatIcon_Dark,
    ChatIcon_Light,
    HeartIcon_Dark,
    HeartIcon_Light,
    LikedHeart } from '../../../../assets/svgs';

const BottomIconContainer = ({item}) => {
  const colors = useSelector(state => state.theme.theme);

  const [isLiked, setIsLiked] = useState(item['likes']['like']);
  const [likes, setLikes] = useState(item['likes']['count']);

  const onPressLike = () => {
    // TODO: add catch in order to remove like if petition is not resolved
    // TODO: add the same code in UserPost.js
    if (!isLiked) {
      setLikes(likes + 1);
      getAsyncStorageData('PROFILE_ID').then(profile => {
        addLike(profile, item['id'], item['postType']);
        console.log(item);
      });
    } else {
      setLikes(likes - 1);
      getAsyncStorageData('PROFILE_ID').then(profile => {
        disLike(profile, item['id'], item['postType']);
      });
    }

    setIsLiked(!isLiked);
  };

  return (
    <View style={localStyles.iconsContainer}>
      <View style={localStyles.leftIconsContainer}>
        <View style={localStyles.commentItemContainer}>
          <TouchableOpacity onPress={onPressLike}>
            {isLiked ? (
              <LikedHeart
                width={moderateScale(28)}
                height={moderateScale(28)}
              />
            ) : colors.dark ? (
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
          </TouchableOpacity>
          <ZText type={'s14'}>{likes}</ZText>
        </View>
        <View style={localStyles.commentItemContainer}>
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

const PostComments = props => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };
  
  const [addChat, setAddChat] = useState('');
  const [chatStyle, setChatStyle] = useState(BlurredStyle);
  const [item, setItem] = useState(props.route.params.idPost);
  console.log("ITEM", item);

  useEffect(() => {
    
  });

  const onFocusInput = () => setChatStyle(FocusedStyle);

  const onBlurInput = () => setChatStyle(BlurredStyle);
  
  const SendIcon = () => (
    <TouchableOpacity
      onPress={onPressSend}>
      <Ionicons
        name={'send'}
        size={moderateScale(20)}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
  
  const renderPostImages = ({item}) => {
    return <FastImage source={{uri: item}} style={localStyles.postImage} />;
  };

  const renderComments = ({item}) => {
    return (
        <View style={localStyles.headerContainer}>
          <TouchableOpacity
            style={localStyles.profileContainer}
            onPress={() => onPressProfile(item.name, item.profileImage, item.profileId)}
          >
            <FastImage
              source={{uri: item.profile_photo}}
              style={localStyles.profileImage}
            />
            <View>
              <ZText type={'b16'}>{item.name}</ZText>
              <ZText
                type={'m14'}
                color={colors.dark ? colors.grayScale4 : colors.grayScale7}>
                {item.comment}
              </ZText>
            </View>
          </TouchableOpacity>
        </View>
    )
  };

  const onPressProfile = (userName, userImage, profileId) => {
    navigation.navigate(StackNav.ProfileDetail, {
      userName: userName,
      userImage: userImage,
      profileId: profileId
    });
  };
  
  const onRefresh = () => navigation.reset({
    // TODO: pass id of post
    index: 0,
    routes: [{name: StackNav.TabBar}]
  });
  
  const onchangeComment = text => setAddChat(text);

  const onPressSend = () => {
    console.log("Comentario enviado");
  };

  return (
    <ZSafeAreaView>
      <ZKeyBoardAvoidWrapper>
        <ScrollView
          refreshControl={
              <RefreshControl onRefresh={onRefresh}/>
          }
        >
          <View>
              <ZHeader />
              <View style={localStyles.headerContainer}>
              <TouchableOpacity
                  style={localStyles.profileContainer}
                  onPress={() => onPressProfile(item.name, item.profileImage, item.profileId)}
              >
                  <FastImage
                  source={{uri: item.profileImage}}
                  style={localStyles.profileImage}
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

              <View style={[styles.mr20, styles.ml20]}>
              <ZText>{item.text}</ZText>
              {item.image.length > 0 && (
                  <View style={item.text !== '' ? styles.mt20 : styles.mt5}>
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

          <FlashList
              data={item.comments.data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={image => image}
              horizontal
              pagingEnabled
              renderItem={renderComments}
          />

          <View style={styles.m10}>
            <ZInput
              placeHolder={strings.message + '...'}
              keyBoardType={'default'}
              _value={addChat}
              autoCapitalize={'none'}
              rightAccessory={() => <SendIcon />}
              toGetTextFieldValue={onchangeComment}
              inputContainerStyle={[
                {backgroundColor: colors.inputBg},
                localStyles.inputContainerStyle,
                chatStyle,
              ]}
              _onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
          </View>

          </View>
        </ScrollView>
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default PostComments;

const localStyles = StyleSheet.create({
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
    inputContainerStyle: {
      // height: moderateScale(60),
      borderRadius: moderateScale(20),
      borderWidth: moderateScale(1),
      ...styles.ph15,
    },
});
