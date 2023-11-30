// Libraries import
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import { Dropdown } from 'react-native-element-dropdown';

// Local import
import {styles} from '../../../themes';
import {
  isAndroid,
  moderateScale,
  screenFullHeight,
} from '../../../common/constants';
import {
  App_Logo,
} from '../../../assets/svgs';
import ZText from '../../../components/common/ZText';
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import { transformfPosts } from '../../../utils/_support_functions';
import { getAsyncStorageData } from '../../../utils/helpers';
import { PROFILE_ID, getHeight } from '../../../common/constants';
import { SearchingPosts, SearchPost } from '../../../assets/svgs';
import UserPost from './UserPostFeed/UserPost';
import { colors as clr } from '../../../themes';
import { getInterests } from '../../../api/auth/auth';
import { getPostsInterests } from '../../../api/feed/posts';

const LeftHeaderIcon = React.memo(() => {
  return (
    <View style={styles.pr10}>
      <App_Logo height={moderateScale(30)} width={moderateScale(30)} />
    </View>
  );
});

export default function ReelsComponent() {
  const colors = useSelector(state => state.theme.theme);
  const leftHeaderIcon = useMemo(() => <LeftHeaderIcon />, []);
  
  // posts variables
  const [postData, setPostData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLastPost, setIsLastPost] = useState(true);
  const [isNewPosts, setIsNewPosts] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [dropdownData, setDropdownData] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [interestID, setInterestID] = useState(null);
  const [interestSelected, setInterestSelected] = useState('');

  useEffect(() => {
    initFeed();
  }, []);

  const initFeed = async () => {
    let interestsResp = await getInterests();
    let newList = [];

    interestsResp.forEach((x) => {
      newList.push({ label: x['description'], value: x['id'] })
    });

    setDropdownData(newList);
  }

  const getPosts = async (item) => {
    setPostData([]);
    setIsNewPosts(true);
    setIsSearch(true);
    setIsLoaded(false);
    setInterestID(item['value']);
    setInterestSelected(item['label']);

    let userID = await getAsyncStorageData(PROFILE_ID);
    let postsIDs = getPostsIDs();
    
    setIsLastPost(false);
    
    await getPostsInterests(userID, postsIDs, item['value'])
    .then((resp) => {
            console.log("NEW POSTS", resp);
            let new_posts = resp["post"];
            if (new_posts.length > 0) {
              let new_posts_t = transformfPosts(new_posts, false);
              setPostData(new_posts_t);
            } else {
              setIsLoaded(true);
            }

            setTimeout(() => {
              setIsLastPost(true);
            }, 2000);
          }).catch(err => {
            setIsNewPosts(false);
            setIsLoaded(true);
          });
  }

  const getPostsIDs = () => {
    let postsIDs = [];
    postData.forEach((post) => {
      postsIDs.push(post["id"]);
    });

    return postsIDs;
  }

  const appendNewPosts = async () => {
    let userID = await getAsyncStorageData(PROFILE_ID);
    let postsID = getPostsIDs();

    if (isLastPost && isNewPosts) {
      setIsLastPost(false);

      await getPostsInterests(userID, postsID, interestID)
            .then((resp) => {
              let new_posts = resp["post"];
              if (new_posts.length > 0) {
                let new_posts_t = transformfPosts(new_posts, false);
                setPostData([...postData, ...new_posts_t]);
              } else {
                setIsLoaded(true);
              }

              setTimeout(() => {
                setIsLastPost(true);
              }, 2000);
            }).catch(err => setIsNewPosts(false));
    }
  }

  const selectPosts = () => {
    return (
      <View style={styles.p20}>
        <Dropdown
          style={[
            localStyles.dropdown,
            isFocus && { borderColor: colors.primary },
            {backgroundColor: colors.backgroundColor}
          ]}
          containerStyle={{backgroundColor: colors.backgroundColor}}
          itemTextStyle={{color: colors.textColor}}
          activeColor={colors.primary}
          placeholder={strings.chooseInterest}
          placeholderStyle={[localStyles.placeholderStyle, {backgroundColor: colors.backgroundColor, color: colors.textColor}]}
          selectedTextStyle={[localStyles.selectedTextStyle, {color: colors.textColor}]}
          inputSearchStyle={[localStyles.inputSearchStyle, {backgroundColor: colors.backgroundColor}]}
          data={dropdownData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={value}
          searchPlaceholder={`${strings.search}...`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => getPosts(item)}
        />
        <ZText 
          type="b24"
          align={'center'}
          style={styles.pt20}
          color={colors.primary}  
        >
          {interestSelected}
        </ZText>
      </View>
    );
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
      
  return (
    <ZSafeAreaView>
      <ZHeader
        isHideBack
        title={strings.appName}
        isLeftIcon={leftHeaderIcon}
      />
      <View style={{flex: 1}}>
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                appendNewPosts();
              }
            }}
          >
            {isSearch ? (postData.length > 0 ? (
              <View>
                <FlashList
                  data={postData}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => <UserPost item={item} dataLength={postData.length}/>}
                  ListHeaderComponent={selectPosts}
                  showsVerticalScrollIndicator={false}
                />

                {isNewPosts ? (
                  <View style={localStyles.loadingPosts}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>) :
                (
                  <View style={[localStyles.noPosts, styles.m20]}>
                    <ZText
                        type={'b16'}
                        color={clr.white}
                        align={'center'}
                        style={[localStyles.coverPhotoStyle]}
                      >
                        {strings.noPosts}
                    </ZText>
                  </View>
                )}

              </View>
              
            ) : !isLoaded ?
            (<View>
              {selectPosts()}
              <View style={localStyles.loadingPosts}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            </View>)
            : (
              <View>
                {selectPosts()}
                <View style={[styles.center, styles.p30]}>
                  <ZText type={'s28'} style={{textAlign: 'center'}}>
                    {strings.postsNotFound}
                  </ZText>
                  <View >
                    <SearchingPosts />
                  </View>
                </View>
              </View>
            )) : (
              <View>
                {selectPosts()}
                <View style={styles.center}>
                  <ZText type={'s28'} style={{textAlign: 'center'}}>
                    {strings.chooseInterestFromList}
                  </ZText>
                  <View style={styles.mt30}>
                    <SearchPost />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imageContainer: {
    height: '100%',
    width: '100%',
  },
  muteIcon: {
    position: 'absolute',
    top: screenFullHeight / 2 - moderateScale(30),
    ...styles.selfCenter,
    borderRadius: moderateScale(100),
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
  },
  topHeader: {
    position: 'absolute',
    top: isAndroid ? moderateScale(10) : moderateScale(50),
    left: moderateScale(20),
    right: 0,
    zIndex: 1,
    ...styles.pr10,
    ...styles.pt15,
  },
  headerCetegoryItemContainer: {
    ...styles.mh10,
    ...styles.pb15,
    borderBottomWidth: moderateScale(1),
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    ...styles.ph20,
    ...styles.flexRow,
    ...styles.itemsEnd,
  },
  userImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  musicImage: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    ...styles.mr25,
  },
  musicIcon1: {
    position: 'absolute',
    width: moderateScale(16),
    height: moderateScale(16),
    left: moderateScale(25),
    bottom: moderateScale(35),
  },
  musicContainer: {
    ...styles.rowCenter,
  },
  verticalContainer: {
    ...styles.ph5,
    ...styles.mb10,
    ...styles.pl10,
  },
  renderIconContainer: {
    ...styles.itemsCenter,
    ...styles.mt20,
  },
  itemContainer: {
    alignItems: 'center',
    ...styles.mr20,
  },
  rightBtns: {
    ...styles.mr10,
  },
  itemInnerContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(40),
  },
  itemImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    borderWidth: moderateScale(4),
  },
  itemUsername: {
    ...styles.mt10,
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  headerRightIcon: {
    ...styles.rowSpaceBetween,
    width: '20%',
    ...styles.mr20,
  },
  loadingPosts: {
    height: getHeight(200),
    ...styles.rowCenter
  },
  noPosts: {
    height: getHeight(50),
  },
  coverPhotoStyle: {
    position: 'absolute',
    bottom: moderateScale(10),
    ...styles.selfCenter,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
