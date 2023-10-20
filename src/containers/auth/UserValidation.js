import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import {useSelector} from 'react-redux';
import {
  ForgotPassword_Dark,
  ForgotPassword_Light
} from '../../assets/svgs';
import {getHeight, moderateScale} from '../../common/constants';
import {StackNav} from '../../navigation/NavigationKeys';
import ZButton from '../../components/common/ZButton';
import { validateEmail } from '../../utils/validators';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';

const UserValidation = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const FocusedStyle = {
    backgroundColor: colors.primaryTransparent,
    borderColor: colors.primary,
  };
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.bColor,
  };
  const FocusedIconStyle = colors.primary;
  const BlurredIconStyle = colors.grayScale5;
  
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [emailInputStyle, setEmailInputStyle] = React.useState(BlurredStyle);
  const [emailIcon, setEmailIcon] = React.useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      email.length > 0 &&
      !emailError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [email, emailError]);
  
  const onChangedEmail = val => {
    const {msg} = validateEmail(val.trim());
    setEmail(val.trim());
    setEmailError(msg);
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

  const onPressContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabBar}],
    });
  };
  const onPressPinContinue = () =>
    navigation.navigate(StackNav.ForgotPasswordOtp,
                          {email2Send: email}
                        );

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.forgotPassword} />
        <ZKeyBoardAvoidWrapper>
          <View style={localStyles.emailContainer}>
            <View style={[styles.mv20, styles.selfCenter]}>
              {colors.dark ? (
                <ForgotPassword_Dark
                  width={moderateScale(305)}
                  height={getHeight(200)}
                />
              ) : (
                <ForgotPassword_Light
                  width={moderateScale(305)}
                  height={getHeight(200)}
                />
              )}
            </View>

            <View style={localStyles.inputContainer}>
              <ZText type={'r18'}>{strings.forgotPasswordDesc}</ZText>

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
            </View>
            
            <ZButton
              textType={'b18'}
              color={colors.white}
              title={strings.continue}
              onPress={onPressPinContinue}
              containerStyle={[
                localStyles.continueBtn,
                isSubmitDisabled && {opacity: 0.5},
              ]}
              disabled={isSubmitDisabled}
            />
          </View>
        </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default UserValidation;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.selfCenter,
    ...styles.flex,
  },
  mainContainer: {
    ...styles.p15,
    ...styles.flexRow,
    ...styles.mt20,
    ...styles.itemsCenter,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(30),
  },
  continueBtn: {
    position: 'relative',
    bottom: moderateScale(0),
    width: '100%',
    ...styles.selfCenter,
  },
  emailContainer: {
    ...styles.ph20
  },
  inputContainer: {
    ...styles.mt20,
    ...styles.mb20,
  }
});
