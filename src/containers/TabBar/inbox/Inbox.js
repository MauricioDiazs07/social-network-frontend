// Libraries import
import {
  Image,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import ZText from '../../../components/common/ZText';
import {inboxData} from '../../../api/constant';
import images from '../../../assets/images';
import ZHeader from '../../../components/common/ZHeader';

export default function Inbox() {
  const colors = useSelector(state => state.theme.theme);

  const RenderInboxItem = ({item}) => {
    return (
      <TouchableOpacity style={localStyles.renderItemCoontainer}>
        <View>
          {!!item?.profileImage ? (
            <Image
              source={{
                uri: item.profileImage,
              }}
              style={localStyles.userImage}
            />
          ) : (
            <Image
              source={colors.dark ? images.userDark : images.userLight}
              style={localStyles.userImage}
            />
          )}
        </View>
        <View style={[styles.mh10, styles.flex]}>
          <ZText type="b18" numberOfLines={1}>
            {item.name}
          </ZText>
          <ZText type="m14" numberOfLines={2} style={styles.mt5}>
            {item.desc}
          </ZText>
        </View>
        {!!item.follow ? (
          <TouchableOpacity
            style={[localStyles.followBtn, {backgroundColor: colors.primary}]}>
            <ZText type="b14" color={colors.white}>
              {item.follow}
            </ZText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Image source={images.post} style={localStyles.postImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const RenderHeader = ({title}) => {
    return (
      <View
        style={[localStyles.titleContainer, {borderTopColor: colors.bColor}]}>
        <ZText type={'b20'}>{title}</ZText>
      </View>
    );
  };

  return (
    <ZSafeAreaView>
      <ZHeader
        title={'Activity'}
        rightIcon={
          <Ionicons
            name="ellipsis-horizontal-circle-outline"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        }
      />
      <SectionList
        sections={inboxData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <RenderInboxItem item={item} key={item.id} />}
        renderSectionHeader={({section: {title}}) => (
          <RenderHeader title={title} />
        )}
        stickyHeaderHiddenOnScroll={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ph20}
      />
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pt20,
    ...styles.ph20,
    ...styles.pb10,
  },
  userImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  postImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    backgroundColor: 'green',
    borderRadius: moderateScale(12),
  },
  followBtn: {
    ...styles.ph20,
    ...styles.pv10,
    borderRadius: moderateScale(30),
  },
  modalMainContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  root: {
    ...styles.p20,
  },
  itemContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mv15,
  },
  selectIocn: {
    position: 'absolute',
    right: 0,
  },
  titleContainer: {
    ...styles.pt10,
    ...styles.mb20,
  },
  renderItemCoontainer: {
    ...styles.rowCenter,
    ...styles.mb15,
  },
});
