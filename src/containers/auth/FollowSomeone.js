import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';

import { interestsList } from '../../api/constant';
import ZButton from '../../components/common/ZButton';
import ZHeader from '../../components/common/ZHeader';
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import InterestsComponent from '../../components/InterestsComponent';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {styles} from '../../themes';
import ZText from '../../components/common/ZText';
import {moderateScale} from '../../common/constants';
import ZSearch from '../../components/common/ZSearch';

const FollowSomeone = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabBar}],
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
              tag={item}
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
  }
});

export default FollowSomeone;
