// Library import
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {createRef, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import CountryPicker, {
  FlagButton,
  DARK_THEME,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';

// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import images from '../../../assets/images';
import {styles} from '../../../themes';
import { getHeight, moderateScale} from '../../../common/constants';
import ZInput from '../../../components/common/ZInput';
import ZKeyBoardAvoidWrapper from '../../../components/common/ZKeyBoardAvoidWrapper';
import {StackNav} from '../../../navigation/NavigationKeys';
import ProfilePicture from '../../../components/models/ProfilePicture';
import ZButton from '../../../components/common/ZButton';
import {validateNotEmptyContact} from '../../../utils/validators';
import ZText from '../../../components/common/ZText';
import {userProfile} from '../../../api/constant';
import { validateNotNecessatyEmail } from '../../../utils/validators';

const UserProfile = props => {
  const {navigation} = props;
  const headerTitle = '';

  // TODO: fetch from API
  const user = userProfile;

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

  const [email, setEmail] = useState(user.email);
  const [phoneNo, setPhoneNo] = useState(user.phoneNo);
  const [emailError, setEmailError] = React.useState('');

  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [phoneNoInputStyle, setPhoneNoInputStyle] = useState(BlurredStyle);
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [chevronDown, setChevronDown] = useState(BlurredIconStyle);

  const [selectImage, setSelectImage] = useState('');
  const [callingCodeLib, setCallingCodeLib] = useState(+91);
  const [countryCodeLib, setCountryCodeLib] = useState('MX');
  const [visiblePiker, setVisiblePiker] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [contactError, setContactError] = useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      (user.email !== email ||
      user.phoneNo !== phoneNo) &&
      !emailError &&
      !contactError ||
      !!selectImage.path
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [
    user.email,
    email,
    user.phoneNo,
    phoneNo,
    emailError,
    contactError,
    selectImage
  ]);

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
      setEmail(text.trim());
    const {msg} = validateNotEmptyContact(text.trim(), phoneNo);
    setContactError(msg);
    const msg_email = validateNotNecessatyEmail(text.trim()).msg;
    setEmailError(msg_email);
  };
  const onChangedPhoneNo = text => {
    const {msg} = validateNotEmptyContact(email, text.trim());
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
      // cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      setSelectImage(image);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
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

  const onPressUpdate = () => {};

  const onPressContinue = () => navigation.navigate(StackNav.TabBar);

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.editProfile} />
      <ZKeyBoardAvoidWrapper containerStyle={[styles.p20]}>
        {/* user picture */}
        <View>
            <TouchableOpacity
                onPress={onPressProfilePic}
                style={[styles.selfCenter, styles.mb20]}>
                {!!selectImage?.path ? (
                    <Image
                    source={{uri: selectImage?.path}}
                    style={localStyles.userImage}
                    />
                ) : !!user.img ?
                (
                    <Image
                    source={{uri: user.img}}
                    style={localStyles.userImage}
                    />
                ) :
                (
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

            <ZText style={styles.selfCenter}>
                {user.username}
            </ZText>
        </View>

        {/* info containers */}
        <View style={localStyles.infoBox}>
            <View style={localStyles.iconWidth}>
                <MaterialIcon
                    name="cake-variant-outline"
                    size={moderateScale(30)}
                    color={colors.primary}
                />
            </View>
            <View style={styles.ml15}>
                <ZText>{strings.birthday}</ZText>
                <ZText style={localStyles.iconColor}>{user.birthdate}</ZText>
            </View>
        </View>

        <View style={localStyles.infoBox}>
            <View style={localStyles.iconWidth}>
                <MaterialIcon
                    name="account-question"
                    size={moderateScale(30)}
                    color={colors.primary}
                />
            </View>
            <View style={styles.ml15}>
                <ZText>{strings.gender}</ZText>
                <ZText style={localStyles.iconColor}>{user.gender}</ZText>
            </View>
        </View>

        <View style={localStyles.infoBox}>
            <View style={localStyles.iconWidth}>
                <MaterialIcon
                    name="earth-box"
                    size={moderateScale(30)}
                    color={colors.primary}
                />
            </View>
            <View style={styles.ml15}>
                <ZText>{strings.state}</ZText>
                <ZText style={localStyles.iconColor}>{user.state}</ZText>
            </View>
        </View>

        <View style={localStyles.infoBox}>
            <View style={localStyles.iconWidth}>
                <MaterialIcon
                    name="city-variant-outline"
                    size={moderateScale(30)}
                    color={colors.primary}
                />
            </View>
            <View style={styles.ml15}>
                <ZText>{strings.municipality}</ZText>
                <ZText style={localStyles.iconColor}>{user.municipality}</ZText>
            </View>
        </View>

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

        {/* form inputs */}
      </ZKeyBoardAvoidWrapper>
      <View style={localStyles.btnContainer}>
          <ZButton
            title={strings.update}
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
    </ZSafeAreaView>
  );
};

export default UserProfile;

const localStyles = StyleSheet.create({
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
  countryPickerButton: {
    ...styles.alignStart,
    ...styles.justifyCenter,
  },
  infoBox: {
    ...styles.rowStart,
    ...styles.mt20
  },
  iconColor: {
    color: '#808080',
  },
  iconWidth: {
    width: moderateScale(30),
  }
});
