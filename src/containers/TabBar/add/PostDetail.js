// Library import
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import React, { createRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Snackbar, Button} from '@react-native-material/core';
import ImagePicker from 'react-native-image-crop-picker';
import { FlashList } from '@shopify/flash-list';
// import base64 from 'react-native-base64';

// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import typography from '../../../themes/typography';
import ZText from '../../../components/common/ZText';
import ZButton from '../../../components/common/ZButton';
import {useNavigation} from '@react-navigation/native';
import {TabNav} from '../../../navigation/NavigationKeys';
import { createPost } from '../../../api/feed/posts';
import ProfilePicture from '../../../components/models/ProfilePicture';

export default function PostDetail() {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const numColumns = 3;
  const size = width / numColumns;

  const ProfilePictureSheetRef = createRef();

  const [text, setText] = React.useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);
  const [selectImage, setSelectImage] = React.useState([]);

  const onChangeText = val => setText(val);

  const onPressHome = () => navigation.navigate(TabNav.Home);

  const closeSnackbar = () => setIsSnackbarVisible(false);

  useEffect(() => {
    ProfilePictureSheetRef?.current?.hide();
  }, [selectImage]);

  const onPressProfilePic = () => ProfilePictureSheetRef?.current.show();

  const onPressCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      includeBase64: true,
    }).then(image => {
      addImg(image);
    });
  };

  const onPressGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(images => {
      addImg(images);
    });
  };

  const addImg = (img) => {
    const new_arr = [img];
    const old_arr = selectImage;
    const selectImgArr = old_arr.concat(new_arr);
    
    setSelectImage(selectImgArr);
  };

  const imgContainer = (img) => {
    return (
      <TouchableOpacity 
            style={localStyles.image}
          >
            <Image
              source={{
                width: size * 0.8,
                height: size * 0.8,
                uri: img.path
              }}
              resizeMode="cover"
              style={localStyles.imageContainer}
            />
          </TouchableOpacity>
    )
  }

  const onPressPost = async () => {
    const formData = new FormData();
    formData.append("description", text);
    formData.append("profile_id", "0c7ceb44a155db2fd60058e64eb255ch");
    formData.append("share_type", "POST");
    
    selectImage.forEach((value, index) => {
      const imageData = {
        uri: value.path,
        name: `img_${index}.jpg`,
        type: value.mime,
      }
      formData.append(`image_${index}`, imageData);
    });

    await createPost(formData)
      .then(resp => {
        console.log("RESP:",resp);
        if ("Error" in resp) {
          setIsSnackbarVisible(true);
        } else {
          console.log("Resp:", resp);
          navigation.navigate(TabNav.Home);
        }
      })
      .catch(err => console.log('Post error:', err));
  };

  // const getFileFromBase64 = (string64, fileName) => {
  //   const trimmedString = string64.replace('dataimage/jpegbase64', '');
  //   const imageContent = base64.decode(trimmedString);
  //   const buffer = new ArrayBuffer(imageContent.length);
  //   const view = new Uint8Array(buffer);
  
  //   for (let n = 0; n < imageContent.length; n++) {
  //     view[n] = imageContent.charCodeAt(n);
  //   }
  //   const type = 'image/jpeg';
  //   const blob = new Blob([buffer], { type });
  //   return new File([blob], fileName, { lastModified: new Date().getTime(), type });
  // }

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.post} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mh20}>
        <View style={localStyles.container}>
          <TextInput
            placeholder={strings.writeHere}
            multiline={true}
            placeholderTextColor={colors.placeHolderColor}
            style={[
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.bColor,
                color: colors.textColor,
              },
              localStyles.inputContainerStyle,
            ]}
            inputBoxStyle={localStyles.inputBoxStyle}
            onChangeText={onChangeText}
          />
        </View>
        <View
          style={[
            localStyles.categoryContainer,
            {
              borderBottomColor: colors.bColor,
            },
          ]}>
        </View>

        <View style={localStyles.imgContainer}>
          <TouchableOpacity 
            style={localStyles.image}
            onPress={onPressProfilePic}
          >
            <View
              style={[localStyles.imageContainer,
                      localStyles.newImg]}
            >
              <Ionicons
                name={'add-sharp'}
                size={moderateScale(50)}
                color={colors.textColor}
                style={[styles.selfCenter, styles.mt10]}
              />
            </View>
            <ZText
              type={'b16'}
              color={colors.white}
              align={'center'}
              style={localStyles.coverPhotoStyle}>
              {strings.selectImg}
            </ZText>
          </TouchableOpacity>
        </View>

        <View style={localStyles.imgContainer}>
          <FlashList
            data={selectImage}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            renderItem={({item}) => imgContainer(item)}
            estimatedItemSize={size}
          />
        </View>
      </ScrollView>
      {isSnackbarVisible && 
        (<View 
          style={{flex: 1}}
        >
          <Snackbar
            message={strings.emptyPost}
            action={
              <Button
                variant="text"
                color={colors.primary}
                title={strings.accept}
                onPress={closeSnackbar}
                compact
              />
            }
            style={localStyles.snackbar}
          />
        </View>)
      }
      <View style={localStyles.btnContainer}>
        <ZButton
          title={strings.goBack}
          textType={'b18'}
          color={colors.dark ? colors.white : colors.primary}
          containerStyle={localStyles.skipBtnContainer}
          bgColor={colors.dark3}
          onPress={onPressHome}
        />
        <ZButton
          title={strings.post}
          textType={'b18'}
          color={colors.white}
          containerStyle={localStyles.skipBtnContainer}
          onPress={onPressPost}
        />
      </View>

      <ProfilePicture
        title={strings.selectImg}
        onPressCamera={onPressCamera}
        onPressGallery={onPressGallery}
        SheetRef={ProfilePictureSheetRef}
      />
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
  },
  imgContainer: {
    ...styles.rowStart,
    ...styles.justifyCenter,
    ...styles.wrap,
  },
  inputContainerStyle: {
    ...styles.flex,
    height: getHeight(132),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    ...styles.p20,
    ...typography.fontSizes.f16,
    ...typography.fontWeights.Regular,
    ...styles.mr15,
  },
  imageContainer: {
    width: moderateScale(110),
    height: getHeight(132),
    borderRadius: moderateScale(20),
  },
  coverPhotoStyle: {
    position: 'absolute',
    bottom: moderateScale(10),
    ...styles.selfCenter,
  },
  categoryContainer: {
    ...styles.flexRow,

    ...styles.mb20,
    ...styles.pv20,
    borderBottomWidth: moderateScale(1),
  },
  hashtagContainer: {
    ...styles.mr10,
    ...styles.rowCenter,
    ...styles.pv10,
    ...styles.ph20,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
  },
  settingsContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mb15,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.rowEnd,
  },
  shareIcon: {
    ...styles.mb20,
    ...styles.mr20,
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    ...styles.center,
  },
  shareContainer: {
    ...styles.mv20,
    ...styles.flexRow,
  },
  btnContainer: {
    ...styles.pv15,
    ...styles.mh20,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '45%',
  },
  image: {
    ...styles.m5,
  },
  newImg: {
    backgroundColor: '#555555',
  },
  snackbar: {
    position: 'absolute',
    start: 16,
    end: 6,
    bottom: 16,
  },
});
