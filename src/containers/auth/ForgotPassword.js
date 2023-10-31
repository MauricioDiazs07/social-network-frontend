import { StyleSheet, View, Button } from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Snackbar} from '@react-native-material/core';
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
import { validatePhoneNumber } from '../../utils/validators';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import { getUserDataByPhone } from '../../api/user/user';

const ForgotPassword = ({navigation}) => {
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
  
  const [phone, setPhone] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [phoneInputStyle, setPhoneInputStyle] = React.useState(BlurredStyle);
  const [phoneIcon, setPhoneIcon] = React.useState(BlurredIconStyle);
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [snackVisible, setSnackVisible] = React.useState(false);
  const [isUserInvalid, setIsUserInvalid] = React.useState(false);
  const [userId, setUserId] = React.useState('');

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      phone.length > 0 &&
      !phoneError
    ) {
      getUserByPhone(phone);        
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [phone, phoneError]);
  
  const getUserByPhone = (phoneNo) => {
    try {
      getUserDataByPhone(phoneNo).then(resp => { 

        if(resp) {
          const user_id =  resp['profileId']
          setUserId(user_id)
          return user_id;
        } else {
          setIsUserInvalid(true);      
          setSnackVisible(true); 
          setIsSubmitDisabled(true);   
        }
      })
    } catch(error) {
      console.error('Error user:', error);
    }
   
  };
  
  const onChangedPhone = val => {
    const {msg} = validatePhoneNumber(val.trim());
    setPhone(val.trim());
    setPhoneError(msg);
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

  const onPressPinContinue = () => {
    if(!isUserInvalid) {      
      navigation.navigate(StackNav.ForgotPasswordOtp, {
        phone2Send: phone,
        userId: userId
      });
    }
  }

  const closeSnackBar = () => setSnackVisible(false);

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.forgotPassword} />
        <ZKeyBoardAvoidWrapper>
          <View style={localStyles.phoneContainer}>
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
                placeHolder={strings.phoneNumber}
                keyBoardType={'numeric'}
                _value={phone}
                _errorText={phoneError}
                autoCapitalize={'none'}
                insideLeftIcon={() => <PhoneIcon />}
                toGetTextFieldValue={onChangedPhone}
                inputContainerStyle={[
                  {backgroundColor: colors.inputBg},
                  localStyles.inputContainer,
                  phoneInputStyle,
                ]}
                inputBoxStyle={[localStyles.inputBoxStyle]}
                _onFocus={onFocusPhone}
                onBlur={onBlurPhone}
              />
            </View>
            {snackVisible && (
              <View style={{flex: 1}}>
                <Snackbar
                  message={strings.WrongPhone}
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

export default ForgotPassword;

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
  phoneContainer: {
    ...styles.ph20
  },
  inputContainer: {
    ...styles.mt20,
    ...styles.mb20,
  }
});