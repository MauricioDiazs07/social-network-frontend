// Library import
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
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
import {getHeight, moderateScale, PROFILE_ID, PROFILE_PHOTO} from '../../../common/constants';
import ZInput from '../../../components/common/ZInput';
import ZKeyBoardAvoidWrapper from '../../../components/common/ZKeyBoardAvoidWrapper';
import {StackNav} from '../../../navigation/NavigationKeys';
import ProfilePicture from '../../../components/models/ProfilePicture';
import ZButton from '../../../components/common/ZButton';
import { validateNotEmptyContact,
         validateNotNecessaryEmail,
         validateName } from '../../../utils/validators';
import { getAsyncStorageData, setAsyncStorageData } from '../../../utils/helpers';
import { getProfileData } from '../../../api/feed/interaction';
import { updateAdminProfile } from '../../../api/admin/admin';

const UserProfile = props => {
  const {navigation} = props;

  // TODO: fetch from API
  const [userData, setUserData] = useState({
    img: '',
    username: '',
    birthdate: '',
    gender: '',
    state: '',
    municipality: '',
    email: '',
    phoneNo: '',
    description: '',
  });

  useEffect(() => {
    getAsyncStorageData(PROFILE_ID).then(profile => {
      getProfileData(profile).then(resp => {
        const user = {
          img: resp['profile_photo'],
          username: resp['name'],
          birthdate: resp['birthday'],
          gender: resp['gender'],
          state: resp['state'],
          municipality: resp['municipality'],
          email: resp['email'],
          phoneNo: resp['phone_number'],
          description: resp['description'],
        };
        setUserData(user);
        setEmail(resp['email']);
        setPhoneNo(resp['phone_number']);
        setDescription(resp['description']);
        setName(resp['name']);
      });
    });
  }, []);

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

  const [email, setEmail] = useState(userData.email);
  const [phoneNo, setPhoneNo] = useState(userData.phoneNo);
  const [description, setDescription] = useState(userData.description);
  const [name, setName] = useState(userData.name);
  const [emailError, setEmailError] = React.useState('');

  const [emailInputStyle, setEmailInputStyle] = useState(BlurredStyle);
  const [descriptionInputStyle, setDescriptionInputStyle] = useState(BlurredStyle);
  const [nameInputStyle, setNameInputStyle] = useState(BlurredStyle);
  const [emailIcon, setEmailIcon] = useState(BlurredIconStyle);
  const [descriptionIcon, setDescriptionIcon] = useState(BlurredIconStyle);
  const [nameIcon, setNameIcon] = useState(BlurredIconStyle);

  const [selectImage, setSelectImage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [contactError, setContactError] = useState(false);
  const [nameError, setNameError] = useState(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onFocusIcon = onHighlight => onHighlight(FocusedIconStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);
  const onBlurIcon = onUnHighlight => onUnHighlight(BlurredIconStyle);

  useEffect(() => {
    if (
      ((
        userData.email !== email || 
        userData.phoneNo !== phoneNo ||
        userData.username !== name ||
        userData.description !== description) &&
        !emailError &&
        !contactError &&
        !nameError) ||
      !!selectImage.path
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [
    userData.email,
    userData,
    userData.phoneNo,
    userData.username,
    userData.description,
    email,
    phoneNo,
    name,
    description,
    emailError,
    contactError,
    selectImage,
  ]);

  const onFocusEmail = () => {
    onFocusInput(setEmailInputStyle);
    onFocusIcon(setEmailIcon);
  };
  const onBlurEmail = () => {
    onBlurInput(setEmailInputStyle);
    onBlurIcon(setEmailIcon);
  };

  const onFocusDescription = () => {
    onFocusInput(setDescriptionInputStyle);
    onFocusIcon(setDescriptionIcon);
  };

  const onBlurDescription = () => {
    onBlurInput(setDescriptionInputStyle);
    onBlurIcon(setDescriptionIcon);
  };

  const onFocusName = () => {
    onFocusInput(setNameInputStyle);
    onFocusIcon(setNameIcon);
  };

  const onBlurName = () => {
    onBlurInput(setNameInputStyle);
    onBlurIcon(setNameIcon);
  };

  const onChangedEmail = text => {
    setEmail(text.trim());
    const {msg} = validateNotEmptyContact(text.trim(), phoneNo);
    setContactError(msg);
    const msg_email = validateNotNecessaryEmail(text.trim()).msg;
    setEmailError(msg_email);
  };
  const onChangedDescription = text => {
    setDescription(text);
  };
  const onChangedName = text => {
    const {msg} = validateName(text.trim());
    setName(text);
    setNameError(msg);
  };

  useEffect(() => {
    ProfilePictureSheetRef?.current?.hide();
  }, [selectImage]);

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

  const DescriptionIcon = () => (
    <Ionicons name="text" size={moderateScale(20)} color={descriptionIcon} />
  );

  const NameIcon = () => (
    <Ionicons name="card-outline" size={moderateScale(20)} color={nameIcon} />
  );

  const onPressContinue = () => {
    getAsyncStorageData(PROFILE_ID).then(profile_id => {
      updateAdminProfile(
        profile_id,
        name,
        email,
        description,
        selectImage
      ).then(resp => {
        if (selectImage != '') {
          setAsyncStorageData(PROFILE_PHOTO, resp['profile_photo']);
        }

        navigation.navigate(StackNav.TabBar);
      });
    });
  };

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.editProfile} />
      <ZKeyBoardAvoidWrapper containerStyle={[styles.p20]}>
        {/* user picture */}
        <View>
          <TouchableOpacity
            onPress={onPressProfilePic}
            style={[styles.selfCenter, styles.mb50]}>
            {!!selectImage?.path ? (
              <Image
                source={{uri: selectImage?.path}}
                style={localStyles.userImage}
              />
            ) : !!userData.img ? (
              <Image
                source={{uri: userData.img}}
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
        </View>

        {/* info containers */}
        <ZInput
          placeHolder={'Nombre'}
          keyBoardType={'default'}
          _value={name}
          _errorText={nameError}
          autoCapitalize={'words'}
          toGetTextFieldValue={onChangedName}
          rightAccessory={() => <NameIcon />}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            nameInputStyle,
          ]}
          _onFocus={onFocusName}
          onBlur={onBlurName}
        />

        <ZInput
          placeHolder={'Descripción'}
          keyBoardType={'default'}
          _value={description}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedDescription}
          rightAccessory={() => <DescriptionIcon />}
          multiline={true}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.descriptionContainerStyle,
            descriptionInputStyle,
          ]}
          _onFocus={onFocusDescription}
          onBlur={onBlurDescription}
        />

        <ZInput
          placeHolder={'Email'}
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
      
        {/* form inputs */}
      </ZKeyBoardAvoidWrapper>
      {!isSubmitDisabled && (
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
      )}
      <ProfilePicture
        onPressCamera={onPressCamera}
        onPressGallery={onPressGallery}
        SheetRef={ProfilePictureSheetRef}
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
  descriptionContainerStyle: {
    height: getHeight(100),
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
    ...styles.mt20,
  },
  iconColor: {
    color: '#808080',
  },
  iconWidth: {
    width: moderateScale(30),
  },
});
