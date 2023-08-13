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
import {useNavigation} from '@react-navigation/native';

// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {ACCESS_TOKEN, getHeight, moderateScale} from '../../../common/constants';
import typography from '../../../themes/typography';
import ZText from '../../../components/common/ZText';
import ZButton from '../../../components/common/ZButton';
import {TabNav} from '../../../navigation/NavigationKeys';
import { createPost } from '../../../api/feed/posts';
import ProfilePicture from '../../../components/models/ProfilePicture';
import { getAsyncStorageData } from '../../../utils/helpers';
import { StackNav } from '../../../navigation/NavigationKeys';

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
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [index, setIndex] = React.useState(1);

  const onChangeText = val => setText(val);

  const onPressHome = () => navigation.navigate(TabNav.Home);

  const closeSnackbar = () => setIsSnackbarVisible(false);

  useEffect(() => {
    ProfilePictureSheetRef?.current?.hide();
  }, [selectImage, isDeleting]);

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
    const old_arr = selectImage;
    const new_arr = [{
                      index: index,
                      img: img
                    }];
    const selectImgArr = old_arr.concat(new_arr);
    
    setSelectImage(selectImgArr);
    setIndex(index + 1);
  };

  const removeImg = (img) => {
    const old_arr = selectImage;
    const new_arr = old_arr.filter(img_ => img_.index != img.index);
    
    setSelectImage(new_arr);

    if (new_arr.length < 1) {
      setIsDeleting(false);
    }
  };

  const imgContainer = (img) => {
    return (
      <TouchableOpacity 
        style={localStyles.deleteImg}
        onPress={() => {
          if (isDeleting) {
            removeImg(img)
          }
        }}
      >

        <View
          style={[localStyles.imageContainer,
            localStyles.newImg,
            localStyles.box,
            localStyles.container,
            isDeleting && localStyles.overlay]}
        >
          {isDeleting && (<Ionicons
            name={'trash-outline'}
            size={moderateScale(50)}
            color={colors.textColor}
            style={[styles.selfCenter, styles.mt10]}
          />)}
          <Image
            source={{
              width: size * 0.8,
              height: size * 0.8,
              uri: img.img.path
            }}
            resizeMode="cover"
            style={[localStyles.imageContainer, localStyles.box]}
          />
        </View>
      </TouchableOpacity>
    )
  }

  const onPressDelete = () => setIsDeleting(!isDeleting);

  const onPressPost = async () => {
    const profile_id = await getAsyncStorageData(ACCESS_TOKEN);

    const formData = new FormData();
    formData.append("description", text);
    formData.append("profile_id", profile_id.profile_id);
    formData.append("share_type", "POST");
    
    selectImage.forEach((value, index) => {
      const imageData = {
        uri: value.img.path,
        name: `img_${index}.jpg`,
        type: value.img.mime,
      }
      formData.append(`image_${index}`, imageData);
    });

    await createPost(formData)
      .then(resp => {
        if ("Error" in resp) {
          setIsSnackbarVisible(true);
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: StackNav.TabBar}],
          });
        }
      })
      .catch(err => console.log('Post error:', err));
  };

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

          {selectImage.length > 0 && (<TouchableOpacity 
            style={localStyles.image}
            onPress={onPressDelete}
          >
            <View
              style={[localStyles.imageContainer,
                      isDeleting && {backgroundColor: 'green'},
                      !isDeleting && {backgroundColor: 'darkred'}
                    ]}
            >
              <Ionicons
                name={
                        isDeleting 
                        ? 'checkmark-circle-outline' 
                        : 'close-circle-outline'
                      }
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
              {!isDeleting ? strings.deleteImg : strings.ready}
            </ZText>
          </TouchableOpacity>)}
        </View>

        <View style={localStyles.imgContainer}>
          <FlashList
            data={selectImage}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            renderItem={({item}) => imgContainer(item)}
            estimatedItemSize={size}
            extraData={isDeleting}
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
    ...styles.ml10,
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
  deleteImg: {
    width: 150,
    height: 150,
    position: 'relative',
  },
  box: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    zIndex: 9,
    opacity: 0.7,
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
