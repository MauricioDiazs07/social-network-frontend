// libraries import
import React, { useState, useEffect } from 'react';
import { StyleSheet,
         View,
         TouchableOpacity,
         RefreshControl,
         ScrollView,
         TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// local imports
import ZHeader from '../../../../components/common/ZHeader';
import ZSafeAreaView from '../../../../components/common/ZSafeAreaView';
import ZText from '../../../../components/common/ZText';
import ZCircle from '../../../../components/common/ZCircle';
import ZKeyBoardAvoidWrapper from '../../../../components/common/ZKeyBoardAvoidWrapper';
import { moderateScale, screenWidth, getHeight } from '../../../../common/constants';
import { StackNav } from '../../../../navigation/NavigationKeys';
import { styles } from '../../../../themes';
import ZButton from '../../../../components/common/ZButton';
import { editPost } from '../../../../api/feed/posts';
import typography from '../../../../themes/typography';

const EditPost = props => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const item = props.route.params.idPost;

  const renderPostImages = ({item}) => {
    return <FastImage source={{uri: item}} style={localStyles.postImage} />;
  };

  const onPressProfile = (userName, userImage, profileId) => {
    navigation.navigate(StackNav.ProfileDetail, {
      userName: userName,
      userImage: userImage, 
      profileId: profileId
    });
  };

  const [text, setText] = React.useState('');
  const [chars, setChars] = React.useState(0);
  const [value, onChangeText] = React.useState(item.text);
  const textLimit = 255;

  const onRefresh = () => navigation.reset({
    index: 0,
    routes: [{name: StackNav.TabBar}]
  });

  const onPressEditPost = async () => {
    await editPost(
      item.id,
      text
    )
    .then(
      navigation.reset({
        index: 0,
        routes: [{name: StackNav.TabBar}],
      })
    )
    .catch(error => console.log('Edit error:', error));
  };

  return (
    <ZSafeAreaView>
      <ZKeyBoardAvoidWrapper>
        <ScrollView
          refreshControl={
              <RefreshControl onRefresh={onRefresh}/>
          }
        >
          <View>
              <ZHeader />
              <View style={localStyles.headerContainer}>
              <TouchableOpacity
                  style={localStyles.profileContainer}
                  onPress={() => onPressProfile(item.name, item.profileImage, item.profileId)}
              >
                  <FastImage
                  source={{uri: item.profileImage}}
                  style={localStyles.profileImage}
                  />
                  <View>
                  <ZText type={'b16'}>{item.name}</ZText>
                  <ZText
                      type={'m14'}
                      color={colors.dark ? colors.grayScale4 : colors.grayScale7}>
                      {item.subtitle}
                  </ZText>
                  </View>
              </TouchableOpacity>
              </View>
              <View style={[styles.mr20, styles.ml20]}>
                <View style={localStyles.container}>
                  <TextInput
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
                    onChangeText={ val => {
                      onChangeText(val)
                      setText(val);
                      setChars(val.length);}
                    }
                    value={value}
                  />
                  <View>
                    <ZCircle
                      cx={25}
                      cy={25}
                      rx={20}
                      ry={20}
                      t1={1}
                      delta={chars}
                      phi={274}
                      limit={textLimit}
                    />
                  </View>
                </View>

              {item.multimedia.count > 0 && (
                  <View style={item.text !== '' ? styles.mt20 : styles.mt5}>
                  <FlashList
                      data={item.image}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={image => image}
                      horizontal
                      pagingEnabled
                      renderItem={renderPostImages}
                  />
                  </View>
              )}
              <View style={[localStyles.btnContainer]}>
                <ZButton
                 title={'Editar'}
                 textType={'b18'}
                 color={colors.white}
                 containerStyle={[
                  localStyles.skipBtnContainer
                   ]}
                 onPress={onPressEditPost}
                />
              </View>
              </View>
          </View>
        </ScrollView>
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default EditPost;

const localStyles = StyleSheet.create({
    headerContainer: {
      ...styles.rowSpaceBetween,
      ...styles.p10,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: moderateScale(48),
      height: moderateScale(48),
      borderRadius: moderateScale(24),
      ...styles.mr10,
    },
    postImage: {
      width: screenWidth - moderateScale(40),
      aspectRatio: 1,
      borderRadius: moderateScale(25),
    },
    container: {
      ...styles.rowSpaceBetween,
      ...styles.mt20,
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
    btnContainer: {
      ...styles.pv15,
      ...styles.mh20,
      ...styles.rowSpaceAround,
    },
    skipBtnContainer: {
      width: '45%',
    }
});
