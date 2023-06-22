// Libraries import
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {createRef, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import CountryPicker, {
  FlagButton,
  DARK_THEME,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

// Local import
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import strings from '../../i18n/strings';
import images from '../../assets/images';
import {styles} from '../../themes';
import {GenderData, getHeight, moderateScale} from '../../common/constants';
import ZInput from '../../components/common/ZInput';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import {StackNav} from '../../navigation/NavigationKeys';
import ProfilePicture from '../../components/models/ProfilePicture';
import ZButton from '../../components/common/ZButton';
import {
  validateNotEmptyContact,
  validateNotEmptyField,
} from '../../utils/validators';
import {checkPlatform} from '../../utils/helpers';
import {
  translateBirthday,
  getStates,
  getMunicipalities,
} from '../../utils/_support_functions';
import ZText from '../../components/common/ZText';

const SetUpProfile = props => {
  const {navigation} = props;
  const headerTitle = props.route.params.title;
  const emailRegister = props.route.params.email
    ? props.route.params.email
    : '';

  const colors = useSelector(state => state.theme.theme);
  const ProfilePictureSheetRef = createRef();
  const statesList = getStates();

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

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(emailRegister);
  const [birthday, setBirthday] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('');
  const [state_, setState] = useState('');
  const [municipality, setMunicipality] = useState('');

  const [fullNameInputStyle, setFullNameInputStyle] = useState(BlurredStyle);
  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [birthdayInputStyle, setBirthdayInputStyle] = useState(BlurredStyle);
  const [phoneNoInputStyle, setPhoneNoInputStyle] = useState(BlurredStyle);
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [chevronDown, setChevronDown] = useState(BlurredIconStyle);

  const [selectImage, setSelectImage] = useState('');
  const [callingCodeLib, setCallingCodeLib] = useState(+91);
  const [countryCodeLib, setCountryCodeLib] = useState('MX');
  const [visiblePiker, setVisiblePiker] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [date, setDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);

  const [municipalityList, setMunicipalityList] = useState([]);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      fullName.length > 0 &&
      !nameError &&
      birthday.length > 0 &&
      gender.length > 0 &&
      state_.length > 0 &&
      municipality.length > 0 &&
      (email.length > 0 || phoneNo.length > 0) &&
      !contactError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [
    fullName,
    nameError,
    birthday,
    gender,
    state_,
    municipality,
    email,
    phoneNo,
    contactError,
  ]);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const onFocusBirthday = () => onFocusInput(setBirthdayInputStyle);
  const onFocusFullName = () => onFocusInput(setFullNameInputStyle);
  const onFocusPhoneNo = () => {
    onFocusInput(setPhoneNoInputStyle);
    onFocusIcon(setChevronDown);
  };

  const onBlurBirthday = () => onBlurInput(setBirthdayInputStyle);
  const onBlurFullName = () => onBlurInput(setFullNameInputStyle);
  const onBlurPhoneNo = () => {
    onBlurInput(setPhoneNoInputStyle);
    onBlurIcon(setChevronDown);
  };

  const onChangedFullName = text => {
    const {msg} = validateNotEmptyField(text.trim());
    setFullName(text);
    setNameError(msg);
  };
  const onChangedBirthday = text => setBirthday(text);
  const onChangedGender = text => setGender(text.value.toLowerCase());
  const onChangedState = text => {
    setState(text.value.toLowerCase());
    const municipalityList_ = getMunicipalities(text);
    setMunicipalityList(municipalityList_);
  };
  const onChangedMunicipality = text =>
    setMunicipality(text.value.toLowerCase());
  const onChangedEmail = text => {
    const {msg} = validateNotEmptyContact(text.trim(), phoneNo);
    setEmail(text);
    setContactError(msg);
  };
  const onChangedPhoneNo = text => {
    const {msg} = validateNotEmptyContact(email, text.trim());
    setPhoneNo(text);
    setContactError(msg);
  };

  const onChangeDatePicker = ({type}, selectedDate) => {
    if (type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (checkPlatform() === 'android') {
        const finalDate = translateBirthday(currentDate);

        toggleDatePicker();
        setBirthday(finalDate);
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setBirthday(date.toDateString());
    toggleDatePicker();
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

  const onPressContinue = () => navigation.navigate(StackNav.FollowSomeone);

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();

  return (
    <ZSafeAreaView>
      <ZHeader title={headerTitle} />
      <ZKeyBoardAvoidWrapper containerStyle={[styles.p20]}>
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

        {/* form inputs */}
        <ZInput
          placeHolder={strings.fullName}
          _value={fullName}
          _errorText={nameError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedFullName}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            fullNameInputStyle,
          ]}
          _onFocus={onFocusFullName}
          onBlur={onBlurFullName}
        />

        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={onChangeDatePicker}
            style={localStyles.dateContainer}
          />
        )}

        {showPicker && checkPlatform() === 'ios' && (
          <View
            style={localStyles.iosBtns}
          >
            <TouchableOpacity style={[
                localStyles.button,
                localStyles.pickerBtn,
                { backgroundColor: "#11182711" }
              ]}
              onPress={toggleDatePicker}
            >
              <ZText
                style={[
                  localStyles.btnText,
                  { color: "#075985" }
                ]}
              >Cancel</ZText>
            </TouchableOpacity>

            <TouchableOpacity style={[
                localStyles.button,
                localStyles.pickerBtn,
              ]}
              onPress={confirmIOSDate}
            >
              <ZText
                style={[
                  localStyles.btnText,
                ]}
              >Confirm</ZText>
            </TouchableOpacity>
          </View>
        )}

        <Pressable onPress={toggleDatePicker}>
          <ZInput
            placeHolder={strings.birthday}
            keyBoardType={'number-pad'}
            _value={birthday}
            toGetTextFieldValue={onChangedBirthday}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              birthdayInputStyle,
            ]}
            _onFocus={onFocusBirthday}
            onBlur={onBlurBirthday}
            _editable={false}
            oPressIn={toggleDatePicker}
          />
        </Pressable>

        <Dropdown
          style={[
            localStyles.dropdownStyle,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBg,
              color: colors.white,
            },
          ]}
          placeholderStyle={{color: colors.grayScale5}}
          data={GenderData}
          maxHeight={moderateScale(180)}
          labelField="label"
          valueField="value"
          placeholder={strings.gender}
          value={gender}
          itemTextStyle={{
            color: colors.textColor,
            fontSize: moderateScale(16),
          }}
          onChange={onChangedGender}
          selectedTextStyle={{
            color: colors.textColor,
          }}
          itemContainerStyle={{
            backgroundColor: colors.inputBg,
          }}
          activeColor={colors.inputBg}
        />

        <Dropdown
          style={[
            localStyles.dropdownStyle,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBg,
              color: colors.white,
            },
          ]}
          placeholderStyle={{color: colors.grayScale5}}
          data={statesList}
          maxHeight={moderateScale(180)}
          labelField="label"
          valueField="value"
          placeholder={strings.state}
          value={state_}
          itemTextStyle={{
            color: colors.textColor,
            fontSize: moderateScale(16),
          }}
          onChange={onChangedState}
          selectedTextStyle={{
            color: colors.textColor,
          }}
          itemContainerStyle={{
            backgroundColor: colors.inputBg,
          }}
          activeColor={colors.inputBg}
        />
        
        <Dropdown
          style={[
            localStyles.dropdownStyle,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBg,
              color: colors.white,
            },
          ]}
          placeholderStyle={{color: colors.grayScale5}}
          data={municipalityList}
          maxHeight={moderateScale(180)}
          labelField="label"
          valueField="value"
          placeholder={strings.municipality}
          value={municipality}
          itemTextStyle={{
            color: colors.textColor,
            fontSize: moderateScale(16),
          }}
          onChange={onChangedMunicipality}
          selectedTextStyle={{
            color: colors.textColor,
          }}
          itemContainerStyle={{
            backgroundColor: colors.inputBg,
          }}
          activeColor={colors.inputBg}
        />

        <ZInput
          placeHolder={strings.email}
          keyBoardType={'email-address'}
          _value={email}
          _errorText={contactError}
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
      {!!(headerTitle === strings.editProfile) ? (
        <ZButton
          textType={'b18'}
          color={colors.white}
          title={strings.update}
          onPress={onPressUpdate}
          containerStyle={styles.m20}
        />
      ) : (
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
      )}
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

export default SetUpProfile;

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
  dropdownStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    ...styles.ph25,
    ...styles.mt15,
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
  button: {
    width: moderateScale(100),
    height: getHeight(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    ...styles.mt10,
    ...styles.mb15,
    backgroundColor: "#075985"
  },
  btnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  dateContainer: {
    height: 120,
    ...styles.mt_5,
  },
  iosBtns: {
    ...styles.rowSpaceAround,
  },
  pickerBtn: {
    ...styles.ph20,
  },
});
