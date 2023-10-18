// Library import
import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local import
import {StackRoute, TabRoute} from '../NavigationRoutes';
import {StackNav, TabNav} from '../NavigationKeys';
import {checkPlatform} from '../../utils/helpers';
import {getHeight, moderateScale} from '../../common/constants';
import ZText from '../../components/common/ZText';
import strings from '../../i18n/strings';
import {
  Add_Icon,
  Home_Dark,
  Home_Light,
  Inbox_Dark,
  Inbox_Light,
} from '../../assets/svgs';
import {styles} from '../../themes';
import ProfilePicture from '../../components/models/ProfilePicture';
import { USER_LEVEL } from '../../common/constants';

let user_access = '';

const getUserLevel = async () => {
  await AsyncStorage.getItem(USER_LEVEL)
    .then((data) => {
      user_access = JSON.parse(data);
      console.log("TABBAR USERACCESS:", user_access, user_access == "master");
    }).catch(err => console.log("ERROR:", err));
};

export default function TabBarNavigation({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const Tab = createBottomTabNavigator();
  const ProfilePictureSheetRef = React.createRef();
  const user_level = getUserLevel();

  const TabText = ({text, focused, icon}) => (
    <View style={localStyles.tabViewContainer}>
      {icon}
      {!!text && !focused && (
        <ZText
          type={focused ? 'b14' : 'm14'}
          numberOfLines={1}
          style={styles.mt5}
          color={focused ? colors.primary : colors.grayScale5}>
          {text}
        </ZText>
      )}
    </View>
  );

  const onPressAdd = () => ProfilePictureSheetRef?.current?.show();

  const onPressPost = () => {
    ProfilePictureSheetRef?.current?.hide();
    navigation.navigate(StackNav.PostDetail);
  };

  const onPressLive = () => {
    ProfilePictureSheetRef?.current?.hide();
    // navigation.navigate(StackNav.Live);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          localStyles.tabBarStyle,
          {
            backgroundColor: colors.backgroundColor,
          },
        ],
        tabBarShowLabel: false,
      }}
      initialRouteName={user_access == "master" ? TabNav.MasterHome : TabNav.Home}>
      <Tab.Screen
        name={user_access == "master" ? TabNav.MasterHome : TabNav.Home}
        component={user_access == "master" ? TabRoute.MasterHome : TabRoute.Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              {user_access !== "master" && (<TabText
                text={strings.home}
                focused={focused}
                icon={focused ? <Home_Dark /> : <Home_Light />}
              />)}
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name={StackNav.Search}
        component={StackRoute.Search}
        listeners={{tabPress: e => e.preventDefault()}}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              {user_access === 'admin' && (<TouchableOpacity
                onPress={onPressAdd}
                style={localStyles.tabViewContainer}>
                <Add_Icon 
                  style={localStyles.add_icon}
                />
                <ProfilePicture
                  SheetRef={ProfilePictureSheetRef}
                  post={true}
                  live={true}
                  title={strings.choose}
                  onPressCamera={onPressPost}
                  onPressGallery={onPressLive}
                />
              </TouchableOpacity>)}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.Shorts}
        component={TabRoute.Shorts}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              {user_access !== "master" &&(<TabText
                text={strings.shorts}
                focused={focused}
                icon={focused ? <Inbox_Dark /> : <Inbox_Light />}
              />)}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const localStyles = StyleSheet.create({
  tabBarStyle: {
    height: checkPlatform() === 'ios' ? getHeight(100) : getHeight(70),
    paddingHorizontal: moderateScale(10),
  },
  tabViewContainer: {
    ...styles.center,
    width: 100,
    height: 100,
  },
  img: {
    flex: 1,
    width: 100,
    height: 100,
    resizeMode: 'contain'
}
});
