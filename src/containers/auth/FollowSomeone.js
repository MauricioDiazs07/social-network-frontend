// libraries import
import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';
import {Snackbar, Button} from '@react-native-material/core';

// local import
import ZButton from '../../components/common/ZButton';
import ZHeader from '../../components/common/ZHeader';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import {moderateScale, getHeight} from '../../common/constants';
import ZSearch from '../../components/common/ZSearch';
import { signUp, getAuthToken, getInterests, updateInterests } from '../../api/auth/auth';
import { getProfileData } from '../../api/feed/interaction';
import { USER_LEVEL, ACCESS_TOKEN } from '../../common/constants';
import { getAccessLevel } from '../../utils/_support_functions';
import { setAsyncStorageData } from '../../utils/helpers';

const FollowSomeone = props => {
  const {navigation} = props;
  const colors = useSelector(state => state.theme.theme);
  const usserCred = props.route.params.usser;
  const userPhone = usserCred['phone'];
  const [interestsList, setInterestsList] = React.useState();
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    new Promise((resolve, reject) => {
      getInterests()
      .then(resp => {
        setInterestsList(resp);
      });
    })
  }, []);

  function InterestsComponent({
    tag, id
  }) {
    const [isFollow, setIsFollow] = useState(false);
    const index = interests.indexOf(id);
  
    const onPressFollow = () => {
      setIsFollow(!isFollow);

      if (isFollow) {
        if (index > -1) {
          interests.splice(index, 1);
        }
      } else {
        interests.push(id);
      }
      // TODO: Check functionality of this list
      console.log("INT", interests);
    };
  
    return (
      <View style={localStyles.rootContainer}>
        <ZButton
          title={tag}
          color={isFollow ? colors.white : colors.primary}
          textType="b14"
          containerStyle={[
            localStyles.buttonContainer,
            {borderColor: colors.primary},
          ]}
          bgColor={isFollow ? colors.primary : colors.tranparent}
          onPress={onPressFollow}
        />
      </View>
    );
  }

  const onPressContinue = () => {
    navigation.navigate(StackNav.PhoneValidation, {
      phone: userPhone
    });
  };

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.interests} />
      <View style={localStyles.innerHeader}>
        <ZText type={'r16'}>{strings.interestsDescription}</ZText>
        <ZSearch />
      </View>
      <View
        style={localStyles.interestsList}
      >
        <FlashList
          data={interestsList}
          renderItem={({item}) => (
            <InterestsComponent
              tag={item['description']}
              id={item['id']}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.listContainer}
        />
      </View>
      <View style={localStyles.btnContainer}>
        <ZButton
          title={strings.continue}
          textType={'b18'}
          color={colors.white}
          containerStyle={localStyles.skipBtnContainer}
          onPress={onPressContinue}
        />
      </View>

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

      <View
        style={[localStyles.loadingScreen, !isLoading && {display: 'none'}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  btnContainer: {
    ...styles.p20,
    ...styles.rowSpaceAround,
  },
  skipBtnContainer: {
    width: '90%',
  },
  listContainer: {
    ...styles.ph20,
    ...styles.flex
  },
  innerHeader: {
    ...styles.ph20,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  interestsList: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
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
  rootContainer: {
    ...styles.rowSpaceAround,
    ...styles.mt15,
  },
  userItem: {
    flex: 1,
    ...styles.rowCenter,
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    resizeMode: 'cover',
  },
  userDescription: {
    ...styles.mh10,
    ...styles.flex,
  },
  buttonContainer: {
    ...styles.ph15,
    height: getHeight(45),
    borderRadius: moderateScale(17),
    borderWidth: moderateScale(1),
  },
});

export default FollowSomeone;
