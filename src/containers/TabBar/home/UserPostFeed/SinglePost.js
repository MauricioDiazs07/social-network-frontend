// libraries import
import React, { useState, useEffect, createRef } from 'react';
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
import EditPostMenu from '../../../../components/models/EditPostMenu';
import { deletePost } from '../../../../api/feed/posts';

const BottomIconContainer = ({item}) => {
  const colors = useSelector(state => state.theme.theme);

  const [isLiked, setIsLiked] = useState(item['likes']['like']);
  const [likes, setLikes] = useState(item['likes']['count']);

  const onPressLike = () => {
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

const SinglePost = props => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [isPostUpdate, setIsPostUpdate] = useState(false);
  const EditPostMenuSheetRef = createRef();

  const [item, setItem] = useState(props.route.params.dataPost);

  const dataImage = item?.image[0];
  console.log("ITEM IMAGE", typeof dataImage);
  console.log("ITEM TEXT",  item.text);
  
  const renderPostImages = ({item}) => {
    return <FastImage source={{uri: dataImage}} style={localStyles.postImage} />;
  };

  const renderComments = ({item}) => {
    return (
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
              <EditPostMenu
                onPressEdit={onPressEdit}
                onPressDelete={() => onPressDelete(item.id)}
                SheetRef={EditPostMenuSheetRef}
              />
              <TouchableOpacity
              onPress={onPressEditPostMenu}
              >
                <Ionicons
                    name="ellipsis-horizontal"
                    size={moderateScale(24)}
                    color={colors.reverse}
                />
              </TouchableOpacity>
              </View>

              <View style={[styles.mr20, styles.ml20]}>
              <ZText>{item.text}</ZText>
              {dataImage.length > 0 && (
                  <View style={item.text !== '' ? styles.mt20 : styles.mt5}>
                  <FlashList
                      data={dataImage}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={dataImage => dataImage}
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
              keyExtractor={dataImage => dataImage}
              horizontal
              pagingEnabled
              renderItem={renderComments}
          />
          </View>
        </ScrollView>
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default SinglePost;

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
