// Library Imports
import {Button, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Snackbar } from '@react-native-material/core';

// Local Imports
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import {ACCESS_TOKEN, USER_LEVEL, getHeight, moderateScale} from '../../common/constants';
import ZHeader from '../../components/common/ZHeader';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import {StackNav} from '../../navigation/NavigationKeys';
import ZInput from '../../components/common/ZInput';
import {validateEmail, validatePassword} from '../../utils/validators';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import {getAsyncStorageData, setAsyncStorageData} from '../../utils/helpers';
import ZButton from '../../components/common/ZButton';
import {getAuthToken} from '../../api/auth/auth';
import { getAccessLevel } from '../../utils/_support_functions';

const Login = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.bColor,
  };
  const FocusedStyle = {
    backgroundColor: colors.primaryTransparent,
    borderColor: colors.primary,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [emailIcon, setEmailIcon] = React.useState(BlurredIconStyle);
  const [passwordIcon, setPasswordIcon] = React.useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [emailInputStyle, setEmailInputStyle] = React.useState(BlurredStyle);
  const [passwordInputStyle, setPasswordInputStyle] =
    React.useState(BlurredStyle);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(true);
  const [snackVisible, setSnackVisible] = React.useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      !emailError &&
      !passwordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, password, emailError, passwordError]);

  const onChangedEmail = val => {
    const {msg} = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
  };
  const onChangedPassword = val => {
    const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const EmailIcon = () => {
    return <Ionicons name="mail" size={moderateScale(20)} color={emailIcon} />;
  };

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
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

  const onPressSignWithPassword = async () => {

    await getAuthToken(email, password)
    .then(async (token) => {
      if ("token" in token) {
        const user_lvl = getAccessLevel(token['role_id']);
        await setAsyncStorageData(ACCESS_TOKEN, token);
        await setAsyncStorageData(USER_LEVEL, user_lvl);
        await setAsyncStorageData("PROFILE_ID", token['profile_id']);
        
        navigation.reset({
          index: 0,
          routes: [{name: StackNav.TabBar}],
        });
  
      } else {
        setSnackVisible(true);
        return;
      }
    });
    
  };

  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);
  const onPressSignUp = () => navigation.navigate(StackNav.Register);
  const onPressForgotPassword = () =>
    navigation.navigate(StackNav.ForgotPassword);

  const closeSnackBar = () => setSnackVisible(false);

  return (
    <ZSafeAreaView style={localStyles.root}>
      <ZHeader />
      <ZKeyBoardAvoidWrapper>
        <View style={localStyles.mainContainer}>
          <ZText type={'b36'} align={'left'} style={styles.mv40}>
            {strings.loginYourAccount}
          </ZText>

          {snackVisible && (<View style={{ flex: 1 }}>
            <Snackbar
              message={strings.WrongCredentials}
              action={<Button 
                        variant="text"
                        title={strings.close}
                        color={colors.primary}
                        compact onPress={closeSnackBar}/>}
            />
          </View>)}

          <ZInput
            placeHolder={strings.email}
            keyBoardType={'email-address'}
            _value={email}
            _errorText={emailError}
            autoCapitalize={'none'}
            insideLeftIcon={() => <EmailIcon />}
            toGetTextFieldValue={onChangedEmail}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              emailInputStyle,
            ]}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusEmail}
            onBlur={onBlurEmail}
          />

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

          <ZButton
            title={strings.signIn}
            textType={'b18'}
            color={colors.white}
            containerStyle={[
              localStyles.signBtnContainer,
              isSubmitDisabled && {opacity: 0.5},
            ]}
            onPress={onPressSignWithPassword}
            disabled={isSubmitDisabled}
          />
          <TouchableOpacity
            onPress={onPressForgotPassword}
            style={localStyles.forgotPasswordContainer}>
            <ZText
              type={'s16'}
              align={'center'}
              color={colors.primary}
              style={styles.mh10}>
              {strings.forgotPassword}
            </ZText>
          </TouchableOpacity>

          <View style={localStyles.divider}>
          </View>

          <TouchableOpacity
            onPress={onPressSignUp}
            style={localStyles.signUpContainer}>
            <View
              style={styles.center}
            >
              <ZText type={'r14'}>{strings.dontHaveAccount}{"\t"}</ZText>
              <ZText type={'s14'} color={colors.primary}>
                {strings.signUp}
              </ZText>
            </View>
          </TouchableOpacity>
        </View>
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default Login;

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.ph20,
  },
  divider: {
    ...styles.rowCenter,
    ...styles.mv30,
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
    ...styles.mv10,
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
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
    ...styles.mh10,
  },
});
