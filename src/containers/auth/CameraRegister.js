// libraries import
import React, { Component } from 'react';
import * as BlinkIDReactNative from 'blinkid-react-native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {Snackbar, Button} from '@react-native-material/core';

// local import
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import ZText from '../../components/common/ZText';
import {styles} from '../../themes';
import strings from '../../i18n/strings';
import {getHeight, moderateScale} from '../../common/constants';
import {UserResearch} from '../../assets/svgs';
import {readINE, readINE_2, readINE_3} from '../../api/auth/auth';
import {StackNav} from '../../navigation/NavigationKeys';
import { getFormatedBirthday, translateBirthday } from '../../utils/_support_functions';

const licenseKey = Platform.select({
  // iOS license key for applicationID: com.jsm.Influex
  ios: 'sRwAAAEPY29tLmpzbS5JbmZsdWV4DbDaTEeTkHWoDqWbqsnhy9UKkAiOCSauXMb81ao+3Xe/DpIn3v1SEYn2r581qej2GaArjVgd0hTUJJLlyKX0b9LyM98fvHBX46GMPSYeY09ayI3Epq+xogrQnkPUgUZVvkVZlBlYJo3XEbkZqxzf5YdOUAgllZ2/uNl1KBMPj5Yl88w1KkcT4awT9hPQh9PDilAIu5Ez8es9miWg7gFBtm+VzoWeSqZEbQ==',
  // android license key for applicationID: com.jsm.influex
  android: 'sRwAAAAPY29tLmpzbS5pbmZsdWV4z/iWXqtmF/Jh0uiVw2VXq5CV8clV/h1djajxChpdK/JMfEMbAdB4rlmmdPIBnpEEDBRRSUNRuxaBsn8Q5gH9o2VLTB/T0MmiopLDChQIPzxE/Q1nSI1jw6BTOzYhCAjmVztz+OqiYYeYDtHZD7jJorBLND/WiTd+gyJD73I5K2Q3+9ISeghIpl4liMS6B7SbW32Edl+Q0pcEgliX+sl7MRvQkD5tDzcnzw=='
})

const CameraRegister = props => {
  const {navigation} = props;
  const headerTitle = props.route.params.title;
  const phoneNumberRegister = props.route.params.phone;
  const passwordRegister = props.route.params.password;

  const colors = useSelector(state => state.theme.theme);

  const [img, setImg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);
  const [isReadingError, setIsReadingError] = React.useState(false);

  var user_ = {
    'name': '',
    'gender': '',
    'state': '',
    'municipality': '',
    'address': '',
    'birthday': '',
    'curp': '',
    'section': ''
  }

  /* ---------- BLINKID FUNCTIONS ---------- */
  handleResult = (result) => {
    var localState = {
        showFrontImageDocument: false,
        resultFrontImageDocument: '',
        showBackImageDocument: false,
        resultBackImageDocument: '',
        resultImageFace: '',
        results: '',
        showSuccessFrame: false,
        successFrame: '',
        info: {}
    };

    if (result instanceof BlinkIDReactNative.BlinkIdMultiSideRecognizerResult) {
        let blinkIdResult = result;

        let resultString =
            buildResult(blinkIdResult.firstName.description, "First name") +
            buildResult(blinkIdResult.lastName.description, "Last name") +
            buildResult(blinkIdResult.fullName.description, "Full name") +
            buildResult(blinkIdResult.localizedName.description, "Localized name") +
            buildResult(blinkIdResult.additionalNameInformation.description, "Additional name info") +
            buildResult(blinkIdResult.address.description, "Address") +
            buildResult(blinkIdResult.additionalAddressInformation.description, "Additional address info") +
            buildResult(blinkIdResult.documentNumber.description, "Document number") +
            buildResult(blinkIdResult.documentAdditionalNumber.description, "Additional document number") +
            buildResult(blinkIdResult.sex.description, "Sex") +
            buildResult(blinkIdResult.issuingAuthority.description, "Issuing authority") +
            buildResult(blinkIdResult.nationality.description, "Nationality") +
            buildDateResult(blinkIdResult.dateOfBirth, "Date of birth") +
            buildResult(blinkIdResult.age, "Age") +
            buildDateResult(blinkIdResult.dateOfIssue, "Date of issue") +
            buildDateResult(blinkIdResult.dateOfExpiry, "Date of expiry") +
            buildResult(blinkIdResult.dateOfExpiryPermanent, "Date of expiry permanent") +
            buildResult(blinkIdResult.expired, "Expired") +
            buildResult(blinkIdResult.maritalStatus.description, "Martial status") +
            buildResult(blinkIdResult.personalIdNumber.description, "Personal id number") +
            buildResult(blinkIdResult.profession.description, "Profession") +
            buildResult(blinkIdResult.race.description, "Race") +
            buildResult(blinkIdResult.religion.description, "Religion") +
            buildResult(blinkIdResult.residentialStatus.description, "Residential status") +
            buildResult(blinkIdResult.processingStatus.description, "Processing status") +
            buildResult(blinkIdResult.recognitionMode.description, "Recognition mode")
            ;

        user_["name"] = blinkIdResult.fullName.description;
        user_["gender"] = blinkIdResult.sex.description;
        user_["state"] = '';
        user_["municipality"] = '';
        user_["address"] = blinkIdResult.address.description;
        res = blinkIdResult.dateOfBirth
        user_["birthday"] = getFormatedBirthday(res.day, res.month, res.year);
        user_["curp"] = blinkIdResult.personalIdNumber.description;
        user_["section"] = '';

        console.log("user_", user_);

        let dataMatchResult = blinkIdResult.dataMatchResult;
        resultString +=
                buildResult(dataMatchResult.stateForWholeDocument, "State for the whole document") +
                buildResult(dataMatchResult.states[0].state, "dateOfBirth") +
                buildResult(dataMatchResult.states[1].state, "dateOfExpiry") +
                buildResult(dataMatchResult.states[2].state, "documentNumber");
        

        let licenceInfo = blinkIdResult.driverLicenseDetailedInfo;
        if (licenceInfo) {
            var vehicleClassesInfoString = '';
            if (licenceInfo.vehicleClassesInfo) {
              for (let i=0; i<licenceInfo.vehicleClassesInfo.length; i++) {
                    vehicleClassesInfoString += buildResult(licenceInfo.vehicleClassesInfo[i].vehicleClass.description, 'Vehicle class') + 
                    buildResult(licenceInfo.vehicleClassesInfo[i].licenceType.description, 'License type') + 
                    buildDateResult(licenceInfo.vehicleClassesInfo[i].effectiveDate, 'Effective date') + 
                    buildDateResult(licenceInfo.vehicleClassesInfo[i].expiryDate, 'Expiry date');
                }
            }
            resultString +=
                buildResult(licenceInfo.restrictions.description, "Restrictions") +
                buildResult(licenceInfo.endorsements.description, "Endorsements") +
                buildResult(licenceInfo.vehicleClass.description, "Vehicle class") +
                buildResult(licenceInfo.conditions.description, "Conditions") + vehicleClassesInfoString;
        }

        // there are other fields to extract
        localState.results += resultString;

        // Document image is returned as Base64 encoded JPEG
        if (blinkIdResult.fullDocumentFrontImage) {
            localState.showFrontImageDocument = true;
            localState.resultFrontImageDocument = 'data:image/jpg;base64,' + blinkIdResult.fullDocumentFrontImage;
        }
        if (blinkIdResult.fullDocumentBackImage) {
            localState.showBackImageDocument = true;
            localState.resultBackImageDocument = 'data:image/jpg;base64,' + blinkIdResult.fullDocumentBackImage;
        }
        // Face image is returned as Base64 encoded JPEG
        if (blinkIdResult.faceImage) {
            localState.showImageFace = true;
            localState.resultImageFace = 'data:image/jpg;base64,' + blinkIdResult.faceImage;
        }
    }
    return localState;
  }

  buildResult = (result, key) => {
    if (result && result != -1) {
        return key + ": " + result + "\n";
    }
    return ""
  }

  buildDateResult = (result, key) => {
    if (result && result.day && result.month && result.year) {
        var day = formatDate(result.day);
        var month = formatDate(result.month);
        console.log("DATE:",day + "/" + month + "/" + result.year);
        return key + ": " +
            day + "/" + month + "/" + result.year;
    }
    return ""
  }

  buildDate = (day_, month_, year_) => {
    var day = formatDate(day_);
    var month = formatDate(month_);
    console.log("BUILT DATE:",day + "/" + month + "/" + year_);
    return day + "/" + month + "/" + year_;
  }

  formatDate = date => {
    return date < 10 ? `0${date}` : date;
  }
  /* ---------- BLINKID FUNCTIONS ---------- */

  const showGalleryAlert = () =>
    Alert.alert('', strings.cutImage, [
      {
        text: strings.accept,
        onPress: () => onPressGallery(),
      },
    ]);

  const onPressCamera = async () => {
    // ImagePicker.openCamera({
    //   // cropping: true,
    //   mediaType: 'photo',
    //   includeBase64: true,
    // }).then(image => {
    //   readINE_(image);
    // });
    try {
      var blinkIdMultiSideRecognizer = new BlinkIDReactNative.BlinkIdMultiSideRecognizer();
      blinkIdMultiSideRecognizer.returnFullDocumentImage = true;
      blinkIdMultiSideRecognizer.returnFaceImage = true;

      const scanningResults = await BlinkIDReactNative.BlinkID.scanWithCamera(
          new BlinkIDReactNative.BlinkIdOverlaySettings(),
          new BlinkIDReactNative.RecognizerCollection([blinkIdMultiSideRecognizer/*, mrtdSuccessFrameGrabber*/]),
          licenseKey
      );

      if (scanningResults) {
          let newState = {
              showFrontImageDocument: false,
              resultFrontImageDocument: '',
              showBackImageDocument: false,
              resultBackImageDocument: '',
              showImageFace: false,
              resultImageFace: '',
              results: '',
              showSuccessFrame: false,
              successFrame: ''
          };

          for (let i = 0; i < scanningResults.length; ++i) {
              let localState = handleResult(scanningResults[i]);
              newState.showFrontImageDocument = newState.showFrontImageDocument || localState.showFrontImageDocument;
              if (localState.showFrontImageDocument) {
                  newState.resultFrontImageDocument = localState.resultFrontImageDocument;
              }
              newState.showBackImageDocument = newState.showBackImageDocument || localState.showBackImageDocument;
              if (localState.showBackImageDocument) {
                  newState.resultBackImageDocument = localState.resultBackImageDocument;
              }
              newState.showImageFace = newState.showImageFace || localState.showImageFace;
              if (localState.resultImageFace) {
                  newState.resultImageFace = localState.resultImageFace;
              }
              newState.results += localState.results;
              newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
              if (localState.successFrame) {
                  newState.successFrame = localState.successFrame;
              }

          }
          newState.results += '\n';
          
          setIsLoading(true);

          readINE_3(newState.resultFrontImageDocument)
            .then(resp => {
              console.log(resp);
              setIsLoading(false);
              if (!('name' in resp)) {
                setIsReadingError(true);
                setIsSnackbarVisible(true);
                return;
              }
              user_['name'] = resp['name'];
              user_["section"] = resp['section'];
              user_["state"] = resp['state'];
              user_["municipality"] = resp['municipality'];

              navigation.navigate(StackNav.SetUpProfile, {
                title: headerTitle,
                userCred: {
                  phone: phoneNumberRegister,
                  password: passwordRegister,
                },
                identification_photo: newState.resultFrontImageDocument,
                user: user_,
              });
            })
            .catch(err => {
              console.log(err);
              setIsReadingError(true);
              setIsLoading(false);
              setIsSnackbarVisible(true);
            });
      }
    } catch (error) {
        console.log("ERROR:", error);
        // this.setState({ showFrontImageDocument: false, resultFrontImageDocument: '', showBackImageDocument: false, resultBackImageDocument: '', showImageFace: false, resultImageFace: '', results: 'Scanning has been cancelled', showSuccessFrame: false,
        // successFrame: ''});
    }
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    }).then(images => {
      readINE_(images);
    });
  };

  const readINE_ = img => {
    setIsLoading(true);
    setImg(img);
    readINE_2(img)
      .then(resp => {
        console.log(resp);
        setIsLoading(false);
        if (!('name' in resp)) {
          setIsReadingError(true);
          setIsSnackbarVisible(true);
          return;
        }
        navigation.navigate(StackNav.SetUpProfile, {
          title: headerTitle,
          userCred: {
            phone: phoneNumberRegister,
            password: passwordRegister,
          },
          identification_photo: img,
          user: resp,
        });
      })
      .catch(err => {
        setIsReadingError(true);
        setIsLoading(false);
        setIsSnackbarVisible(true);
      });
  };

  const onPressContinue = () => {
    navigation.navigate(StackNav.SetUpProfile, {
      title: headerTitle,
      userCred: {
        phone: phoneNumberRegister,
        password: passwordRegister,
      },
      identification_photo: img,
      user: {
        'name': '',
        'gender': '',
        'state': '',
        'municipality': '',
        'address': '',
        'birthday': '',
        'curp': '',
        'section': ''
      }
    });
  }

  const closeSnackBar = () => setIsSnackbarVisible(false);

  return (
    <ZSafeAreaView>
      <ZHeader />
      <View style={[styles.ph20]}>
        <View style={[styles.mv20, styles.selfCenter]}>
          <UserResearch width={moderateScale(305)} height={getHeight(250)} />
        </View>

        <View style={localStyles.marginBlock}>
          <ZText type={'r18'}>{strings.cameraRegister}</ZText>
        </View>

        <View style={localStyles.marginBlock}>
          <TouchableOpacity
            style={[
              localStyles.contextContainer,
              {borderColor: colors.textColor},
            ]}
            onPress={onPressCamera}>
            <Ionicons
              name={'ios-camera'}
              size={moderateScale(26)}
              color={colors.textColor}
              style={styles.mr5}
            />
            <ZText type={'s18'} style={styles.ml10}>
              {strings.takeAPicture}
            </ZText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              localStyles.contextContainer,
              {borderColor: colors.textColor},
            ]}
            onPress={showGalleryAlert}>
            <Ionicons
              name={'ios-images'}
              size={moderateScale(26)}
              color={colors.textColor}
              style={styles.mr5}
            />
            <ZText type={'s18'} style={styles.ml10}>
              {strings.chooseFromGallery}
            </ZText>
          </TouchableOpacity>

          {isReadingError && (<TouchableOpacity
            style={[
              localStyles.contextContainer,
              {borderColor: colors.textColor},
            ]}
            onPress={onPressContinue}>
            <Ionicons
              name={'arrow-forward-circle'}
              size={moderateScale(26)}
              color={colors.textColor}
              style={styles.mr5}
            />
            <ZText type={'s18'} style={styles.ml10}>
              {strings.continueRegister}
            </ZText>
          </TouchableOpacity>)}
        </View>
      </View>
      <View
        style={[localStyles.loadingScreen, !isLoading && {display: 'none'}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <View style={[{flex: 1}, !isSnackbarVisible && {display: 'none'}]}>
        <Snackbar
          message={strings.INEFailed}
          theme={{colors: {surface: 'blue', accent: 'red'}}}
          action={
            <Button
              variant="text"
              color={colors.primary}
              title={strings.close}
              onPress={closeSnackBar}
              compact
            />
          }
          style={localStyles.snackbar}
        />
      </View>
    </ZSafeAreaView>
  );
};

export default CameraRegister;

const localStyles = StyleSheet.create({
  marginBlock: {
    ...styles.mt30,
  },
  contextContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
    ...styles.p15,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(15),
  },
  loadingScreen: {
    ...styles.center,
    backgroundColor: '#141C22AA',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  snackbar: {
    position: 'absolute',
    start: 16,
    end: 6,
    bottom: 16,
  },
});
