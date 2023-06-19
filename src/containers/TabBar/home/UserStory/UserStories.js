import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import {moderateScale} from '../../../../common/constants';
import {styles} from '../../../../themes';
import ZText from '../../../../components/common/ZText';
import {StackNav} from '../../../../navigation/NavigationKeys';

const UserStories = ({stories, ...props}) => {
  const navigation = useNavigation();

  const onPressStory = (name, userImage, role) =>
    navigation.navigate(StackNav.StoryView, {
      name: name,
      userImage: userImage
    });

  const renderItem = ({item}) => (
    <Pressable
      style={localStyles.itemContainer}
      onPress={() => onPressStory(item.name, item.imgUrl)}>
      <LinearGradient
        colors={['#A020F0', '#B042FF']}
        style={localStyles.itemInnerContainer}>
        <FastImage
          source={{uri: item.imgUrl}}
          style={[localStyles.itemImage]}
        />
      </LinearGradient>
      <ZText type={'s14'} style={localStyles.itemUsername}>
        {item.name}
      </ZText>
    </Pressable>
  );

  return (
    <FlashList
      data={stories}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={localStyles.mainContainer}
      {...props}
    />
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.pv10,
    ...styles.ph20,
  },
  itemContainer: {
    alignItems: 'center',
    ...styles.mr20,
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
  itemInnerContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(40),
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default UserStories;
