// libraries import
import React, {createRef, useState, useEffect} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountryPicker, {
  FlagButton,
  DARK_THEME,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
import {Snackbar, Button} from '@react-native-material/core';
import { getProfileData } from '../../api/feed/interaction';
// local import
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import ZButton from '../../components/common/ZButton';
import ProfilePicture from '../../components/models/ProfilePicture';
import {validateNotNecessaryEmail, validatePhoneNumber} from '../../utils/validators';
import {ACCESS_TOKEN, USER_LEVEL, moderateScale, getHeight} from '../../common/constants';
import {isNotEmptyString} from '../../utils/_support_functions';
import {styles} from '../../themes';
import images from '../../assets/images';
import strings from '../../i18n/strings';
import {signUp, signUp2, getAuthToken, getAuthData} from '../../api/auth/auth';
import {StackNav} from '../../navigation/NavigationKeys';
import { getAccessLevel } from '../../utils/_support_functions';
import {setAsyncStorageData} from '../../utils/helpers';

const FinishProfile = props => {
  const {navigation} = props;
  const userCred = props.route.params.userCred;
  const userInfo = props.route.params.userInfo;

  const colors = useSelector(state => state.theme.theme);
  const ProfilePictureSheetRef = createRef();

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

  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState(userCred['phone']);

  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [phoneNoInputStyle, setPhoneNoInputStyle] = useState(BlurredStyle);
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [chevronDown, setChevronDown] = useState(BlurredIconStyle);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [contactError, setContactError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectImage, setSelectImage] = useState('');
  const [callingCodeLib, setCallingCodeLib] = useState(+52);
  const [countryCodeLib, setCountryCodeLib] = useState('MX');
  const [visiblePiker, setVisiblePiker] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      isNotEmptyString(phoneNo) &&
      !contactError &&
      !emailError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [phoneNo, contactError, emailError]);

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const onFocusPhoneNo = () => {
    onFocusInput(setPhoneNoInputStyle);
    onFocusIcon(setChevronDown);
  };
  const onBlurPhoneNo = () => {
    onBlurInput(setPhoneNoInputStyle);
    onBlurIcon(setChevronDown);
  };

  const onChangedEmail = text => {
    const {msg} = validateNotNecessaryEmail(text.trim(), phoneNo);
    setEmail(text);
    setEmailError(msg);
  };
  const onChangedPhoneNo = text => {
    const {msg} = validatePhoneNumber(text.trim());
    setPhoneNo(text);
    setContactError(msg);
  };

  useEffect(() => {
    ProfilePictureSheetRef?.current?.hide();
  }, [selectImage]);

  const onSelectCountry = country => {
    setCountryCodeLib(country.cca2);
    setCallingCodeLib('+' + country.callingCode[0]);
    closeCountryPicker();
  };

  const openCountryPicker = () => setVisiblePiker(true);
  const closeCountryPicker = () => setVisiblePiker(false);

  const onPressCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setSelectImage(image);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    }).then(images => {
      setSelectImage(images);
    });
  };

  const EmailIcon = () => (
    <Ionicons name="mail" size={moderateScale(20)} color={emailIcon} />
  );

  const countryIcon = () => {
    return (
      <View style={styles.rowSpaceBetween}>
        <FlagButton
          value={callingCodeLib}
          onOpen={openCountryPicker}
          withEmoji={true}
          countryCode={countryCodeLib}
          withCallingCodeButton={true}
          containerButtonStyle={localStyles.countryPickerButton}
        />
        <Ionicons
          name="chevron-down-outline"
          size={moderateScale(20)}
          color={chevronDown}
        />
      </View>
    );
  };

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();

  const onPressContinue = async () => {
    setIsLoading(true);
    /* FINAL UPDATE ON SIGNUP */
    const userCred_ = {
      email: email,
      password: userCred['password'],
    };
    
    const phoneNo_ = phoneNo.toString() != '' ?
                callingCodeLib.toString() + phoneNo.toString() : '';

    const usser_ = {
      ...userCred_,
      profile_photo: selectImage,
      phone: phoneNo_,
      ...userInfo
    };

    signUp2(usser_)
      .then(resp => {
        if (resp) {
          getAuthToken(
            userCred_['email'],
            userCred_['password']
          )
            .then(async (token) => {
              if ("token" in token) {
                const user_lvl = getAccessLevel(token['role_id']);
                await setAsyncStorageData(ACCESS_TOKEN, token);
                await setAsyncStorageData(USER_LEVEL, user_lvl);
                await setAsyncStorageData("PROFILE_ID", token['profile_id']);
                setIsLoading(false);

                getProfileData(token['profile_id'])
                .then(resp => {
                  setAsyncStorageData("PROFILE_PHOTO", resp['profile_photo']);
                  setAsyncStorageData("USERNAME", resp['name']);
                  setAsyncStorageData("GENDER", resp['gender']);
                  setAsyncStorageData("DESCRIPTION", resp['description']);
                });

                navigation.navigate(StackNav.FollowSomeone);
            }})
            .catch(err => {
              setIsLoading(false);
              setIsSnackbarVisible(true);
              console.log(err);
            });
        } else {
          setIsLoading(false);
          setIsSnackbarVisible(true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err)
      });
  };

  const redirectLogin = () => {
    navigation.navigate(StackNav.Login);
  };

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.finishProfile} />
      <ZKeyBoardAvoidWrapper containerStyle={styles.p20}>
        {/* user picture */}
        <TouchableOpacity
          onPress={onPressProfilePic}
          style={[styles.selfCenter, styles.mb20]}>
          {!!selectImage?.path ? (
            <Image
              source={{uri: selectImage?.path}}
              style={localStyles.userImage}
            />
          ) : (
            <Image
              source={colors.dark ? images.userDark : images.userLight}
              style={localStyles.userImage}
            />
          )}
          <MaterialIcon
            name="pencil-box"
            size={moderateScale(30)}
            color={colors.primary}
            style={localStyles.editIcon}
          />
        </TouchableOpacity>

        <ZInput
          placeHolder={strings.phoneNumber}
          keyBoardType={'number-pad'}
          _value={phoneNo}
          _errorText={contactError}
          _maxLength={10}
          toGetTextFieldValue={onChangedPhoneNo}
          insideLeftIcon={countryIcon}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            phoneNoInputStyle,
          ]}
          _onFocus={onFocusPhoneNo}
          onBlur={onBlurPhoneNo}
        />

        <ZInput
          placeHolder={strings.email}
          keyBoardType={'email-address'}
          _value={email}
          _errorText={emailError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedEmail}
          rightAccessory={() => <EmailIcon />}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            emailInputStyle,
          ]}
          _onFocus={onFocusEmail}
          onBlur={onBlurEmail}
        />
      </ZKeyBoardAvoidWrapper>

      <View 
        style={[{flex: 1}, 
          !isSnackbarVisible && {display: 'none'}]}
      >
        <Snackbar
          message={strings.userExists}
          action={
            <Button
              variant="text"
              color={colors.primary}
              title={strings.loginRedirect}
              onPress={redirectLogin}
              compact
            />
          }
          style={localStyles.snackbar}
        />
      </View>

      <View style={localStyles.btnContainer}>
        <ZButton
          title={strings.continue}
          textType={'b18'}
          color={colors.white}
          containerStyle={[
            localStyles.skipBtnContainer,
            isSubmitDisabled && {opacity: 0.5},
          ]}
          onPress={onPressContinue}
          disabled={isSubmitDisabled}
        />
      </View>

      <ProfilePicture
        onPressCamera={onPressCamera}
        onPressGallery={onPressGallery}
        SheetRef={ProfilePictureSheetRef}
      />

      <CountryPicker
        countryCode={'MX'}
        withFilter={true}
        visible={visiblePiker}
        withFlag={true}
        withFlagButton={true}
        onSelect={country => onSelectCountry(country)}
        withCallingCode={true}
        withAlphaFilter={true}
        withCountryNameButton={true}
        onClose={closeCountryPicker}
        renderFlagButton={() => {
          return null;
        }}
        theme={colors.dark ? DARK_THEME : DEFAULT_THEME}
      />

      <View
        style={[localStyles.loadingScreen, !isLoading && {display: 'none'}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </ZSafeAreaView>
  );
};

export default FinishProfile;

const localStyles = StyleSheet.create({
  countryPickerButton: {
    ...styles.alignStart,
    ...styles.justifyCenter,
  },
  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
  btnContainer: {
    ...styles.p20,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '90%',
  },
  snackbar: {
    position: 'absolute',
    start: 16,
    end: 6,
    bottom: 16,
  },
  loadingScreen: {
    ...styles.center,
    backgroundColor: '#141C22AA',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
