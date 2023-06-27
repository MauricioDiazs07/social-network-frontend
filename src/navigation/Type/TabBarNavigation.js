// Library import
import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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
import {getUserLevel} from '../../utils/helpers';

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
    navigation.navigate(StackNav.Live);
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
      initialRouteName={TabNav.Home}>
      <Tab.Screen
        name={TabNav.Home}
        component={TabRoute.Home}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              text={strings.home}
              focused={focused}
              icon={focused ? <Home_Dark /> : <Home_Light />}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name={StackNav.Search}
        component={StackRoute.Search}
        listeners={{tabPress: e => e.preventDefault()}}
        options={{
          tabBarIcon: ({focused}) => (
            <TouchableOpacity
              onPress={onPressAdd}
              style={localStyles.tabViewContainer}>
              {user_level == 'admin' && (
                <Add_Icon style={localStyles.add_icon} />
              )}
              <ProfilePicture
                SheetRef={ProfilePictureSheetRef}
                post={true}
                live={true}
                title={strings.choose}
                onPressCamera={onPressPost}
                onPressGallery={onPressLive}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.Shorts}
        component={TabRoute.Shorts}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              text={strings.shorts}
              focused={focused}
              icon={focused ? <Inbox_Dark /> : <Inbox_Light />}
            />
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
