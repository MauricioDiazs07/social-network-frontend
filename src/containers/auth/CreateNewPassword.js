// Librairies import
import {StyleSheet, View, TouchableOpacity, Button} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {Snackbar} from '@react-native-material/core';

// Local import
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import {NewPassWordDark, NewPassWordLight} from '../../assets/svgs';
import ZText from '../../components/common/ZText';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import {getHeight, moderateScale} from '../../common/constants';
import ZInput from '../../components/common/ZInput';
import {
  validateConfirmPassword,
  validatePassword,
} from '../../utils/validators';
import {StackNav} from '../../navigation/NavigationKeys';
import SuccessModal from '../../components/models/SuccessModal';
import ZButton from '../../components/common/ZButton';
import {
  URL_API,
  RESET_PASSWORD
} from '../../utils/api_constants';

const CreateNewPassword = (props) => {
  const {navigation} = props;
  const colors = useSelector(state => state.theme.theme);
  const idUser = props.route.params.userId;

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

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(true);
  const [passwordInputStyle, setPasswordInputStyle] = useState({});
  const [confirmPasswordInputStyle, setConfirmPasswordInputStyle] = useState(
    {},
  );
  const [passwordIcon, setPasswordIcon] = useState(BlurredIconStyle);
  const [confirmPasswordIcon, setConfirmPasswordIcon] =
    useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [snackVisible, setSnackVisible] = React.useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      password.length > 0 &&
      confirmPassword.length > 0 &&
      !passwordError &&
      !confirmPasswordError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [password, confirmPassword, passwordError, confirmPasswordError]);

  const PasswordIcon = ({iconColor}) => (
    <Ionicons name="lock-closed" size={moderateScale(20)} color={iconColor} />
  );

  const resetPassword = async (id, newPassword) => {
    const userData = {
      profileId: id,
      password: newPassword,
    };
  
    try {
      const response = await fetch(URL_API + RESET_PASSWORD, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        setModalVisible(true);        
        navigation.navigate(StackNav.Login, {
          newPassword: password
        });
      } else {
        setModalVisible(false);
        setSnackVisible(true);
      }
    } catch (error) {
      console.error('Error Password');
    }
  };
  
  const closeSnackBar = () => setSnackVisible(false);

  const onFocusPassword = () => {
    onFocusInput(setPasswordInputStyle);
    onFocusIcon(setPasswordIcon);
  };
  const onBlurPassword = () => {
    onBlurInput(setPasswordInputStyle);
    onBlurIcon(setPasswordIcon);
  };
  const RightPasswordEyeIcon = ({visible, onPress, iconColor}) => (
    <TouchableOpacity onPress={onPress} style={localStyles.eyeIconContainer}>
      <Ionicons
        name={visible ? 'eye-off' : 'eye'}
        size={moderateScale(20)}
        color={iconColor}
      />
    </TouchableOpacity>
  );

  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);
  const onPressConfirmPasswordEyeIcon = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  const onChangedPassword = val => {
    const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const onChangedConfirmPassword = val => {
    const {msg} = validateConfirmPassword(val.trim(), password);
    setConfirmPassword(val.trim());
    setConfirmPasswordError(msg);
  };

  const onFocusConfirmPassword = () => {
    onFocusInput(setConfirmPasswordInputStyle);
    onFocusIcon(setConfirmPasswordIcon);
  };
  const onBlurConfirmPassword = () => {
    onBlurInput(setConfirmPasswordInputStyle);
    onBlurIcon(setConfirmPasswordIcon);
  };

  const onPressContinue = () => {
    resetPassword(idUser, password);
  };
  
  const onPressModalClose = () => setModalVisible(false);
  
  return (
    <ZSafeAreaView>
      <ZHeader title={strings.createNewPassword} />
      <ZKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          <View style={styles.mt40}>
            {!colors.dark ? (
              <NewPassWordDark
                width={moderateScale(360)}
                height={getHeight(257)}
              />
            ) : (
              <NewPassWordLight
                width={moderateScale(360)}
                height={getHeight(257)}
              />
            )}
          </View>
          <ZText type={'m18'} style={styles.mt30}>
            {strings.createYourNewPassword}
          </ZText>
          <ZInput
            placeHolder={strings.password}
            keyBoardType={'default'}
            _value={password}
            _errorText={passwordError}
            autoCapitalize={'none'}
            insideLeftIcon={() => <PasswordIcon iconColor={passwordIcon} />}
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
            rightAccessory={() => (
              <RightPasswordEyeIcon
                visible={isPasswordVisible}
                onPress={onPressPasswordEyeIcon}
                iconColor={passwordIcon}
              />
            )}
          />
          <ZInput
            placeHolder={strings.confirmNewPassword}
            keyBoardType={'default'}
            _value={confirmPassword}
            _errorText={confirmPasswordError}
            autoCapitalize={'none'}
            insideLeftIcon={() => (
              <PasswordIcon iconColor={confirmPasswordIcon} />
            )}
            toGetTextFieldValue={onChangedConfirmPassword}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              confirmPasswordInputStyle,
            ]}
            _isSecure={isConfirmPasswordVisible}
            inputBoxStyle={[localStyles.inputBoxStyle]}
            _onFocus={onFocusConfirmPassword}
            onBlur={onBlurConfirmPassword}
            rightAccessory={() => (
              <RightPasswordEyeIcon
                visible={isConfirmPasswordVisible}
                onPress={onPressConfirmPasswordEyeIcon}
                iconColor={confirmPasswordIcon}
              />
            )}
          />
        </View>
      </ZKeyBoardAvoidWrapper>
      <ZButton
        textType={'b18'}
        color={colors.white}
        title={strings.continue}
        onPress={onPressContinue}
        containerStyle={[
                          styles.m20,
                          isSubmitDisabled && {opacity: 0.5}
                        ]}
        disabled={isSubmitDisabled}
      />
      <SuccessModal
        visible={modalVisible}
        onPressModalClose={onPressModalClose}
      />
      {snackVisible && (
        <View style={{flex: 1}}>
          <Snackbar
            message={strings.WrongCredentials}
            action={
              <Button
                variant="text"
                title={strings.close}
                color={colors.primary}
                compact
                onPress={closeSnackBar}
              />
            }
          />
        </View>
      )}
    </ZSafeAreaView>
  );
};

export default CreateNewPassword;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
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
});