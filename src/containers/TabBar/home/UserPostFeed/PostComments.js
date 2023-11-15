// libraries import
import React, { useState, useEffect, createRef } from 'react';
import { StyleSheet,
         View,
         TouchableOpacity,
         RefreshControl,
         ActivityIndicator,
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
import { addLike, disLike, addComment } from '../../../../api/feed/interaction';
import { getHeight, moderateScale, screenWidth } from '../../../../common/constants';
import { StackNav } from '../../../../navigation/NavigationKeys';
import { styles } from '../../../../themes';
import { 
    ChatIcon_Dark,
    ChatIcon_Light,
    HeartIcon_Dark,
    HeartIcon_Light,
    LikedHeart } from '../../../../assets/svgs';
import { getShare } from '../../../../api/feed/posts';
import EditPostMenu from '../../../../components/models/EditPostMenu';
import { deletePost } from '../../../../api/feed/posts';
import images from '../../../../assets/images';

const BottomIconContainer = ({item}) => {
  const colors = useSelector(state => state.theme.theme);

  const [likes, setLikes] = useState(item['likes']['count']);
  const [isLiked, setIsLiked] = useState(item['likes']['like']);

  const onPressLike = () => {
    // TODO: add catch in order to remove like if petition is not resolved
    // TODO: add the same code in UserPost.js
    if (!isLiked) {
      setLikes(likes + 1);
      getAsyncStorageData('PROFILE_ID').then(profile => {
        addLike(profile, item['id'], item['shareType']);
      });
    } else {
      setLikes(likes - 1);
      getAsyncStorageData('PROFILE_ID').then(profile => {
        disLike(profile, item['id'], item['shareType']);
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
  const item = props.route.params.idPost;
  const fromUser = props.route.params.fromUser;
  const EditPostMenuSheetRef = createRef();

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
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostUpdate, setIsPostUpdate] = useState(false);  

  useEffect(() => {
    if (isLoading) {
      getPostInfo();
    }
  });

  const getPostInfo = async () => {
    const resp = await getShare(item['id']);
    setItem(resp);
    setComments(resp['comments']['data']);
    
    setIsLoading(false);
  }

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
    return <FastImage source={{uri: item['archive_url']}} style={localStyles.postImage} />;
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
  
  const onRefresh = () => {
    navigation.navigate(StackNav.PostComments,
      {item: item});
  }
  useEffect(() => {
    EditPostMenuSheetRef?.current?.hide();
  }, [isPostUpdate]);

  const onPressEditPostMenu = () => {
    EditPostMenuSheetRef?.current.show()};

  const onPressEdit = () => {
    setIsPostUpdate(true);
    navigation.navigate(StackNav.EditPost,
      {idPost: item});
  };

  const onPressDelete = async (post) => {
    await deletePost(post)
    .then(
      setIsPostUpdate(true),
      navigation.reset({
        index: 0,
        routes: [{name: StackNav.TabBar}],
      })
    )
    .catch(error => console.log('Delete error:', error));
  };
  
  const onchangeComment = text => setAddChat(text);

  const onPressSend = () => {
    if (addChat.length > 0) {
      addComment(item['profileId'], item['id'], addChat);
      let commentsData = {
        comment: addChat,
        creation_date: item['creationDate'],
        id: item['id'],
        name: item['name'],
        profile_id: item['profileId'],
        profile_photo: item['profileImage']
      }

      setComments(prevComments => [...prevComments, commentsData]);
      setAddChat('');
    }
  };
  
  return (
    <ZSafeAreaView>
      <ZKeyBoardAvoidWrapper>
        <ScrollView
          refreshControl={
              <RefreshControl onRefresh={onRefresh}/>
          }
        >
          {!isLoading ? (
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
                      {item['creationDate']}
                  </ZText>
                  </View>
              </TouchableOpacity>
              <EditPostMenu
                onPressEdit={onPressEdit}
                onPressDelete={() => onPressDelete(item.id)}
                SheetRef={EditPostMenuSheetRef}
              />
              {fromUser === 'admin' && (
                <TouchableOpacity
                onPress={onPressEditPostMenu}
                >
                  <Ionicons
                      name="ellipsis-horizontal"
                      size={moderateScale(24)}
                      color={colors.reverse}
                  />
                </TouchableOpacity>
              )}
              </View>

              <View style={[styles.mr20, styles.ml20]}>
                <ZText>{item.text}</ZText>              
                <View style={item.text !== '' ? styles.mt20 : styles.mt5}>
                  <FlashList
                    data={item.image.length > 0 ? images.post : item.image}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={id => id}
                    horizontal
                    pagingEnabled
                    renderItem={renderPostImages}
                  />
                </View>
              </View>
          <BottomIconContainer item={item} />

          <FlashList
            contentContainerStyle={localStyles.listContainer}
            data={comments}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            // horizontal
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

          </View>) : (
            <View style={localStyles.loadingPosts}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
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
      borderRadius: moderateScale(20),
      borderWidth: moderateScale(1),
      ...styles.ph15,
    },
    loadingPosts: {
      height: getHeight(200),
      ...styles.rowCenter
    },
    listContainer: {
      ...styles.ph20,
      ...styles.flex0
    },
});
