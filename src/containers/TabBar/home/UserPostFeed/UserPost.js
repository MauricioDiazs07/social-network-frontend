// libraries import
import React, { useState, createRef, useEffect } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';

// local import
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
import { addLike, disLike } from '../../../../api/feed/interaction';
import {getAsyncStorageData} from '../../../../utils/helpers';
import EditPostMenu from '../../../../components/models/EditPostMenu';
import { deletePost } from '../../../../api/feed/posts';

const BottomIconContainer = ({item}) => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();

  const [isLiked, setIsLiked] = useState(item['likes']['like']);
  const [likes, setLikes] = useState(item['likes']['count']);
 
  const onPressLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      getAsyncStorageData("PROFILE_ID").then(profile => {
        addLike(profile, item['id'], item['postType'])
        console.log(item);
      })
      
    } else {
      setLikes(likes - 1);
      getAsyncStorageData("PROFILE_ID").then(profile => {
        disLike(profile, item['id'], item['postType'])
      }) 
    }

    setIsLiked(!isLiked);
  };

  const OnPressComments = () => {
    navigation.navigate(StackNav.PostComments,
      {idPost: item});
  }

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
          <TouchableOpacity
            onPress={OnPressComments}
          >
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
  const [isPostUpdate, setIsPostUpdate] = useState(false);
  const EditPostMenuSheetRef = createRef();

  const renderPostImages = ({item}) => {
    return <FastImage source={{uri: item}} style={localStyels.postImage} />;
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

  return (
    <View style={localStyels.postContainer}>
      <View style={localStyels.headerContainer}>
        <TouchableOpacity
          style={localStyels.profileContainer}
          onPress={() => onPressProfile(item.name, item.profileImage, item.profileId)}>
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
  menuContainer: {
    flex: 1,
    backgroundColor: "#fff",
    color: 'black',
    fontSize: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    flexDirection: "column",
    zIndex: 100
  
  },
  btnContainer: {    
    ...styles.p2,
    // ...styles.mv20,
    ...styles.flexColumn,
    backgroundColor: 'white',
    width: '75%',
    height: '40%',
    zIndex: 1
  },
  skipBtnContainer: {
    width: '45%',
  },
});

export default UserPost;
