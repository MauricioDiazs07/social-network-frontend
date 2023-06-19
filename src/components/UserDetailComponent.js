// Library import
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import React, {useState} from 'react';
import ZText from './common/ZText';
import ZButton from './common/ZButton';
import {getHeight, moderateScale} from '../common/constants';
import {styles} from '../themes';
import {StackNav} from '../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';

function UserDetailComponent({
  userName,
  userImage,
  isFollowed,
  userDescription,
  isSuggested = false,
  disablePress = false,
}) {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const [isFollow, setIsFollow] = useState(isFollowed);

  const onPressFollow = () => setIsFollow(!isFollow);
  const onPressUser = () => {
    navigation.navigate(StackNav.ProfileDetail, {
      userName: userName,
      userImage: userImage,
    });
  };

  return (
    <View style={localStyles.rootContainer}>
      <TouchableOpacity
        onPress={onPressUser}
        style={localStyles.userItem}
        disabled={disablePress}>
        <Image
          source={{
            uri: userImage,
          }}
          style={localStyles.imageStyle}
        />
        <View style={localStyles.userDescription}>
          <ZText type="b18" numberOfLines={1}>
            {userName}
          </ZText>
          {!!userDescription && (
            <ZText
              type="m14"
              style={styles.mt5}
              color={colors.dark ? colors.grayScale3 : colors.grayScale7}
              numberOfLines={1}>
              {userDescription}
            </ZText>
          )}
        </View>
      </TouchableOpacity>

      <ZButton
        title={isFollow ? strings.follow : strings.following}
        color={isFollow ? colors.white : colors.primary}
        textType="b14"
        containerStyle={[
          localStyles.buttonContainer,
          {borderColor: colors.primary},
        ]}
        bgColor={isFollow ? colors.primary : colors.tranparent}
        onPress={onPressFollow}
      />
      {isSuggested && (
        <TouchableOpacity style={styles.ml5}>
          <Ionicons
            name="close-sharp"
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
export default React.memo(UserDetailComponent);

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt15,
    ...styles.flex,
  },
  userItem: {
    flex: 1,
    ...styles.rowCenter,
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    resizeMode: 'cover',
  },
  userDescription: {
    ...styles.mh10,
    ...styles.flex,
  },
  buttonContainer: {
    ...styles.ph15,
    height: getHeight(35),
    borderRadius: moderateScale(17),
    borderWidth: moderateScale(1),
  },
});
