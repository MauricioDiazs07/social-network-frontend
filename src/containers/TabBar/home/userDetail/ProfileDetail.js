// Library import
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, createRef, useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import ZSafeAreaView from '../../../../components/common/ZSafeAreaView';
import ZHeader from '../../../../components/common/ZHeader';
import {getHeight, moderateScale} from '../../../../common/constants';
import {styles} from '../../../../themes';
import ZText from '../../../../components/common/ZText';
import images from '../../../../assets/images';
import ZButton from '../../../../components/common/ZButton';
import {InstagramBg, LikeBg, LikeIconModal} from '../../../../assets/svgs';
import {StackNav} from '../../../../navigation/NavigationKeys';
import SuccessModal from '../../../../components/models/SuccessModal';
import FeedComponent from '../../../../components/FeedComponent';
import {
  userDetail,
  UserDetailCategory,
  videoData,
} from '../../../../api/constant';
import UserStories from '../UserStory/UserStories';
import { getProfilePostData } from '../../../../api/feed/interaction';
import {transformpHistoy, transformfPosts } from '../../../../utils/_support_functions';

export default function ProfileDetail({navigation, route}) {
  const {userName, userImage, profileId} = route.params;
  const colors = useSelector(state => state.theme.theme);
  const [isSelect, setIsSelect] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  // const [historyData, setHistoryData] = useState([]);

  const [masterData, setMasterData] = useState({
    description: '',
    name: '',
    profile_photo: '',
    shares: '',
  });

  const [feeds, setFeeds] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getProfilePostData(profileId).then(resp =>{
      setMasterData(resp);
      // const new_history = transformpHistoy(resp)
      const postFeeds = transformfPosts(resp)
      // setHistoryData(new_history)
      setFeeds(postFeeds)
    })
  }, []);

  const categoryData = [
    {
      id: 0,
      icon: 'apps',
      onPress: () => setIsSelect(0),
      name: 'Feeds',
    },
    {
      id: 1,
      icon: 'bookmark',
      onPress: () => setIsSelect(1),
      name: 'Shorts',
    },
    {
      id: 2,
      icon: 'heart',
      onPress: () => setIsSelect(2),
      name: 'Tags',
    },
  ];

  const onPressEditProfile = () => navigation.navigate(StackNav.UserNetwork);
  const onPressModalClose = () => setModalVisible(false);

  const onPressLike = () => setModalVisible(true);

  const RenderUserDetail = ({item}) => {
    return (
      <View style={styles.itemsCenter}>
        <ZText type="b24" align={'center'}>
          {item.value}
        </ZText>
        <ZText type="m16" align={'center'} style={styles.mt10}>
          {item.title}
        </ZText>
      </View>
    );
  };

  const HeaderCategory = ({item}) => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={[
          localStyles.tabItemStyle,
          {
            borderBottomWidth: isSelect === item.id ? moderateScale(2) : 0,
            borderBottomColor:
              isSelect === item.id ? colors.primary : colors.bColor,
          },
        ]}>
        <Ionicons
          name={item.icon}
          size={moderateScale(30)}
          color={isSelect === item.id ? colors.primary : colors.iconColor}
        />
        <ZText type={'s16'}>{item.name}</ZText>
      </TouchableOpacity>
    );
  };

  const RightIcon = () => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={moderateScale(26)}
            color={colors.textColor}
            style={styles.ml10}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onPressMessage = () =>
    navigation.navigate(StackNav.Chat, {
      userName: userName,
      userImage: userImage,
    });

    const renderReelItem = ({item}) => (
      <FeedComponent data={item} from={'user'}/>
    );
  return (
    <ZSafeAreaView>
      <ZHeader title={userName} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={localStyles.root}>
        <View style={styles.itemsCenter}>
            {/* <Image style={localStyles.bgImg} source={{uri: 'https://marketplace.canva.com/EAFFI2trtnE/1/0/1600w/canva-black-minimalist-motivation-quote-linkedin-banner-cqVV-6-1kOk.jpg'}}></Image> */}
          <TouchableOpacity onPress={onPressEditProfile} style={styles.mt25}>
            {!!userImage?.length ? (
              <Image
                source={{
                  uri: userImage,
                }}
                style={localStyles.userImage}
              />
            ) : (
              <Image
                source={colors.dark ? images.userDark : images.userLight}
                style={localStyles.userImage}
              />
            )}
          </TouchableOpacity>
          <View style={styles.mv20}>
            <ZText type="b24" align={'center'}>
              {userName}
            </ZText>
            <ZText type="s14" align={'center'} style={styles.mt10}>
              {'CEO de empresa'}
            </ZText>
            <ZText
              type="m14"
              align={'center'}
              color={colors.userDesc}
              style={styles.mt10}>
              {masterData.description}
            </ZText>
          </View>
        </View>
        {/* <View style={[styles.flexRow, styles.justifyEvenly]}>
          {UserDetailCategory.map((item, index) => (
            <RenderUserDetail item={item} key={index} />
          ))}
        </View> */}
        <View style={styles.rowSpaceBetween}>
          <ZButton
            title={strings.follow}
            onPress={onPressEditProfile}
            color={colors.white}
            textType="b14"
            style={styles.ml5}
            containerStyle={[
              localStyles.buttonContainer,
              {borderColor: colors.primary},
            ]}
            bgColor={colors.primary}
            frontIcon={
              <Ionicons
                name="person-add-outline"
                size={moderateScale(18)}
                color={colors.white}
              />
            }
          />
          <ZButton
            title={strings.message}
            color={colors.primary}
            onPress={onPressMessage}
            textType="b14"
            style={styles.ml5}
            containerStyle={[
              localStyles.buttonContainer,
              {borderColor: colors.primary},
            ]}
            bgColor={colors.tranparent}
            frontIcon={
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={moderateScale(18)}
                color={colors.primary}
              />
            }
          />
          {/* <InstagramBg />
          <TouchableOpacity onPress={onPressLike}>
            <LikeBg />
          </TouchableOpacity> */}
        </View>
        {/* <View style={[localStyles.storiesContainer]}>
          <UserStories stories={historyData} />
        </View> */}
        <View
          style={[
            localStyles.mainContainer,
            {
              borderBottomColor: colors.bColor,
              borderBottomWidth: moderateScale(2),
            },
          ]}>
          {/* {categoryData.map((item, index) => (
            <HeaderCategory item={item} key={index} />
          ))} */}
        </View>
        <FlatList
          data={feeds}
          renderItem={renderReelItem}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.mt20}
        />
      </ScrollView>
      <SuccessModal
        visible={modalVisible}
        onPressModalClose={onPressModalClose}
        headerTitle={'27M Total Likes'}
        subTitle={'jenny_wilson received a total of 27M likes from all videos.'}
        itemImage={<LikeIconModal style={styles.selfCenter} />}
        btnText={'Ok'}
      />
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  headerContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.alignCenter,
    ...styles.justifyBetween,
    ...styles.mt20,
  },
  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  editProfileContainer: {
    ...styles.flexRow,
    ...styles.justifyEvenly,
    ...styles.mt25,
  },
  buttonContainer: {
    height: getHeight(45),
    width: '48%',
    borderRadius: moderateScale(22),
    borderWidth: moderateScale(1),
  },
  storiesContainer: {
    ...styles.mt15,
    ...styles.flexRow,
    height: moderateScale(100)
  },
  mainContainer: {
    ...styles.rowSpaceBetween,
    width: '100%',
    ...styles.mt15,
  },
  tabItemStyle: {
    borderBottomWidth: moderateScale(2),
    width: '25%',
    ...styles.itemsCenter,
    ...styles.pv15,
    ...styles.rowSpaceBetween,
  },
  bgImg: {
    width: '100%',
    height: moderateScale(120),
    position: 'absolute'
  },
});
