import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useMemo, createRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import {moderateScale} from '../../../common/constants';
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
import {postData, userDetail} from '../../../api/constant';
import ZText from '../../../components/common/ZText';
import LogOut from '../../../components/models/LogOut';
import { ACCESS_TOKEN, USER_LEVEL } from '../../../common/constants';
  
const LogOutSheetRef = createRef();
const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();
const onPressCancel = () => LogOutSheetRef?.current?.hide();

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

  const onPressProfileIcon = () => navigation.navigate(StackNav.UserProfile);

  return (
    <View style={localStyles.headerRightIcon}>
      <TouchableOpacity 
        onPress={onPressProfileIcon}
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
        onPress={onPressLogOutBtn}
        style={localStyles.settingsContainer}>
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
      <FlashList
        data={postData}
        keyExtractor={item => item.id}
        renderItem={({item}) => <UserPost item={item} />}
        ListHeaderComponent={headerStory}
        showsVerticalScrollIndicator={false}
      />
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
});

export default Home;
