// Libraries import
import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';

// Local import
import {Modal_Icon} from '../../assets/svgs';
import {moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import {commonColor, styles} from '../../themes';
import ZButton from '../common/ZButton';
import ZText from '../common/ZText';

const SuccessModal = props => {
  const colors = useSelector(state => state.theme.theme);

  const {
    visible,
    onPressModalClose,
    btnText = false,
    headerTitle,
    subTitle,
    itemImage,
  } = props;
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onPressModalClose}>
        <View style={localStyles.modalMainContainer}>
          <View style={[localStyles.root, {backgroundColor: colors.inputBg}]}>
            {itemImage || <Modal_Icon style={[styles.selfCenter, {width:'100%'}]} />}
            <TouchableOpacity onPress={onPressModalClose}>
              <ZText
                type={'b24'}
                color={colors.primary}
                align={'center'}
                style={styles.mt25}>
                {headerTitle || strings.congratulations}
              </ZText>
            </TouchableOpacity>
            <ZText type={'r16'} align={'center'} style={styles.mt25}>
              {subTitle || strings.modalDesc}
            </ZText>
            {!!btnText && (
              <ZButton
                title={btnText}
                textType={'b18'}
                color={colors.textColor}
                containerStyle={localStyles.signBtnContainer}
                onPress={onPressModalClose}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.p30,
    ...styles.m25,
    borderRadius: moderateScale(15),
    // ...styles.itemsCenter,
  },
  modalMainContainer: {
    ...styles.flex,
    ...styles.center,
    backgroundColor: commonColor.modalBg,
  },
  signBtnContainer: {
    ...styles.mt20,
  },
});

export default SuccessModal;
