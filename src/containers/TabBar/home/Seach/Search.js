// Library import
import {FlatList, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo, useState} from 'react';
import {useSelector} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

// Local import
import ZSafeAreaView from '../../../../components/common/ZSafeAreaView';
import ZInput from '../../../../components/common/ZInput';
import strings from '../../../../i18n/strings';
import {Control} from '../../../../assets/svgs';
import {moderateScale} from '../../../../common/constants';
import {styles} from '../../../../themes';
import ZText from '../../../../components/common/ZText';
import SearchTop from './SearchTop';
import SearchUser from './SearchUser';
import SearchVideo from './SearchVideo';
import SearchSound from './SearchSound';
import SearchLive from './SearchLive';
import SearchHashtag from './SearchHashtag';
import {searchCategoryData} from '../../../../api/constant';

export default function Search() {
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
  const [isSelect, setIsSelect] = useState(0);

  const onSearchInput = text => setSearch(text);

  const SearchIcon = () => {
    return (
      <Feather name="search" size={moderateScale(20)} color={searchIconStyle} />
    );
  };

  const onHighlightInput = () => {
    setSearchInputStyle(FocusedStyle);
    setSearchIconStyle(FocusedIconStyle);
  };
  const onUnHighlightInput = () => {
    setSearchInputStyle(BlurredStyle);
    setSearchIconStyle(BlurredIconStyle);
  };

  const HeaderCategory = memo(({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setIsSelect(index)}
        style={[
          localStyles.root,
          {
            borderBottomColor:
              isSelect === index ? colors.primary : colors.dark3,
          },
        ]}>
        <ZText
          type={'s18'}
          align={'center'}
          style={styles.pb20}
          color={isSelect === index ? colors.primary : colors.grayScale7}>
          {item.title}
        </ZText>
      </TouchableOpacity>
    );
  });

  const RenderScene = () => {
    switch (isSelect) {
      case 0:
        return <SearchTop />;
      case 1:
        return <SearchUser />;
      case 2:
        return <SearchVideo />;
      case 3:
        return <SearchSound />;
      case 4:
        return <SearchLive />;
      case 5:
        return <SearchHashtag />;
      default:
        return null;
    }
  };

  return (
    <ZSafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={localStyles.rootContainer}>
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
          rightAccessory={() => <Control />}
        />
        <FlatList
          data={searchCategoryData}
          renderItem={({item, index}) => (
            <HeaderCategory item={item} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={localStyles.mainContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <RenderScene />
      </ScrollView>
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.ph20,
    ...styles.pb20,
  },
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  mainContainer: {
    ...styles.flexGrow,
    ...styles.mt15,
  },
  root: {
    borderBottomWidth: moderateScale(2),
    ...styles.ph25,
  },
});
