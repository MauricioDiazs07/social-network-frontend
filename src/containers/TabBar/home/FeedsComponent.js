// Libraries import
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Share,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';

// Local import
import {styles} from '../../../themes';
import {
  isAndroid,
  moderateScale,
  screenFullHeight,
} from '../../../common/constants';
import images from '../../../assets/images';
import ZText from '../../../components/common/ZText';
import {StackNav} from '../../../navigation/NavigationKeys';
import {videoData} from '../../../api/constant';
import Comment from '../../../components/models/Comment';

export default function FeedsComponent(props) {
  const colors = useSelector(state => state.theme.theme);
  const commentSheetRef = useRef('');
  const isFocused = useIsFocused();
  const {navigation} = props;
  // const navigation = useNavigation();


  const [isMute, setIsMute] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [extraData, setExtraData] = useState(true);

  const musicToneAnimated = useRef(new Animated.Value(0)).current;
  const musicToneAnimated1 = useRef(new Animated.Value(0)).current;

  let musicTone = {
    transform: [
      {
        rotate: musicToneAnimated.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  let musicTone1 = {
    transform: [
      {
        translateX: musicToneAnimated1.interpolate({
          inputRange: [0, 1],
          outputRange: [8, -16],
        }),
      },
      {
        translateY: musicToneAnimated1.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 32],
        }),
      },
      {
        rotate: musicToneAnimated1.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
    opacity: musicToneAnimated1.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 1, 0],
    }),
  };

  useEffect(() => {
    if (isFocused) {
      Animated.loop(
        Animated.timing(musicToneAnimated, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ).start();
      Animated.loop(
        Animated.timing(musicToneAnimated1, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ).start();
    }
  }, [musicToneAnimated, musicToneAnimated1]);

  useEffect(() => {
    setExtraData(!extraData);
  }, [isMute, isLike, activeVideoIndex, isFocused]);

  const onPressReport = () => navigation.navigate(StackNav.Report);

  const onPressMusic = () => navigation.navigate(StackNav.Sound);

  const onPressProfile = (userName, userImage) =>
    navigation.navigate(StackNav.ProfileDetail, {
      userName: userName,
      userImage: userImage,
    });

  const videoError = error => console.log('videoError', error);

  const onPressMute = () => setIsMute(!isMute);

  const onPressLike = () => setIsLike(!isLike);

  const onPressBookmark = () => setIsBookmark(!isBookmark);

  const onPressShare = () => {
    Share.share({
      message:
        'Influex App | Entertainment, Social, Music, Video, Live, Chat...',
    });
  };

  const onPressComment = () => commentSheetRef.current?.show();

  const RenderVideoItem = ({icon, onPress, data, size, color}) => {
    return (
      <Pressable onPress={onPress} style={localStyles.renderIconContainer}>
        <Ionicons
          name={icon}
          size={size ? size : moderateScale(30)}
          color={color ? color : colors.white}
        />
        {!!data && (
          <ZText
            type="m14"
            style={styles.flex}
            color={colors.white}
            numberOfLines={1}>
            {data}
          </ZText>
        )}
      </Pressable>
    );
  };

  const renderFeedComponent = ({item, index}) => {
    return (
      <View
        style={{
          height: layoutHeight,
          backgroundColor: colors.darkBg,
        }}>
        <Pressable onPress={onPressMute}>
          {isFocused && (
            <Video
              source={{uri: item?.uri}}
              style={[
                localStyles.imageContainer,
                {backgroundColor: colors.darkBg},
              ]}
              poster={item?.poster}
              posterResizeMode="cover"
              resizeMode="cover"
              repeat={true}
              muted={isMute}
              onError={videoError}
              seekColor={colors.primary}
              paused={activeVideoIndex !== index}
            />
          )}

          <View style={localStyles.bottomContainer}>
            <View style={styles.flex}>
              <View style={styles.rowCenter}>
                <TouchableOpacity
                  onPress={() =>
                    onPressProfile(item?.channelName, item?.avatarUri)
                  }
                  style={styles.mb10}>
                  <Image
                    resizeMode="cover"
                    source={{uri: item?.avatarUri}}
                    style={localStyles.userImage}
                  />
                  <Ionicons
                    name="add-circle"
                    size={moderateScale(20)}
                    color={colors.primary}
                    style={localStyles.editIcon}
                  />
                </TouchableOpacity>
                <View style={[styles.mh20, styles.flex]}>
                  <ZText type="b18" numberOfLines={1} color={colors.white}>
                    {item?.channelName}
                  </ZText>
                  <ZText
                    type="m14"
                    style={styles.mt5}
                    numberOfLines={1}
                    color={colors.white}>
                    {item?.categoty}
                  </ZText>
                </View>
              </View>
              <ZText type="m14" color={colors.white} style={styles.mb20}>
                {item?.caption}
              </ZText>
              <TouchableOpacity
                onPress={onPressMusic}
                style={localStyles.musicContainer}>
                <Animated.Image
                  resizeMode="contain"
                  source={images.music}
                  style={[localStyles.musicImage, musicTone]}
                />
                <Animated.Image
                  resizeMode="contain"
                  source={images.musicTone}
                  style={[localStyles.musicIcon1, musicTone1]}
                />
                <ZText
                  type="m14"
                  style={styles.flex}
                  color={colors.white}
                  numberOfLines={1}>
                  {item?.musicName}
                </ZText>
              </TouchableOpacity>
            </View>
            <View style={localStyles.verticalContainer}>
              <RenderVideoItem
                icon="flag"
                size={moderateScale(24)}
                onPress={onPressReport}
              />
              <RenderVideoItem
                icon="heart"
                data={item?.likes}
                color={isLike ? colors.primary : colors.white}
                onPress={onPressLike}
              />
              <RenderVideoItem
                icon="chatbubble-ellipses"
                data={item?.comments}
                onPress={onPressComment}
              />
              <RenderVideoItem
                icon={isBookmark ? 'bookmark-outline' : 'bookmark'}
                data={item?.bookmark}
                onPress={onPressBookmark}
              />
              <RenderVideoItem
                icon="share"
                data={item?.share}
                onPress={onPressShare}
              />
            </View>
          </View>
          <View style={[localStyles.muteIcon, isMute && styles.p15]}>
            {isMute && (
              <Ionicons
                name="volume-mute"
                size={isMute ? moderateScale(36) : 0}
                color={colors.white}
              />
            )}
          </View>
        </Pressable>
      </View>
    );
  };

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;
  const keyExtractor = useCallback((item, index) => {
    return `item-${item?.id}`;
  }, []);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    if (!!viewableItems?.length) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  }).current;

  const onSetLayout = e => setLayoutHeight(e.nativeEvent.layout.height);

  return (
    <>
      <FlashList
        data={videoData}
        extraData={extraData}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        renderItem={renderFeedComponent}
        pagingEnabled={Platform.OS === 'ios'}
        viewabilityConfig={viewConfig}
        onViewableItemsChanged={viewableItemsChanged}
        onLayout={onSetLayout}
        snapToInterval={Platform.OS === 'android' ? layoutHeight : undefined}
        drawDistance={layoutHeight}
        decelerationRate={'fast'}
        disableIntervalMomentum={true}
        estimatedItemSize={11}
      />
      <Comment SheetRef={commentSheetRef} />
    </>
  );
}

const localStyles = StyleSheet.create({
  imageContainer: {
    height: '100%',
    width: '100%',
  },
  muteIcon: {
    position: 'absolute',
    top: screenFullHeight / 2 - moderateScale(30),
    ...styles.selfCenter,
    borderRadius: moderateScale(100),
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
  },
  topHeader: {
    position: 'absolute',
    top: isAndroid ? moderateScale(10) : moderateScale(50),
    left: moderateScale(20),
    right: 0,
    zIndex: 1,
    ...styles.pr10,
    ...styles.pt15,
  },
  headerCetegoryItemContainer: {
    ...styles.mh10,
    ...styles.pb15,
    borderBottomWidth: moderateScale(1),
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    ...styles.ph20,
    ...styles.flexRow,
    ...styles.itemsEnd,
  },
  userImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  musicImage: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    ...styles.mr25,
  },
  musicIcon1: {
    position: 'absolute',
    width: moderateScale(16),
    height: moderateScale(16),
    left: moderateScale(25),
    bottom: moderateScale(35),
  },
  musicContainer: {
    ...styles.rowCenter,
  },
  verticalContainer: {
    ...styles.ph5,
    ...styles.mb10,
    ...styles.pl10,
  },
  renderIconContainer: {
    ...styles.itemsCenter,
    ...styles.mt20,
  },
});
