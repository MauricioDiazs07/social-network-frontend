// Library Imports
import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';
import {useSelector} from 'react-redux';

//Local Imports
import ZText from '../components/common/ZText';
import images from '../assets/images';
import {styles} from '../themes';
import {
  APP_OPEN_FIRST_TIME,
  getHeight,
  moderateScale,
} from '../common/constants';
import {StackNav} from '../navigation/NavigationKeys';
import {setAsyncStorageData} from '../utils/helpers';
import ZButton from '../components/common/ZButton';

const TutorialItem = ({data}) => {
  const colors = useSelector(state => state.theme.theme);
  return (
    <View
      style={[
        localStyles.tutorialContainer,
        {backgroundColor: colors.backgroundColor},
      ]}>
      <Image source={data.image} style={localStyles.tutorialImage} />
      <View style={localStyles.headerContainer}>
        <ZText type={'b36'} align={'center'}>
          {data.title}
        </ZText>
        <ZText type={'r16'} align={'center'} style={styles.mt20}>
          {data.desc}
        </ZText>
      </View>
      <ZButton
        textType={'b18'}
        title={data.btnTitle}
        onPress={data.onPress}
        containerStyle={localStyles.btnContainerStyle}
      />
    </View>
  );
};

const OnBoarding = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const OnBoardingData = {
    tutorialText1: {
      id: 1,
      title: 'La mejor red social',
      image: images.onBoardingLight1,
      desc: 'La mejor aplicación para poder conocer a los influencers.',
      btnTitle: 'Siguiente',
      onPress: () => onPressNext(),
    },
    tutorialText2: {
      id: 2,
      title: 'Facilidad de conexión',
      desc: 'La aplicación que permite tener más acercamiento con los influencers.',
      image: images.onBoardingLight2,
      btnTitle: 'Siguiente',
      onPress: () => onPressNext(),
    },
    tutorialText3: {
      id: 3,
      title: 'Todo lo puedes hacer en esta aplicación',
      desc: 'Una plataforma que reúne características para conectar.',
      image: images.onBoardingLight3,
      btnTitle: 'Comenzar',
      onPress: () => onPressGetStarted(),
    },
  };

  const onPressGetStarted = async () => {
    await setAsyncStorageData(APP_OPEN_FIRST_TIME, 'firstTimeOpen');
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.Auth}],
    });
  };

  const onPressNext = () => {
    swiper.scrollBy(1);
  };

  return (
    <Swiper
      ref={ref => (swiper = ref)}
      showsButtons={false}
      loop={false}
      activeDotStyle={[
        localStyles.activeDotStyle,
        {backgroundColor: colors.primary},
      ]}
      dotStyle={[localStyles.dotStyle, {backgroundColor: colors.white}]}
      paginationStyle={localStyles.paginationStyle}>
      <TutorialItem data={OnBoardingData.tutorialText1} />
      <TutorialItem data={OnBoardingData.tutorialText2} />
      <TutorialItem data={OnBoardingData.tutorialText3} />
    </Swiper>
  );
};

export default OnBoarding;

const localStyles = StyleSheet.create({
  tutorialContainer: {
    ...styles.flex,
    ...styles.justifyCenter,
  },
  tutorialImage: {
    resizeMode: 'contain',
    height: getHeight(350),
    width: '75%',
    ...styles.mt50,
    ...styles.selfCenter,
    ...styles.flex,
  },
  paginationStyle: {
    bottom: getHeight(150),
  },
  btnContainerStyle: {
    ...styles.m25,
    bottom: getHeight(30),
  },
  dotStyle: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(10),
    ...styles.mh5,
  },
  activeDotStyle: {
    width: moderateScale(25),
    height: moderateScale(8),
  },
  headerContainer: {
    bottom: getHeight(100),
    ...styles.mh15,
    ...styles.pt40,
    ...styles.itemsCenter,
    ...styles.justifyEnd,
  },
});
