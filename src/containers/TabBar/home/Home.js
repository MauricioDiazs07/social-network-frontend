import { View,
        TouchableOpacity,
        StyleSheet,
        ScrollView,
        RefreshControl,
        ActivityIndicator } from 'react-native';
import React, { useMemo, createRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import { getHeight, moderateScale } from '../../../common/constants';
import {
  App_Logo,
  StoryAddIcon,
  Profile_Dark,
  Profile_Light
} from '../../../assets/svgs';
import images from '../../../assets/images';
import {styles} from '../../../themes';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';
import UserStories from './UserStory/UserStories';
import UserPost from './UserPostFeed/UserPost';
import { userDetail } from '../../../api/constant';
import ZText from '../../../components/common/ZText';
import LogOut from '../../../components/models/LogOut';
import { ACCESS_TOKEN, USER_LEVEL, THEME } from '../../../common/constants';
import { getAsyncStorageData, setAsyncStorageData } from '../../../utils/helpers';
import { changeThemeAction } from '../../../redux/action/themeAction';
import { colors as clr } from '../../../themes';
import { getPosts } from '../../../api/feed/posts';
import { transformfPosts } from '../../../utils/_support_functions';
import { SearchingPosts } from '../../../assets/svgs';

const LogOutSheetRef = createRef();
const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();
const onPressCancel = () => LogOutSheetRef?.current?.hide();
let user_access = '';

const getUserLevel = async () => {
  await AsyncStorage.getItem(USER_LEVEL)
    .then((data) => {
      user_access = JSON.parse(data);
    }).catch(err => console.log("ERROR:", err));
};

const UserProfile = React.memo(() => {
  const colors = useSelector(state => state.theme.theme);

  return (
    <View style={localStyles.itemContainer}>
      <View style={localStyles.itemInnerContainer}>
        <FastImage
          source={images.profile}
          style={[
            localStyles.itemImage,
            {
              borderWidth: 0,
            },
          ]}
        />
        <StoryAddIcon
          style={localStyles.addIcon}
          width={moderateScale(25)}
          height={moderateScale(25)}
        />
      </View>
      <ZText type={'s14'} style={localStyles.itemUsername} color={colors.white}>
        {strings.you}
      </ZText>
    </View>
  );
});

const RightHeaderIcons = React.memo(() => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);

  getUserLevel();

  const onPressProfileIcon = () => {
    if (user_access == 'user') {
      navigation.navigate(StackNav.UserProfile);
    }
    else if (user_access == 'admin') {
      navigation.navigate(StackNav.Profile);
    }
  };

  const onPressThemeBtn = async () => {
    if (isDark) {
      await setAsyncStorageData(THEME, 'dark');
      dispatch(changeThemeAction(clr.dark));
    } else {
      await setAsyncStorageData(THEME, 'light');
      dispatch(changeThemeAction(clr.light));
    }

    setIsDark(!isDark);
  };

  return (
    <View style={localStyles.headerRightIcon}>
      <TouchableOpacity 
        onPress={onPressProfileIcon}
        style={localStyles.rightBtns}
      >
        {colors.dark ? (
          <Profile_Dark
            width={moderateScale(28)}
            height={moderateScale(28)}
          />
        ) : (
          <Profile_Light
            width={moderateScale(28)}
            height={moderateScale(28)}
          />
        )}

      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressThemeBtn}
        style={localStyles.rightBtns}>
        <MaterialIcon
            name="theme-light-dark"
            size={moderateScale(30)}
            color={colors.dark ? colors.white : colors.darkColor}
            style={localStyles.editIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressLogOutBtn}
        style={localStyles.rightBtns}>
        <Ionicons
          name={'log-out-outline'}
          size={moderateScale(30)}
          color={colors.dark ? colors.white : colors.darkColor}
        />
      </TouchableOpacity>
    </View>
  );
});

const LeftHeaderIcon = React.memo(() => {
  return (
    <View style={styles.pr10}>
      <App_Logo height={moderateScale(30)} width={moderateScale(30)} />
    </View>
  );
});

const Home = () => {
  const navigation = useNavigation();
  const rightHeaderIcon = useMemo(() => <RightHeaderIcons />, []);
  const leftHeaderIcon = useMemo(() => <LeftHeaderIcon />, []);

  const [postData, setPostData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    getAsyncStorageData("PROFILE_ID").then(profile => {
      getPosts(profile)
      .then(resp => {
        const new_posts = transformfPosts(resp);
        setPostData(new_posts);
        setIsLoaded(true);
      });
    });
  }, []);

  const onRefresh = () => navigation.reset({
                                          index: 0,
                                          routes: [{name: StackNav.TabBar}]
                                        });

  const onPressYesLogOut = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      await AsyncStorage.removeItem(USER_LEVEL);
      LogOutSheetRef?.current?.hide();
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: StackNav.Auth}],
        });
      }, 500);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const headerStory = () => {
    return (
      <UserStories ListHeaderComponent={<UserProfile />} stories={userDetail} />
    );
  };

  return (
    <ZSafeAreaView>
      <ZHeader
        isHideBack
        title={strings.appName}
        rightIcon={rightHeaderIcon}
        isLeftIcon={leftHeaderIcon}
      />
      <ScrollView 
        refreshControl={
          <RefreshControl onRefresh={onRefresh} />
        }>
        {postData.length > 0 ? (
          <FlashList
            data={postData}
            keyExtractor={item => item.id}
            renderItem={({item}) => <UserPost item={item} dataLength={postData.length}/>}
            ListHeaderComponent={headerStory}
            showsVerticalScrollIndicator={false}
          />
        ) : !isLoaded ?
        (<View>
          {headerStory()}
          <View style={localStyles.loadingPosts}>
            <ActivityIndicator size="large" color="#B042FF" />
          </View>
        </View>)
        : (
          <View>
            {headerStory()}
            <View style={[styles.center, styles.p30]}>
              <ZText type={'s28'} style={{textAlign: 'center'}}>
                {strings.postsNotFound}
              </ZText>
              <View >
                <SearchingPosts />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <LogOut
        SheetRef={LogOutSheetRef}
        onPressLogOut={onPressYesLogOut}
        onPressCancel={onPressCancel}
      />
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pt20,
    ...styles.ph20,
    ...styles.pb10,
  },
  headerRightIcon: {
    ...styles.rowSpaceBetween,
    width: '20%',
    ...styles.mr20,
  },
  itemContainer: {
    alignItems: 'center',
    ...styles.mr20,
  },
  itemInnerContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(40),
  },
  itemImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    borderWidth: moderateScale(4),
  },
  itemUsername: {
    ...styles.mt10,
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  rightBtns: {
    ...styles.mr10,
  },
  loadingPosts: {
    height: getHeight(200),
    ...styles.rowCenter
  },
});

export default Home;
