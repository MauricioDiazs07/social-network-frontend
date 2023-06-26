// Library Imports
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import { Image } from 'react-native';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import {getHeight, moderateScale} from '../../common/constants';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import images from '../../assets/images';
import {StackNav} from '../../navigation/NavigationKeys';
import ZButton from '../../components/common/ZButton';

export default Connect = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const onPressSignWithPassword = () => navigation.navigate(StackNav.Login);
  const onPressSignUp = () => navigation.navigate(StackNav.Register);

  return (
    <ZSafeAreaView style={localStyles.root}>
      <Image 
        source={colors.dark ? images.logoBicolor : images.logoLight}
        style={colors.dark ? localStyles.logoImageDark: localStyles.logoImageLight}
      />
      <ZText type={'b26'} style={styles.mv20}>
        {strings.letsYouIn}
      </ZText>

      <View style={localStyles.divider}>
        
      </View>

      <ZButton
        title={strings.signWithPassword}
        textType={'b18'}
        color={colors.white}
        containerStyle={[localStyles.signBtnContainer]}
        onPress={onPressSignWithPassword}
      />

      <TouchableOpacity
        onPress={onPressSignUp}
        style={localStyles.signUpContainer}>
        <ZText type={'r14'}>{strings.dontHaveAccount}{"\t"}</ZText>

        <ZText type={'s14'} color={colors.primary}>
          {strings.signUp}
        </ZText>
      </TouchableOpacity>
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.center,
    ...styles.flex,
  },
  btnContainer: {
    ...styles.mt20,
    ...styles.center,
    ...styles.ph20,
    width: '90%',
    height: getHeight(55),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
  orContainer: {
    height: getHeight(1),
    width: '40%',
  },
  signBtnContainer: {
    ...styles.center,
    ...styles.ph20,
    width: '90%',
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mv30,
  },
  logoImageDark: {
    width: moderateScale(220),
    height: getHeight(80)
  },
  logoImageLight: {
    width: moderateScale(220),
    height: getHeight(80)
  }
});
