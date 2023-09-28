// Library Imports
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import {getHeight, moderateScale} from '../../common/constants';
import ZHeader from '../../components/common/ZHeader';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import {StackNav} from '../../navigation/NavigationKeys';
import ZInput from '../../components/common/ZInput';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import {validatePassword, validatePhoneNumber} from '../../utils/validators';
import ZButton from '../../components/common/ZButton';

const Register = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.bColor,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };
  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary;

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [passwordIcon, setPasswordIcon] = React.useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [passwordInputStyle, setPasswordInputStyle] =
  React.useState(BlurredStyle);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isCheck, setIsCheck] = React.useState(true);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [phoneIcon, setPhoneIcon] = React.useState(BlurredIconStyle);
  const [phoneInputStyle, setPhoneInputStyle] = React.useState(BlurredStyle);
  
  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      phoneNumber.length > 0 &&
      password.length > 0 &&
      !phoneError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [phoneNumber, password, phoneError, passwordError]);

  const onChangedPassword = val => {
    const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const onChangedPhoneNumber = val => {
    const {msg} = validatePhoneNumber(val.trim());
    setPhoneNumber(val.trim());
    setPhoneError(msg);
  };

  const onPressSignWithPassword = () => {
    navigation.navigate(StackNav.CameraRegister, {
      title: strings.fillYourProfile,
      phone: phoneNumber,
      password: password
    });
  };

  const onPressTermsAndConditions = () => 
                navigation.navigate(StackNav.TermsAndConditions);

  const onPressPasswordEyeIcon = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const PhoneIcon = () => {
    return <Ionicons name="call" size={moderateScale(20)} color={phoneIcon} />;
  };

  const onFocusPhone = () => {
    onFocusInput(setPhoneInputStyle);
    onFocusIcon(setPhoneIcon);
  };

  const onBlurPhone = () => {
    onBlurInput(setPhoneInputStyle);
    onBlurIcon(setPhoneIcon);
  };

  const PasswordIcon = () => (
    <Ionicons
      name="lock-closed"
      size={moderateScale(20)}
      color={passwordIcon}
    />
  );
  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = () => (
    <TouchableOpacity
      onPress={onPressPasswordEyeIcon}
      style={localStyles.eyeIconContainer}>
      <Ionicons
        name={isPasswordVisible ? 'eye-off' : 'eye'}
        size={moderateScale(20)}
        color={passwordIcon}
      />
    </TouchableOpacity>
  );

  const onPressSignIn = () => {
    navigation.navigate(StackNav.Login);
  };

  return (
    <ZSafeAreaView>
      <ZHeader />
      <ZKeyBoardAvoidWrapper>
        <View style={localStyles.mainContainer}>
          <ZText type={'b46'} align={'left'} style={styles.mv40}>
            {strings.createYourAccount}
          </ZText>

          {/* Phone input */}
          <ZInput
            placeHolder={strings.phoneNumber}
            keyBoardType={'phone-pad'}
            _value={phoneNumber}
            _errorText={phoneError}
            autoCapitalize={'none'}
            insideLeftIcon={() => <PhoneIcon />}
            _maxLength={10}
            toGetTextFieldValue={onChangedPhoneNumber}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              phoneInputStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusPhone}
            onBlur={onBlurPhone}
          />

          {/* Password input */}
          <ZInput
            placeHolder={strings.password}
            keyBoardType={'default'}
            _value={password}
            _errorText={passwordError}
            autoCapitalize={'none'}
            insideLeftIcon={() => <PasswordIcon />}
            toGetTextFieldValue={onChangedPassword}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              passwordInputStyle,
            ]}
            _isSecure={isPasswordVisible}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusPassword}
            onBlur={onBlurPassword}
            rightAccessory={() => <RightPasswordEyeIcon />}
          />

          <View style={localStyles.signUpContainer}>
            <TouchableOpacity
              onPress={() => setIsCheck(!isCheck)}
              >
              <Ionicons
                name={isCheck ? 'square-outline' : 'checkbox'}
                size={moderateScale(26)}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressTermsAndConditions}
              style={[localStyles.TermsAndConditions, styles.ml5]}>
              <ZText type={'s16'}>
                {strings.TermsAndConditionsAcc}
              </ZText>
              <ZText type={'s16'} style={styles.ml5} color={colors.primary}>
                {strings.TermsAndConditions}
              </ZText>
            </TouchableOpacity>
          </View>

          <ZButton
            title={strings.signUp}
            textType={'b18'}
            color={colors.white}
            containerStyle={[
              localStyles.signBtnContainer,
              (isSubmitDisabled || isCheck) && {opacity: 0.5},
            ]}
            onPress={onPressSignWithPassword}
            disabled={isSubmitDisabled || isCheck}
          />
          <View style={localStyles.divider}>
            
          </View>

          <TouchableOpacity
            onPress={onPressSignIn}
            style={localStyles.signUpContainer}>
            <View
              style={styles.center}
            >
              <ZText type={'r14'}>{strings.AlreadyHaveAccount}{"\t"}</ZText>
              <ZText type={'s14'} color={colors.primary}>
                {strings.signIn}
              </ZText>
            </View>
          </TouchableOpacity>
        </View>
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default Register;

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.ph20,
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  orContainer: {
    height: getHeight(1),
    width: '30%',
  },
  signBtnContainer: {
    ...styles.center,
    width: '100%',
    ...styles.mv20,
  },
  signUpContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  checkboxContainer: {
    ...styles.rowCenter,
    ...styles.mb20,
  },
  socialBtnContainer: {
    ...styles.rowCenter,
    ...styles.mv20,
  },
  socialBtn: {
    ...styles.center,
    height: getHeight(60),
    width: moderateScale(90),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    ...styles.mh10,
  },
  TermsAndConditions: {
    ...styles.rowCenter,
  }
});
