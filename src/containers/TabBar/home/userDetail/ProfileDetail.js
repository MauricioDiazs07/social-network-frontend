// Library import
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import ZSafeAreaView from '../../../../components/common/ZSafeAreaView';
import ZHeader from '../../../../components/common/ZHeader';
import {getHeight, moderateScale} from '../../../../common/constants';
import {styles} from '../../../../themes';
import ZText from '../../../../components/common/ZText';
import images from '../../../../assets/images';
import ZButton from '../../../../components/common/ZButton';
import { LikeIconModal } from '../../../../assets/svgs';
import {StackNav} from '../../../../navigation/NavigationKeys';
import SuccessModal from '../../../../components/models/SuccessModal';
import FeedComponent from '../../../../components/FeedComponent';
import { getMasterData } from '../../../../api/feed/interaction';
import {transformpHistoy, transformfPosts, transformFeed } from '../../../../utils/_support_functions';

export default function ProfileDetail({navigation, route}) {
  const {userName, userImage, profileId} = route.params;
  const colors = useSelector(state => state.theme.theme);
  const [modalVisible, setModalVisible] = useState(false);

  const [masterData, setMasterData] = useState({
    description: '',
    name: '',
    profile_photo: '',
    shares: '',
  });

  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    getMasterData(profileId).then(resp =>{
      setMasterData(resp);
      const new_history = transformpHistoy(resp);
      // const feeds = transformFeed(resp);
      // setHistoryData(new_history);
      // setFeeds(feeds);
      const postFeeds = transformfPosts(resp['post']);
      setFeeds(postFeeds);
    })
  }, []);

  const onPressEditProfile = () => navigation.navigate(StackNav.UserNetwork);
  const onPressModalClose = () => setModalVisible(false);

  const onPressMessage = () =>
    navigation.navigate(StackNav.Chat, {
      userName: userName,
      userImage: userImage,
    });

    const renderReelItem = ({item}) => (
      <FeedComponent data={item} from={'user'}/>
    );
  return (
    <ZSafeAreaView>
      <ZHeader title={userName} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={localStyles.root}>
        <View style={styles.itemsCenter}>
          <TouchableOpacity onPress={onPressEditProfile} style={styles.mt25}>
            {!!userImage?.length ? (
              <Image
                source={{
                  uri: userImage,
                }}
                style={localStyles.userImage}
              />
            ) : (
              <Image
                source={colors.dark ? images.userDark : images.userLight}
                style={localStyles.userImage}
              />
            )}
          </TouchableOpacity>
          <View style={styles.mv20}>
            <ZText type="b24" align={'center'}>
              {userName}
            </ZText>
            <ZText type="s14" align={'center'} style={styles.mt10}>
              {masterData.description}
            </ZText>
          </View>
        </View>
        <View style={styles.rowSpaceBetween}>
          <ZButton
            title={strings.follow}
            onPress={onPressEditProfile}
            color={colors.white}
            textType="b14"
            style={styles.ml5}
            containerStyle={[
              localStyles.buttonContainer,
              {borderColor: colors.primary},
            ]}
            bgColor={colors.primary}
            frontIcon={
              <Ionicons
                name="person-add-outline"
                size={moderateScale(18)}
                color={colors.white}
              />
            }
          />
          <ZButton
            title={strings.message}
            color={colors.primary}
            onPress={onPressMessage}
            textType="b14"
            style={styles.ml5}
            containerStyle={[
              localStyles.buttonContainer,
              {borderColor: colors.primary},
            ]}
            bgColor={colors.tranparent}
            frontIcon={
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={moderateScale(18)}
                color={colors.primary}
              />
            }
          />
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
        <FlatList
          data={feeds}
          renderItem={renderReelItem}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.mt20}
        />
      </ScrollView>
      <SuccessModal
        visible={modalVisible}
        onPressModalClose={onPressModalClose}
        headerTitle={'27M Total Likes'}
        subTitle={'jenny_wilson received a total of 27M likes from all videos.'}
        itemImage={<LikeIconModal style={styles.selfCenter} />}
        btnText={'Ok'}
      />
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
  editProfileContainer: {
    ...styles.flexRow,
    ...styles.justifyEvenly,
    ...styles.mt25,
  },
  buttonContainer: {
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
  },
  tabItemStyle: {
    borderBottomWidth: moderateScale(2),
    width: '25%',
    ...styles.itemsCenter,
    ...styles.pv15,
    ...styles.rowSpaceBetween,
  },
  bgImg: {
    width: '100%',
    height: moderateScale(120),
    position: 'absolute'
  },
});
