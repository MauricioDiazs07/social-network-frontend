// libraries import
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import {readINE} from '../../api/auth/auth';
import {StackNav} from '../../navigation/NavigationKeys';

const CameraRegister = props => {
  const {navigation} = props;
  const headerTitle = props.route.params.title;
  const emailRegister = props.route.params.email;
  const passwordRegister = props.route.params.password;

  const colors = useSelector(state => state.theme.theme);

  const [img, setImg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);
  const [isReadingError, setIsReadingError] = React.useState(false);

  const showCameraAlert = () =>
    Alert.alert('', strings.cutCamera, [
      {
        text: strings.accept,
        onPress: () => onPressCamera(),
      },
    ]);

  const showGalleryAlert = () =>
    Alert.alert('', strings.cutImage, [
      {
        text: strings.accept,
        onPress: () => onPressGallery(),
      },
    ]);

  const onPressCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      readINE_(image);
    });
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
    readINE(img)
      .then(resp => {
        setIsLoading(false);
        if (!('name' in resp)) {
          setIsReadingError(true);
          setIsSnackbarVisible(true);
          return;
        }
        navigation.navigate(StackNav.SetUpProfile, {
          title: headerTitle,
          userCred: {
            email: emailRegister,
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
        email: emailRegister,
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
            onPress={showCameraAlert}>
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
