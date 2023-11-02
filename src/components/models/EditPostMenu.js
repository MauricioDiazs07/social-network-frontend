// Library import
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Custom import
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';
import ZText from '../common/ZText';
import strings from '../../i18n/strings';

const EditPostMenu = props => {
  const {SheetRef, onPressEdit, onPressDelete, title, post, live} = props;
  const colors = useSelector(state => state.theme.theme);

  return (
    <ActionSheet
      ref={SheetRef}
      isGestureEnabled={true}
      indicatorStyle={{width: moderateScale(100)}}
      containerStyle={[
        localStyles.actionSheetContainer,
        {backgroundColor: colors.backgroundColor},
      ]}>
      <View style={localStyles.bottomContainer}>
        <ZText type={'M24'} color={colors.primary}>
          {strings.choose}
        </ZText>

        <TouchableOpacity
          style={[
            localStyles.contextContainer,
            {borderColor: colors.textColor},
          ]}
          onPress={onPressEdit}>
          <MaterialIcon
              name="pencil"
              size={moderateScale(26)}
              color={colors.textColor}
              style={localStyles.mr5}
          />         
          <ZText type={'s18'} style={styles.ml10}>
            {strings.editPost}
          </ZText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            localStyles.contextContainer,
            {borderColor: colors.textColor},
          ]}
          onPress={onPressDelete}>
          <MaterialIcon
            name="delete"
            size={moderateScale(26)}
            color={colors.textColor}
            style={styles.mr5}
          />
          <ZText type={'s18'} style={styles.ml10}>
            {strings.deletePost}
          </ZText>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

const localStyles = StyleSheet.create({
  actionSheetContainer: {
    ...styles.p20,
  },
  contextContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt20,
    ...styles.p15,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(15),
  },
  bottomContainer: {
    width: '100%',
    ...styles.selfCenter,
    paddingHorizontal: moderateScale(40),
    ...styles.mv30,
  } 
});

export default EditPostMenu;
