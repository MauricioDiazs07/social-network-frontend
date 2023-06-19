// Library import
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import typography from '../../../themes/typography';
import ZText from '../../../components/common/ZText';
import ZButton from '../../../components/common/ZButton';
import {useNavigation} from '@react-navigation/native';
import {TabNav} from '../../../navigation/NavigationKeys';

export default function PostDetail() {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState({
    allowComments: false,
    allowDuet: false,
    allowStitch: false,
  });

  const postUploadData = [
    {
      title: strings.tagPeople,
      icon: 'person-outline',
    },
    {
      title: strings.location,
      icon: 'location-outline',
    },
    {
      title: strings.visibleEveryone,
      icon: 'lock-closed-outline',
    },
    {
      title: strings.allowComments,
      icon: 'chatbubble-ellipses-outline',
      rightIcon: true,
      value: isEnabled.allowComments,
      toggleSwitch: () =>
        setIsEnabled({
          ...isEnabled,
          allowComments: isEnabled.allowComments ? false : true,
        }),
    },
    {
      title: strings.allowDuet,
      icon: 'people-outline',
      rightIcon: true,
      value: isEnabled.allowDuet,
      toggleSwitch: () =>
        setIsEnabled({
          ...isEnabled,
          allowDuet: isEnabled.allowDuet ? false : true,
        }),
    },
    {
      title: strings.allowStitch,
      icon: 'newspaper-outline',
      rightIcon: true,
      value: isEnabled.allowStitch,
      toggleSwitch: () =>
        setIsEnabled({
          ...isEnabled,
          allowStitch: isEnabled.allowStitch ? false : true,
        }),
    },
    {
      title: strings.moreOption,
      icon: 'ellipsis-horizontal-circle',
    },
  ];

  const RenderData = ({item}) => {
    return (
      <TouchableOpacity style={localStyles.settingsContainer}>
        <View style={styles.rowCenter}>
          <Ionicons
            name={item.icon}
            size={moderateScale(28)}
            color={colors.textColor}
            style={styles.mr10}
          />
          <ZText type="s18">{item.title}</ZText>
        </View>
        <View style={localStyles.rightContainer}>
          {!!item?.rightIcon ? (
            <Switch
              trackColor={{
                false: colors.grayScale3,
                true: colors.primary,
              }}
              thumbColor={colors.white}
              onValueChange={item?.toggleSwitch}
              value={item?.value}
            />
          ) : (
            <Ionicons
              name="chevron-forward-outline"
              size={moderateScale(20)}
              color={colors.dark ? colors.white : colors.grayScale9}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const RenderShare = ({icon}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.shareIcon,
          {
            backgroundColor: colors.primaryTransparent,
          },
        ]}>
        <Ionicons
          name={icon}
          size={moderateScale(26)}
          color={colors.primary}
          style={localStyles.instagramIcon}
        />
      </TouchableOpacity>
    );
  };

  const RenderCategory = ({icon, title}) => {
    return (
      <TouchableOpacity
        style={[
          localStyles.hashtagContainer,
          {
            borderColor: colors.primary,
          },
        ]}>
        <Feather
          name={icon}
          size={moderateScale(20)}
          style={styles.mr5}
          color={colors.primary}
        />
        <ZText type={'b14'} color={colors.primary}>
          {title}
        </ZText>
      </TouchableOpacity>
    );
  };

  const onPressHome = () => navigation.navigate(TabNav.Home);

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.post} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mh20}>
        <View style={localStyles.container}>
          <TextInput
            placeholder={strings.writeHere}
            multiline={true}
            placeholderTextColor={colors.placeHolderColor}
            style={[
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.bColor,
                color: colors.textColor,
              },
              localStyles.inputContainerStyle,
            ]}
            inputBoxStyle={localStyles.inputBoxStyle}
          />
          <TouchableOpacity>
            <Image
              source={{uri: 'https://picsum.photos/200/300'}}
              resizeMode="cover"
              style={localStyles.imageContainer}
            />
            <ZText
              type={'b16'}
              color={colors.white}
              align={'center'}
              style={localStyles.coverPhotoStyle}>
              {strings.selectCover}
            </ZText>
          </TouchableOpacity>
        </View>
        <View
          style={[
            localStyles.categoryContainer,
            {
              borderBottomColor: colors.bColor,
            },
          ]}>
          <RenderCategory icon={'hash'} title={strings.hashtag} />
          <RenderCategory icon={'at-sign'} title={strings.mention} />
          <RenderCategory icon={'video'} title={strings.videos} />
        </View>
        <FlatList
          data={postUploadData}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <RenderData item={item} />}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
        <ZText type={'b16'} color={colors.textColor} style={styles.mt10}>
          {strings.shareDesc}
        </ZText>
        <View style={localStyles.shareContainer}>
          <RenderShare icon={'logo-instagram'} />
          <RenderShare icon={'logo-facebook'} />
          <RenderShare icon={'logo-twitter'} />
          <RenderShare icon={'logo-whatsapp'} />
        </View>
      </ScrollView>
      <View style={localStyles.btnContainer}>
        <ZButton
          title={strings.draft}
          textType={'b18'}
          color={colors.dark ? colors.white : colors.primary}
          containerStyle={localStyles.skipBtnContainer}
          bgColor={colors.dark3}
          onPress={onPressHome}
        />
        <ZButton
          title={strings.post}
          textType={'b18'}
          color={colors.white}
          containerStyle={localStyles.skipBtnContainer}
          onPress={onPressHome}
        />
      </View>
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,

    ...styles.mt20,
  },
  inputContainerStyle: {
    ...styles.flex,
    height: getHeight(132),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    ...styles.p20,
    ...typography.fontSizes.f16,
    ...typography.fontWeights.Regular,
    ...styles.mr15,
  },
  imageContainer: {
    width: moderateScale(110),
    height: getHeight(132),
    borderRadius: moderateScale(20),
  },
  coverPhotoStyle: {
    position: 'absolute',
    bottom: moderateScale(10),
    ...styles.selfCenter,
  },
  categoryContainer: {
    ...styles.flexRow,

    ...styles.mb20,
    ...styles.pv20,
    borderBottomWidth: moderateScale(1),
  },
  hashtagContainer: {
    ...styles.mr10,
    ...styles.rowCenter,
    ...styles.pv10,
    ...styles.ph20,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
  },
  settingsContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mb15,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.rowEnd,
  },
  shareIcon: {
    ...styles.mb20,
    ...styles.mr20,
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    ...styles.center,
  },
  shareContainer: {
    ...styles.mv20,
    ...styles.flexRow,
  },
  btnContainer: {
    ...styles.pv20,
    ...styles.mh20,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
  },
});
