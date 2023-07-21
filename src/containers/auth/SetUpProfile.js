// Libraries import
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

// Local import
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import strings from '../../i18n/strings';
import { styles } from '../../themes';
import { GenderData, getHeight, moderateScale } from '../../common/constants';
import ZInput from '../../components/common/ZInput';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import { StackNav } from '../../navigation/NavigationKeys';
import ZButton from '../../components/common/ZButton';
import {
  validateNotEmptyField,
} from '../../utils/validators';
import { checkPlatform } from '../../utils/helpers';
import {
  extractBirthday,
  translateBirthday,
  getFormateDate,
  // getStates,
  // getMunicipalities,
  getGender,
  isNotEmptyString
} from '../../utils/_support_functions';
import ZText from '../../components/common/ZText';

const SetUpProfile = props => {
  const {navigation} = props;
  const userCred = props.route.params.userCred;
  const userInfo = props.route.params.user;

  const colors = useSelector(state => state.theme.theme);
  // const statesList = getStates();

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.bColor,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };

  const [fullName, setFullName] = useState(userInfo['name']);
  const [birthday, setBirthday] = useState(extractBirthday(userInfo['birthday']));
  const [gender, setGender] = useState(getGender(userInfo));
  const [address, setAddress] = useState(userInfo['address']);
  const [state_, setState] = useState(userInfo['state']);
  const [municipality, setMunicipality] = useState(userInfo['municipality']);
  const [curp, setCurp] = useState(userInfo['curp']);

  const [fullNameInputStyle, setFullNameInputStyle] = useState(BlurredStyle);
  const [birthdayInputStyle, setBirthdayInputStyle] = useState(BlurredStyle);
  const [addressInputStyle, setAddressInputStyle] = useState(BlurredStyle);
  const [stateInputStyle, setStateInputStyle] = useState(BlurredStyle);
  const [municipalityInputStyle, setMunicipalityInputStyle] = useState(BlurredStyle);
  const [curpInputStyle, setCurpInputStyle] = useState(BlurredStyle);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [municipalityError, setMunicipalityError] = useState(false);
  const [curpError, setCurpError] = useState(false);
  const [date, setDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);

  // const [municipalityList, setMunicipalityList] = useState([]);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);

  useEffect(() => {
    if (
      isNotEmptyString(fullName) &&
      !nameError &&
      isNotEmptyString(birthday) &&
      isNotEmptyString(gender) &&
      isNotEmptyString(address) &&
      !addressError &&
      isNotEmptyString(state_) &&
      !stateError &&
      isNotEmptyString(municipality) &&
      !municipalityError &&
      isNotEmptyString(curp) &&
      !curpError
      // true
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
    address,
    addressError,
    state_,
    stateError,
    municipality,
    municipalityError,
    curp,
    curpError
  ]);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onFocusBirthday = () => onFocusInput(setBirthdayInputStyle);
  const onFocusFullName = () => onFocusInput(setFullNameInputStyle);
  const onFocusAddress = () => onFocusInput(setAddressInputStyle);
  const onFocusState = () => onFocusInput(setStateInputStyle);
  const onFocusMunicipality = () => onFocusInput(setMunicipalityInputStyle);
  const onFocusCurp = () => onFocusInput(setCurpInputStyle);

  const onBlurBirthday = () => onBlurInput(setBirthdayInputStyle);
  const onBlurFullName = () => onBlurInput(setFullNameInputStyle);
  const onBlurAddress = () => onBlurInput(setAddressInputStyle);
  const onBlurState = () => onBlurInput(setStateInputStyle);
  const onBlurMunicipality = () => onBlurInput(setMunicipalityInputStyle);
  const onBlurCurp = () => onBlurInput(setCurpInputStyle);

  const onChangedFullName = text => {
    const {msg} = validateNotEmptyField(text.trim());
    setFullName(text);
    setNameError(msg);
  };
  const onChangedBirthday = text => setBirthday(text);
  const onChangedGender = text => setGender(text.value.toLowerCase());
  // const onChangedState = text => {
  //   setState(text.value.toLowerCase());
  //   const municipalityList_ = getMunicipalities(text);
  //   setMunicipalityList(municipalityList_);
  // };
  // const onChangedMunicipality = text =>
    // setMunicipality(text.value.toLowerCase());
  const onChangedAddress = text => {
    const {msg} = validateNotEmptyField(text.trim());
    setAddress(text);
    setAddressError(msg);
  };
  const onChangedState = text => {
    const {msg} = validateNotEmptyField(text.trim());
    setState(text);
    setStateError(msg);
  };
  const onChangedMunicipality = text => {
    const {msg} = validateNotEmptyField(text.trim());
    setMunicipality(text);
    setMunicipalityError(msg);
  };
  const onChangedCurp = text => {
    const {msg} = validateNotEmptyField(text.trim());
    setCurp(text);
    setCurpError(msg);
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

  const onPressContinue = () => {
    const userInfo_ = {
        name: fullName,
        birthday: birthday,
        gender: gender,
        address: address,
        state: state_,
        municipality: municipality,
        curp: curp
    };

    console.log(userInfo_);
    navigation.navigate(StackNav.FinishProfile, {
      userCred: userCred,
      userInfo: userInfo_
    });
  };

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.confirmInfo} />
      <ZKeyBoardAvoidWrapper containerStyle={[styles.p20]}>
        <View style={localStyles.warningBox}>
          <Ionicons
            name="warning-outline"
            size={moderateScale(60)}
            color='#fcba03'
          />
          <ZText type={'r18'} style={localStyles.warningText}>
            {strings.warningInfo}
          </ZText>
        </View>

        {/* form inputs */}
        <ZText type={'r12'}>{strings.fullName}</ZText>
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

        <ZText type={'r12'}>{strings.birthday}</ZText>
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

        <ZText type={'r12'}>{strings.gender}</ZText>
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

        <ZText type={'r12'}>{strings.address}</ZText>
        <ZInput
          placeHolder={strings.address}
          _value={address}
          _errorText={addressError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedAddress}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            addressInputStyle,
          ]}
          _onFocus={onFocusAddress}
          onBlur={onBlurAddress}
        />

        {/* <Dropdown
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
        /> */}

        <ZText type={'r12'}>{strings.state}</ZText>
        <ZInput
          placeHolder={strings.state}
          _value={state_}
          _errorText={stateError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedState}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            stateInputStyle,
          ]}
          _onFocus={onFocusState}
          onBlur={onBlurState}
        />
        
        {/* <Dropdown
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
        /> */}

        <ZText type={'r12'}>{strings.municipality}</ZText>
        <ZInput
          placeHolder={strings.municipality}
          _value={municipality}
          _errorText={municipalityError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedMunicipality}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            municipalityInputStyle,
          ]}
          _onFocus={onFocusMunicipality}
          onBlur={onBlurMunicipality}
        />

        <ZText type={'r12'}>{strings.curp}</ZText>
        <ZInput
          placeHolder={strings.curp}
          _value={curp}
          _errorText={curpError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedCurp}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            curpInputStyle,
          ]}
          _onFocus={onFocusCurp}
          onBlur={onBlurCurp}
        />
        {/* form inputs */}
      </ZKeyBoardAvoidWrapper>
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
    </ZSafeAreaView>
  );
};

export default SetUpProfile;

const localStyles = StyleSheet.create({
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
    ...styles.mb10,
  },
  btnContainer: {
    ...styles.p10,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '90%',
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
  warningBox: {
    ...styles.rowSpaceAround,
    ...styles.mb20,
  },
  warningText: {
    width: moderateScale(250),
  }
});