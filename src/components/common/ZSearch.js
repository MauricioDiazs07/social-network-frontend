import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import ZInput from './ZInput';
import strings from '../../i18n/strings';
import {styles} from '../../themes';
import {moderateScale} from '../../common/constants';

const ZSearch = () => {
  const colors = useSelector(state => state.theme.theme);

  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };

  const BlurredIconStyle = colors.grayScale5;
  const FocusedIconStyle = colors.primary;

  const [search, setSearch] = useState('');
  const [searchInputStyle, setSearchInputStyle] = useState(BlurredStyle);
  const [searchIconStyle, setSearchIconStyle] = useState(BlurredIconStyle);
  const onSearchInput = text => setSearch(text);

  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };

  const SearchIcon = () => {
    return (
      <Feather name="search" size={moderateScale(20)} color={searchIconStyle} />
    );
  };

  return (
    <ZInput
      placeHolder={strings.search}
      _value={search}
      keyBoardType={'default'}
      autoCapitalize={'none'}
      insideLeftIcon={() => <SearchIcon />}
      toGetTextFieldValue={onSearchInput}
      inputContainerStyle={[
        {backgroundColor: colors.inputBg},
        localStyles.inputContainerStyle,
        searchInputStyle,
      ]}
      inputBoxStyle={localStyles.inputBoxStyle}
      _onFocus={onHighlightInput}
      onBlur={onUnHighlightInput}
    />
  );
};

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
});

export default ZSearch;
