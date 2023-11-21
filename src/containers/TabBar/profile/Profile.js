// Library import
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {createRef, useState, useEffect} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import {useSelector} from 'react-redux';
import {styles} from '../../../themes';
import {getHeight, moderateScale, PROFILE_ID} from '../../../common/constants';
import ZText from '../../../components/common/ZText';
import {StackNav} from '../../../navigation/NavigationKeys';
import images from '../../../assets/images';
import SwitchAccont from '../../../components/models/SwitchAccont';
import FeedComponent from '../../../components/FeedComponent';
import ZHeader from '../../../components/common/ZHeader';
import { getAsyncStorageData } from '../../../utils/helpers';
import { getMasterData } from '../../../api/feed/interaction';
import {transformfPosts } from '../../../utils/_support_functions';

export default function Profile({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const switchAccountRef = createRef(null);

  const [feeds, setFeeds] = useState([]);
  const [masterData, setMasterData] = useState({
    description: '',
    name: '',
    profile_photo: '',
    shares: '',
    email: ''
  });

  useEffect(() => {
    getAsyncStorageData(PROFILE_ID).then(profileId => {
      getMasterData(profileId).then(idResp => {
        setMasterData(idResp);
        const postFeeds = transformfPosts(idResp);
        setFeeds(postFeeds);
      });
    });
  }, []);

  const onPressEditProfile = () => navigation.navigate(StackNav.AdminProfile);

  const renderReelItem = ({item}) => (
    <FeedComponent data={item} from={'admin'}/>
  );
  
  return (
    <ZSafeAreaView>
      <ZHeader />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={localStyles.root}>
        <View style={styles.itemsCenter}>
          <TouchableOpacity onPress={onPressEditProfile} style={styles.mt40}>
          {!!masterData.profile_photo?.length ? (
              <Image
                source={{
                  uri: masterData.profile_photo,
                }}
                style={localStyles.userImage}
              />
            ) : (
              <Image
                source={colors.dark ? images.userDark : images.userLight}
                style={localStyles.userImage}
              />
            )}
            <MaterialIcon
              name="pencil-box"
              size={moderateScale(30)}
              color={colors.primary}
              style={localStyles.editIcon}
            />
          </TouchableOpacity>
          <View style={styles.mv20}>
            <ZText type="b24" align={'center'}>
              {masterData.name}
            </ZText>
            <ZText type="m14" align={'center'} style={styles.mt10}>
              {masterData.email}
            </ZText>
            <ZText type="m14" align={'center'} style={styles.mt10}>
              {masterData.description}
            </ZText>
          </View>
        </View>
        <View
          style={[
            localStyles.mainContainer,
            {
              borderBottomColor: colors.bColor,
              borderBottomWidth: moderateScale(2),
            },
          ]}>
        </View>
        <View style={styles.postContainer}>
          <FlatList
            data={feeds}
            renderItem={renderReelItem}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.mt20}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </ScrollView>
      <SwitchAccont SheetRef={switchAccountRef} />
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  headerContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.alignCenter,
    ...styles.justifyBetween,
    ...styles.mt20,
  },
  userImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  buttonContainer: {
    ...styles.mt20,
    height: getHeight(45),
    width: '48%',
    borderRadius: moderateScale(22),
    borderWidth: moderateScale(1),
  },
  storiesContainer: {
    ...styles.mt15,
    ...styles.flexRow,
    height: moderateScale(100)
  },
  mainContainer: {
    ...styles.rowSpaceBetween,
    width: '100%',
    ...styles.mt15,
    alignSelf: 'center',
  },
  tabItemStyle: {
    width: '25%',
    ...styles.itemsCenter,
    ...styles.pv15,
    ...styles.rowSpaceBetween,
  },
  postContainer: {}
});
