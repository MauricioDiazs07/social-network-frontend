// library imports
import { View,
        TouchableOpacity,
        StyleSheet,
        ScrollView,
        RefreshControl,
        ActivityIndicator,
        processColor } from 'react-native';
import React, { useMemo, createRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PieChart } from 'react-native-charts-wrapper';
import { Dropdown } from 'react-native-element-dropdown';
import { BarChart } from 'react-native-charts-wrapper';

// local imports
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import { getHeight, moderateScale } from '../../../common/constants';
import {
  App_Logo,
  StoryAddIcon,
  Profile_Dark,
  Profile_Light
} from '../../../assets/svgs';
import {styles} from '../../../themes';
import ZHeader from '../../../components/common/ZHeader';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';
import UserStories from './UserStory/UserStories';
import UserPost from './UserPostFeed/UserPost';
import ZText from '../../../components/common/ZText';
import LogOut from '../../../components/models/LogOut';
import { USER_LEVEL, THEME, PROFILE_ID, PROFILE_PHOTO } from '../../../common/constants';
import { getAsyncStorageData, setAsyncStorageData } from '../../../utils/helpers';
import { changeThemeAction } from '../../../redux/action/themeAction';
import { colors as clr } from '../../../themes';
import { getFeed } from '../../../api/feed/posts';
import { transformfHistoy, transformFeed } from '../../../utils/_support_functions';
import { SearchingPosts } from '../../../assets/svgs';
import { getGeneralData,
  getSectionData,
  getInterestsData,
  getInteractionData } from '../../../api/master/masterData';
  import { transformfPosts } from '../../../utils/_support_functions';
  import { getMasterData } from '../../../api/feed/interaction';
  import images from '../../../assets/images';

const LogOutSheetRef = createRef();
const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();
const onPressCancel = () => LogOutSheetRef?.current?.hide();
let user_access = '';

const getUserLevel = async () => {
  await AsyncStorage.getItem(USER_LEVEL)
    .then((data) => {
      user_access = JSON.parse(data);
    }).catch(err => console.log("ERROR:", err));
};

const UserProfile = React.memo(() => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [profilePhoto, setProfilePhoto] = useState();
  
  useEffect(() => {
    getAsyncStorageData(PROFILE_PHOTO).then(photo => {
        setProfilePhoto(photo);
    });
  }, []);

  const onPressHistoryIcon = () => {
    navigation.navigate(StackNav.HistoryDetail);
  };
  

  return (
    <TouchableOpacity 
        onPress={onPressHistoryIcon}
        style={localStyles.rightBtns}
      >
      <View style={localStyles.itemContainer}>
            <View style={localStyles.itemInnerContainer}>
              {
                profilePhoto == null ? 
                (
                  <FastImage
                    source={colors.dark ? images.userDark : images.userLight}
                    style={[
                      localStyles.itemImage,
                      {
                        borderWidth: 0,
                      },
                    ]}
                  />
                ) : (
                  <FastImage
                    source={{uri: profilePhoto}}
                    style={[
                      localStyles.itemImage,
                      {
                        borderWidth: 0,
                      },
                    ]}
                  />
                )
              }
              
              <StoryAddIcon
                style={localStyles.addIcon}
                width={moderateScale(25)}
                height={moderateScale(25)}
              />
            </View>
            <ZText type={'s14'} style={localStyles.itemUsername} color={colors.white}>
              {strings.you}
            </ZText>
          </View>

      </TouchableOpacity>
    
  );
});

const RightHeaderIcons = React.memo(() => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);
  const [userAccess, setUserAccess] = useState('');

  useEffect(() => {
    getUserAccess();
    getUserLevel();
  });

  const getUserAccess = async () => {
    let storageResp = await AsyncStorage.getItem(USER_LEVEL);
    user_access = JSON.parse(storageResp);
    setUserAccess(user_access);
  }

  const onPressProfileIcon = () => {
    if (user_access == 'user') {
      navigation.navigate(StackNav.UserProfile);
    }
    else if (user_access == 'admin') {
      navigation.navigate(StackNav.Profile);
    }
  };

  const onPressThemeBtn = async () => {
    if (isDark) {
      await setAsyncStorageData(THEME, 'dark');
      dispatch(changeThemeAction(clr.dark));
    } else {
      await setAsyncStorageData(THEME, 'light');
      dispatch(changeThemeAction(clr.light));
    }

    setIsDark(!isDark);
  };

  return (
    <View style={localStyles.headerRightIcon}>
      {userAccess !== "master" && (<TouchableOpacity 
        onPress={onPressProfileIcon}
        style={localStyles.rightBtns}
      >
        {colors.dark ? (
          <Profile_Dark
            width={moderateScale(28)}
            height={moderateScale(28)}
          />
        ) : (
          <Profile_Light
            width={moderateScale(28)}
            height={moderateScale(28)}
          />
        )}

      </TouchableOpacity>)}

      <TouchableOpacity
        onPress={onPressThemeBtn}
        style={localStyles.rightBtns}>
        <MaterialIcon
            name="theme-light-dark"
            size={moderateScale(30)}
            color={colors.dark ? colors.white : colors.darkColor}
            style={localStyles.editIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressLogOutBtn}
        style={localStyles.rightBtns}>
        <Ionicons
          name={'log-out-outline'}
          size={moderateScale(30)}
          color={colors.dark ? colors.white : colors.darkColor}
        />
      </TouchableOpacity>
    </View>
  );
});

const LeftHeaderIcon = React.memo(() => {
  return (
    <View style={styles.pr10}>
      <App_Logo height={moderateScale(30)} width={moderateScale(30)} />
    </View>
  );
});

const Home = () => {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const rightHeaderIcon = useMemo(() => <RightHeaderIcons />, []);
  const leftHeaderIcon = useMemo(() => <LeftHeaderIcon />, []);
  
  // posts variables
  const [postData, setPostData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLastPost, setIsLastPost] = useState(true);
  const [isNewPosts, setIsNewPosts] = useState(true);
  // charts variables
  const [pageNumber, setPageNumber] = useState(1);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [pieChartLabel, setPieChartLabel] = useState('');
  const [pieData, setPieData] = useState([]);
  const [pieDataLength, setPieDataLength] = useState(null);
  const [isGeneralInteraction, setIsGeneralInteraction] = useState(true);
  const [barChartLegend, setBarChartLegend] = useState({});
  const [barChartConfig, setBarChartConfig] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [barChartLabels, setBarChartLabels] = useState([]);
  const [dropdownData, setDropdownData] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    let user_level = await getAsyncStorageData(USER_LEVEL);
    if (user_level !== "master") {
      getPostsList();
    } else {
      getData();
    }
  }

  const getPostsList = async () => {
    let userID = await getAsyncStorageData(PROFILE_ID);
    let userInfo = await getMasterData(userID);

    let feed_ = await getFeed(userID, []);
    if (feed_["HISTORY"].length > 0) {
      const new_history = transformfHistoy(feed_['HISTORY']);
      setHistoryData(new_history);
    }
    if (feed_["POST"].length > 0) {
      let new_posts = transformfPosts(userInfo, userID, feed_["POST"]);
      setPostData(new_posts);
    }

    setIsLoaded(true);
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
    let userInfo = await getMasterData(userID);

    if (isLastPost && isNewPosts) {
      setIsLastPost(false);

      await getFeed(userID, postsID)
            .then((resp) => {
              let new_posts = resp["POST"];
              if (new_posts.length > 0) {
                let new_posts_t = transformfPosts(userInfo, userID, new_posts);
                setPostData([...postData, ...new_posts_t]);
              } else {
                setIsNewPosts(false);
              }

              setTimeout(() => {
                setIsLastPost(true);
              }, 2000);
            });
    }
  }

  const getData = async (index = 1) => {
    setIsChartLoading(true);

    let generalData = await getGeneralData();
    
    let ddItems = [];
    if (index === 1) {
      let genderList = formatGenderData(generalData['gender']);
      setPieData(genderList);
    }
    if (index === 2) {
      setBarChartParameters(generalData['age']);
    }
    if (index === 3) {
      ddItems = getDropdownItems(generalData['section']['array']);
      setBarChartParameters(generalData['section']['data']);
    }
    if (index === 4) {
      ddItems = getDropdownItems(generalData['interests']['array']);
      setBarChartParameters(generalData['interests']['data']);
    }
    if (index === 5) {
      ddItems = getDropdownItems(generalData['section']['array']);
      countAcceptanceData(generalData['acceptance']);
      setPieData(generalData['acceptance']);
    }

    setDropdownData(ddItems);
    setValue(null);
    setIsChartLoading(false);
  }

  const formatInteractionData = (sectionData) => {
    let newData = [];
    let colors = [processColor('green'), processColor('red'), processColor('blue')];

    sectionData.forEach((data, index) => {
        let values = [];
        let color = colors[index];

        data['data'].forEach((sentimentData) => {
          values.push(sentimentData['y']);
        });

        let obj_ = {
          values: values,
          label: data['feeling'],
          config: {
            drawValues: false,
            colors: [color],
          }
        }
        newData.push(obj_);
    });

    return newData;
  }

  const getInterestsLabels = (interactionData) => {
    let interests_ = [];
    interactionData[0]['data'].forEach((el) => {
      interests_.push(el['marker']);
    });

    return interests_;
  }

  const getSectionChartData = async (section) => {
    let sectionData = await getSectionData(section);
    setBarChartParameters(sectionData['interests']);
  }

  const getInterestChartData = async (interest) => {
    let interestsData = await getInterestsData(interest);
    setBarChartParameters(interestsData['section']);
  }

  const getInteractionChartData = async (section) => {
    let sectionData = await getInteractionData(section);
    let interSectionData = formatInteractionData(sectionData['acceptance']);
    let interestsLabels = getInterestsLabels(sectionData['acceptance']);

    setInteractionBarChartParameters(interSectionData, interestsLabels);
    setIsGeneralInteraction(false);
  }

  const changePage = (index) => {
    if (index == pageNumber) {
      return;
    }
    if (index == 5) {
      setIsGeneralInteraction(true);
    }
    getData(index);
    setPageNumber(index);
    setPieChartLabel('');
  }

  const formatGenderData = (genderData) => {
    let sum_ = 0;

    genderData.forEach((x) => {
      if (x['label'] == 'M') {
        x['label'] = 'Mujeres';
      } else if (x['label'] == 'H') {
        x['label'] = 'Hombres';
      }
      sum_ += x['value'];
    });

    setPieDataLength(sum_);

    return genderData;
  }

  const countAcceptanceData = (acceptanceData) => {
    let sum_ = 0;

    acceptanceData.forEach((x) => {
      sum_ += x['value'];
    });

    setPieDataLength(sum_);
  }

  const getDropdownItems = (valuesList) => {
    let newList = [];

    valuesList.forEach((x, index) => {
      newList.push({ label: x, value: index })
    });

    return newList;
  } 

  const setBarChartParameters = (ageData) => {
    const labelsList = [];

    ageData.forEach((x) => {
      labelsList.push(x['marker']);
    });

    let newData = [{
      values: ageData,
      label: '',
      config: {
        color: processColor(colors.primary),
        barShadowColor: processColor(colors.grayScale1),
        highlightAlpha: 90,
        highlightColor: processColor('red'),
        valueTextColor: processColor(colors.textColor),
      }
    }];

    let config = {
      barWidth: 0.7,
    };

    setBarChartData(newData);
    setBarChartLabels(labelsList);
    setBarChartConfig(config);
    setBarChartLegend(false);
  }

  const setInteractionBarChartParameters = (interactionData, interestsLabels) => {
    let config = {
      barWidth: 0.2,
      group: {
        fromX: -0.5,
        groupSpace: 0.1,
        barSpace: 0.1,
      },
    };

    setBarChartData(interactionData);
    setBarChartLabels(interestsLabels);
    setBarChartConfig(config);
    setBarChartLegend(true);
  }

/* Charts states */
const pieState = {
  legend: {
    enabled: true,
    textSize: 15,
    form: 'CIRCLE',
    textColor: processColor(colors.textColor),

    horizontalAlignment: "CENTER",
    verticalAlignment: "BOTTOM",
    orientation: "VERTICAL",
    wordWrapEnabled: true
  },
  data: {
      dataSets: [{
          values: pieData,
          label: '',
          config: {
            colors: [processColor('#FF38E4'), processColor('#478BFF'), processColor('#38FF6D')],
            valueTextSize: 20,
            valueTextColor: processColor(colors.textColor),
            sliceSpace: 2,
            selectionShift: 13,
            valueFormatter: "#.#'%'",
            valueLineColor: processColor(colors.textColor),
            valueLinePart1Length: 0.5
          }
        }],
  },
  highlights: [{x:2}],
  description: {
    text: '',
    textSize: 15,
    textColor: processColor('darkgray'),
  }
};

const barState = {
  legend: {
    enabled: barChartLegend,
    textSize: 14,
    form: "SQUARE",
    formSize: 14,
    xEntrySpace: 10,
    yEntrySpace: 5,
    wordWrapEnabled: true,
    textColor: processColor(colors.textColor)
  },
  data: {
    dataSets: barChartData,
    config: barChartConfig
  },
  highlights: [{x: 3}, {x: 6}],
  xAxis: {
    valueFormatter: barChartLabels,
    granularityEnabled: true,
    granularity : 1,
    textColor: processColor(colors.textColor),
    labelRotationAngle: 60,
    position: 'BOTTOM',
    drawGridLines: false,
    drawAxisLine: false
  },
  yAxis: {
    right: {
      enabled: false
    },
    left: {
      enabled: true,
      granularityEnabled: true,
      granularity : 1,
      textColor: processColor(colors.textColor),
      drawGridLines: true,
      gridLineWidth: 1,
      drawAxisLine: true,
      drawLabels: true,
      labelCount: 1,
      position: "OUTSIDE_CHART",
      textSize: 10 
    }
  },
  description: {
    text: ''
  }
};

  const onRefresh = () => navigation.reset({
                                          index: 0,
                                          routes: [{name: StackNav.TabBar}]
                                        });

  const onPressYesLogOut = async () => {
    try {
      await AsyncStorage.clear();
      LogOutSheetRef?.current?.hide();
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: StackNav.Auth}],
        });
      }, 500);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const headerStory = () => {
    return (
      <UserStories ListHeaderComponent={<UserProfile/>} stories={historyData} />
    );
  };

  const setCenterPieChartLabel = (label, value) => {
    if (label === undefined) {
      setPieChartLabel('');
      return;
    }

    const percentage = Math.round((value / pieDataLength) * 1000) / 10;
    const text = `${percentage}%\n${label}`;
    setPieChartLabel(text);
  }

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
        rightIcon={rightHeaderIcon}
        isLeftIcon={leftHeaderIcon}
      />
      <View style={{flex: 1}}>
          {user_access !== "master" && (
          <ScrollView 
            refreshControl={
              <RefreshControl onRefresh={onRefresh} />
            }
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                appendNewPosts();
              }
            }}
          >
            {postData.length > 0 ? (
              <View>
                <FlashList
                  data={postData}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => <UserPost item={item} dataLength={postData.length}/>}
                  ListHeaderComponent={headerStory}
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
              {headerStory()}
              <View style={localStyles.loadingPosts}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            </View>)
            : (
              <View>
                {headerStory()}
                <View style={[styles.center, styles.p30]}>
                  <ZText type={'s28'} style={{textAlign: 'center'}}>
                    {strings.postsNotFound}
                  </ZText>
                  <View >
                    <SearchingPosts />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>)}
    
          {user_access === "master" && (
            <View style={{flex: 1, padding: 10}}>
              <View>
                <ZText type={'s28'} style={styles.mb10}>{strings.master}</ZText>
              </View>
              
              {/* Buttons layer */}
              <View style={localStyles.imgContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <TouchableOpacity 
                    style={localStyles.image}
                    onPress={() => changePage(1)}
                  >
                    <View
                      style={[localStyles.imageContainer,
                              pageNumber === 1 && {backgroundColor: colors.primary},
                              pageNumber !== 1 && {backgroundColor: '#555555'}]}
                    >
                      <Ionicons
                        name={'male-female-outline'}
                        size={moderateScale(45)}
                        color={clr.textColor}
                        style={[styles.selfCenter, styles.mt10]}
                      />
                    </View>
                    <ZText
                      type={'b16'}
                      color={clr.white}
                      align={'center'}
                      style={localStyles.coverPhotoStyle}>
                      {strings.gender}
                    </ZText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={localStyles.image}
                    onPress={() => changePage(2)}
                  >
                    <View
                      style={[localStyles.imageContainer,
                              pageNumber === 2 && {backgroundColor: colors.primary},
                              pageNumber !== 2 && {backgroundColor: '#555555'}]}
                    >
                      <Ionicons
                        name={'people'}
                        size={moderateScale(45)}
                        color={clr.textColor}
                        style={[styles.selfCenter, styles.mt10]}
                      />
                    </View>
                    <ZText
                      type={'b16'}
                      color={clr.white}
                      align={'center'}
                      style={localStyles.coverPhotoStyle}>
                      {strings.age}
                    </ZText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={localStyles.image}
                    onPress={() => changePage(3)}
                  >
                    <View
                      style={[localStyles.imageContainer,
                              pageNumber === 3 && {backgroundColor: colors.primary},
                              pageNumber !== 3 && {backgroundColor: '#555555'}]}
                    >
                      <Ionicons
                        name={'navigate'}
                        size={moderateScale(45)}
                        color={clr.textColor}
                        style={[styles.selfCenter, styles.mt10]}
                      />
                    </View>
                    <ZText
                      type={'b16'}
                      color={clr.white}
                      align={'center'}
                      style={localStyles.coverPhotoStyle}>
                      {strings.section}
                    </ZText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={localStyles.image}
                    onPress={() => changePage(4)}
                  >
                    <View
                      style={[localStyles.imageContainer,
                              pageNumber === 4 && {backgroundColor: colors.primary},
                              pageNumber !== 4 && {backgroundColor: '#555555'}]}
                    >
                      <Ionicons
                        name={'game-controller'}
                        size={moderateScale(45)}
                        color={clr.textColor}
                        style={[styles.selfCenter, styles.mt10]}
                      />
                    </View>
                    <ZText
                      type={'b16'}
                      color={clr.white}
                      align={'center'}
                      style={localStyles.coverPhotoStyle}>
                      {strings.interests}
                    </ZText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={localStyles.image}
                    onPress={() => changePage(5)}
                  >
                    <View
                      style={[localStyles.imageContainer,
                              pageNumber === 5 && {backgroundColor: colors.primary},
                              pageNumber !== 5 && {backgroundColor: '#555555'}]}
                    >
                      <Ionicons
                        name={'heart'}
                        size={moderateScale(45)}
                        color={clr.textColor}
                        style={[styles.selfCenter, styles.mt10]}
                      />
                    </View>
                    <ZText
                      type={'b14'}
                      color={clr.white}
                      align={'center'}
                      style={localStyles.coverPhotoStyle}>
                      {strings.interaction}
                    </ZText>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              {/* Buttons layer */}
    
              {/* Charts */}
              {!isChartLoading ? (
                <View style={{flex: 1}}>
                  <View style={styles.mb20}>
                    <ZText 
                      type={'b20'}
                      color={colors.primary}
                      align={'center'}>
                      {pageNumber === 1 ? strings.gender
                      : pageNumber === 2 ? strings.age
                      : pageNumber === 3 ? strings.section
                      : pageNumber === 4 ? strings.interests
                      : strings.interaction}
                    </ZText>
                  </View>
    
                  <View style={[localStyles.container, 
                                {alignSelf: 'center'},
                                colors.dark && {borderColor: 'white'},
                                colors.light && {borderColor: 'black'}]}>
                    {/* Dropdown menu */}
                    {(pageNumber === 3 || pageNumber === 4 || pageNumber === 5) ? (
                      <Dropdown
                        style={[
                          localStyles.dropdown,
                          isFocus && { borderColor: colors.primary },
                          {backgroundColor: colors.backgroundColor}
                        ]}
                        containerStyle={{backgroundColor: colors.backgroundColor}}
                        itemTextStyle={{color: colors.textColor}}
                        activeColor={colors.primary}
                        placeholder={strings.chooseSection}
                        placeholderStyle={[localStyles.placeholderStyle, {backgroundColor: colors.backgroundColor, color: colors.textColor}]}
                        selectedTextStyle={[localStyles.selectedTextStyle, {color: colors.textColor}]}
                        inputSearchStyle={[localStyles.inputSearchStyle, {backgroundColor: colors.backgroundColor}]}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder={`${strings.search}...`}
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          if (pageNumber === 3) {
                            getSectionChartData(item.label);
                          } else if (pageNumber === 5) {
                            getInteractionChartData(item.label);
                          } else {
                            getInterestChartData(item.value + 1);
                          }
                          setIsFocus(false);
                        }}
                      />
                    ) : (<View></View>)}
                    {/* Dropdown menu */}

                    {/* Pie chart */}
                    {(pageNumber === 1 || (pageNumber === 5 && isGeneralInteraction)) && (
                      <PieChart
                        style={localStyles.chart}
                        logEnabled={true}
                        chartBackgroundColor={processColor(colors.backgroundColor)}
                        chartDescription={pieState.description}
                        data={pieState.data}
                        legend={pieState.legend}
                        highlights={pieState.highlights}
                        centerText={pieChartLabel}
                        extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}
                        entryLabelTextSize={0}
                        entryLabelFontFamily={'HelveticaNeue-Medium'}
                        drawEntryLabels={true}
                        usePercentValues={true}
                        styledCenterText={{text:pieChartLabel, color: processColor(colors.textColor), fontFamily: 'HelveticaNeue-Medium', size: 20}}
                        centerTextRadiusPercent={100}
                        holeRadius={60}
                        holeColor={processColor(colors.backgroundColor)}
                        transparentCircleRadius={45}
                        transparentCircleColor={processColor('#f0f0f088')}
                        maxAngle={350}
                        onSelect={(x) => {
                          if (Object.keys(x).length === 0) {
                            setCenterPieChartLabel('');
                          } else {
                            setCenterPieChartLabel(x['nativeEvent']['label'], x['nativeEvent']['value']);
                          }
                        }}
                      />
                    )}
                    {/* Gender chart */}
    
                    {/* Age, section and interests chart */}
                    {(pageNumber !== 1 && pageNumber !== 5) && (
                      <BarChart
                        style={localStyles.chart}
                        data={barState.data}
                        xAxis={barState.xAxis}
                        yAxis={barState.yAxis}
                        chartDescription={barState.description}
                        legend={barState.legend}
                        animation={{durationX: 2000}}
                        borderColor={processColor(colors.textColor)}
                        gridBackgroundColor={processColor(colors.textColor)}
                        visibleRange={{x: { min: 5, max: 5 }}}
                        drawBarShadow={false}
                        drawValueAboveBar={true}
                        drawHighlightArrow={true}
                      />
                    )}
                    {/* Age, section and interests chart */}

                    {/* interaction bar chart */}
                    {(pageNumber === 5 && !isGeneralInteraction) && (
                      <BarChart
                        style={localStyles.chart}
                        data={barState.data}
                        xAxis={barState.xAxis}
                        yAxis={barState.yAxis}
                        chartDescription={barState.description}
                        legend={barState.legend}
                        animation={{durationX: 2000}}
                        borderColor={processColor(colors.textColor)}
                        gridBackgroundColor={processColor(colors.textColor)}
                        visibleRange={{x: { min: 5, max: 5 }}}
                        drawBarShadow={false}
                        drawValueAboveBar={true}
                        drawHighlightArrow={true}
                      />
                    )}
                    {/* interaction bar chart */}
                </View>
              </View>)
                : (
                <View style={localStyles.loadingPosts}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
    
            </View>
          )}
        </View>

      <LogOut
        SheetRef={LogOutSheetRef}
        onPressLogOut={onPressYesLogOut}
        onPressCancel={onPressCancel}
      />
    </ZSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pt20,
    ...styles.ph20,
    ...styles.pb10,
  },
  headerRightIcon: {
    ...styles.rowSpaceBetween,
    width: '20%',
    ...styles.mr20,
  },
  itemContainer: {
    alignItems: 'center',
    ...styles.mr20,
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
  rightBtns: {
    ...styles.mr10,
  },
  loadingPosts: {
    height: getHeight(200),
    ...styles.rowCenter
  },
  container: {
    width: moderateScale(340),
    height: moderateScale(370),
    padding: 10,
    borderRadius: moderateScale(20),
    borderWidth: 1
  },
  chart: {
    flex: 1
  },
  chartBtn: {
    width: moderateScale(100),
    height: moderateScale(100),
    backgroundColor: 'grey'
  },
  image: {
    ...styles.m5,
  },
  imgContainer: {
    // flex: 1,
    // ...styles.rowSpaceBetween,
    // ...styles.wrap,
    ...styles.flexRow,
    ...styles.mb10,
  },
  imageContainer: {
    width: moderateScale(74),
    height: getHeight(95),
    borderRadius: moderateScale(20),
  },
  coverPhotoStyle: {
    position: 'absolute',
    bottom: moderateScale(10),
    ...styles.selfCenter,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  noPosts: {
    height: getHeight(50),
  }
});

export default Home;
