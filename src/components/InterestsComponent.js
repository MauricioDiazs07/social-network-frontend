// Library import
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

// Local import
import React, {useState} from 'react';
import ZButton from './common/ZButton';
import {getHeight, moderateScale} from '../common/constants';
import {styles} from '../themes';

function InterestsComponent({
  tag
}) {
  const colors = useSelector(state => state.theme.theme);
  const [isFollow, setIsFollow] = useState(false);

  const onPressFollow = () => setIsFollow(!isFollow);

  return (
    <View style={localStyles.rootContainer}>
      <ZButton
        title={tag}
        color={isFollow ? colors.white : colors.primary}
        textType="b14"
        containerStyle={[
          localStyles.buttonContainer,
          {borderColor: colors.primary},
        ]}
        bgColor={isFollow ? colors.primary : colors.tranparent}
        onPress={onPressFollow}
      />
    </View>
  );
}
export default React.memo(InterestsComponent);

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.rowSpaceAround,
    ...styles.mt15,
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
    height: getHeight(45),
    borderRadius: moderateScale(17),
    borderWidth: moderateScale(1),
  },
});
