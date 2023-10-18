// Library Imports
import {Button, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

// Local Imports
import { styles } from '../../../themes';
import ZHeader from '../../../components/common/ZHeader';
import ZText from '../../../components/common/ZText';
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';

const MasterHome = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  return (
    <ZSafeAreaView style={localStyles.root}>
      <ZHeader />
      <ZText>Hola mundo!</ZText>
    </ZSafeAreaView>
  );
};

export default MasterHome;

const localStyles = StyleSheet.create({
  design: {
    ...styles.ph20,
  }
});
