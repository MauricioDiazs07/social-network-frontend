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
import images from '../../../assets/images';
import { PieChart } from 'react-native-charts-wrapper';
import { Dropdown } from 'react-native-element-dropdown';
import { BarChart } from 'react-native-charts-wrapper';
import { LineChart } from 'react-native-charts-wrapper';

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
import { ACCESS_TOKEN, USER_LEVEL, THEME } from '../../../common/constants';
import { getAsyncStorageData, setAsyncStorageData } from '../../../utils/helpers';
import { changeThemeAction } from '../../../redux/action/themeAction';
import { colors as clr } from '../../../themes';
import { getPosts } from '../../../api/feed/posts';
import { transformfPosts, transformfHistoy } from '../../../utils/_support_functions';
import { SearchingPosts } from '../../../assets/svgs';
import { getGeneralData, getSectionData, getInterestsData } from '../../../api/master/masterData';

const LogOutSheetRef = createRef();
const onPressLogOutBtn = () => LogOutSheetRef?.current?.show();
const onPressCancel = () => LogOutSheetRef?.current?.hide();
let user_access = '';
let pageIsLoading = true;

const getUserLevel = async () => {
  await AsyncStorage.getItem(USER_LEVEL)
    .then((data) => {
      user_access = JSON.parse(data);
      pageIsLoading = false;
    }).catch(err => console.log("ERROR:", err));
};

const UserProfile = React.memo(() => {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();
  const [profilePhoto, setProfilePhoto] = useState();
  
  useEffect(() => {
    getAsyncStorageData("PROFILE_PHOTO").then(photo => {
        setProfilePhoto(photo)
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

  getUserLevel();

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
      <TouchableOpacity 
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

      </TouchableOpacity>

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

  const sectionList = [];
  const values = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  
  // posts variables
  const [postData, setPostData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // charts variables
  const [pageNumber, setPageNumber] = useState(1  );
  const [isData, setIsData] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [pieChartLabel, setPieChartLabel] = useState('');
  const [genderData, setGenderData] = useState([]);
  const [ageChartData, setAgeChartData] = useState([]);
  const [ageChartLabels, setAgeChartLabels] = useState([]);
  
  const [interestLineChart, setInterestLineChart] = useState([]);
  const [ageBarChart, setAgeBarChart] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [barSectionState, setBarSectionState] = useState({});
  const [sectionLoaded, setSectionLoaded] = useState(false);
  const [barInterestsState, setBarInterestsState] = useState({});
  const [interestsLoaded, setInterestsLoaded] = useState(false);
  const [dropdownData, setDropdownData] = useState(values);
  
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    let user_level = await getAsyncStorageData(USER_LEVEL);

    if (user_level !== "master") {
      getPostsList();
    } else {
      getData();
      setIsData(true);
    }
  }

  const getPostsList = async () => {
    let userID = await getAsyncStorageData("PROFILE_ID");
    let postsList = await getPosts(userID);
    let new_posts = transformfPosts(postsList['POST']);
    let new_history = transformfHistoy(postsList['HISTORY']);

    setPostData(new_posts);
    setHistoryData(new_history);
    setIsLoaded(true);
  }

  const getData = async () => {
    setIsChartLoading(true);

    let generalData = await getGeneralData();
    let genderList = formatGenderData(generalData['gender']);

    setGenderData(genderList);
    setAgeChartData(generalData['age']);

    setIsChartLoading(false);

    // setInterestLineChart(generalData['interests']['data']);

    // getGeneralData().then(data => {
    //   setInterestLineChart(data['interests']['data']);
    //   var section_data = data['section']['array'];
      
    //   section_data.forEach((x) => {
    //     sectionList.push({label: `${x}asd`, value: x});
    //   });

    //   getSectionInfo('1234');
    //   getInterestsInfo('7');

    //   setIsChartLoading(false);
    // });
  }

  const changePage = (index) => {
    if (index == pageNumber) {
      return;
    }
    getData();
    setPageNumber(index);
  }

  const formatGenderData = (genderData) => {
    genderData.forEach((x) => {
      if (x['label'] == 'M') {
        x['label'] = 'Mujeres';
      } else if (x['label'] == 'H') {
        x['label'] = 'Hombres';
      }
    });

    return genderData;
  }

  const setAgeChartParameters = (ageData) => {
    const labelsList = [];

    ageData.forEach((x) => {
      labelsList.push(x['marker ']);
    });

    setAgeChartData(ageData);
    setAgeChartLabels(labelsList);
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
          values: genderData,
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

const ageState = {
  legend: {
    enabled: false,
    textSize: 14,
    form: 'SQUARE',
    formSize: 14,
    xEntrySpace: 10,
    yEntrySpace: 5,
    formToTextSpace: 5,
    wordWrapEnabled: true,
    maxSizePercent: 0.5
  },
  data: ageChartData,
  highlights: [{x: 3}, {x: 6}],
  xAxis: {
    valueFormatter: ageChartLabels,
    granularityEnabled: true,
    granularity : 2,
  }
};

const getLinearChartData = () => {

  return {dataSets: [{ values: interestLineChart, 
    label: '',
    config: {
      lineWidth: 1.5,
      drawCircles: false,
      drawCubicIntensity: 0.3,
      drawCubic: true,
      drawHighlightIndicators: false,
      color: COLOR_PURPLE,
      drawFilled: true,
      fillColor: COLOR_PURPLE,
      fillAlpha: 90
    }}]};
  }

  const getBarchartData = () => {
    
    const data_ = {
      dataSets: [{
        values: ageBarChart,
        label: 'Bar dataSet',
        config: {
          color: processColor('teal'),
          barShadowColor: processColor('lightgrey'),
          highlightAlpha: 90,
          highlightColor: processColor('red'),
        }
      }],

      config: {
        barWidth: 0.7,
      }
    }

    return data_;
  }

  const getBarchartLabels = () => {
    const list_ = [];

    ageBarChart.forEach((x) => {
      list_.push(x['marker ']);
    });

    return list_;
  }

  const COLOR_PURPLE = processColor('#697dfb');

  const onRefresh = () => navigation.reset({
                                          index: 0,
                                          routes: [{name: StackNav.TabBar}]
                                        });

  const onPressYesLogOut = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      await AsyncStorage.removeItem(USER_LEVEL);
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

    const percentage = value * 100;
    const text = `${percentage}%\n${label}`;
    setPieChartLabel(text);
  }

  getSectionInfo = async (section) => {
    getSectionData(section)
      .then((resp) => {
        var section_list = [];
        resp['interests'].forEach((x) => {
          section_list.push(x['marker']);
        });

        var data_ = {
          legend: {
            enabled: false,
            textSize: 14,
            form: 'SQUARE',
            formSize: 14,
            xEntrySpace: 10,
            yEntrySpace: 5,
            formToTextSpace: 5,
            wordWrapEnabled: true,
            maxSizePercent: 0.5
          },
          data: {
            dataSets: [{
              values: [{"marker": "Ciencia y tecnología", "x": 0, "y": 0}, {"marker": "Programas sociales", "x": 1, "y": 0}, {"marker": "Deportes", "x": 2, "y": 0}, {"marker": "Cultura", "x": 3, "y": 0}, {"marker": "Medio ambiente", "x": 4, "y": 0}, {"marker": "Economía", "x": 5, "y": 0}, {"marker": "Seguridad", "x": 6, "y": 0}],
              label: 'Bar dataSet',
              config: {
                color: processColor('teal'),
                barShadowColor: processColor('lightgrey'),
                highlightAlpha: 90,
                highlightColor: processColor('red'),
              }
            }],
      
            config: {
              barWidth: 0.7,
            }
          },
          highlights: [{x: 3}, {x: 6}],
          xAxis: {
            valueFormatter: ["Ciencia y tecnología", "Programas sociales", "Deportes", "Cultura", "Medio ambiente", "Economía", "Seguridad"],
            granularityEnabled: true,
            granularity : 2,
          }
        };

        setBarSectionState(data_);
        setSectionLoaded(true);

      });
  }

  getInterestsInfo = async (interest) => {
    getInterestsData(interest)
      .then((resp) => {
        var section_list = [];
        // resp['section'].forEach((x) => {
        //   section_list.push(x['marker']);
        // });

        var data_ = {
          legend: {
            enabled: false,
            textSize: 14,
            form: 'SQUARE',
            formSize: 14,
            xEntrySpace: 10,
            yEntrySpace: 5,
            formToTextSpace: 5,
            wordWrapEnabled: true,
            maxSizePercent: 0.5
          },
          data: {
            dataSets: [{
              values: [],
              label: 'Bar dataSet',
              config: {
                color: processColor('teal'),
                barShadowColor: processColor('lightgrey'),
                highlightAlpha: 90,
                highlightColor: processColor('red'),
              }
            }],
      
            config: {
              barWidth: 0.7,
            }
          },
          highlights: [{x: 3}, {x: 6}],
          xAxis: {
            valueFormatter: [],
            granularityEnabled: true,
            granularity : 2,
          }
        };

        setBarInterestsState(data_);
        setInterestsLoaded(true);

      });
  }

  return (
    <ZSafeAreaView>
      <ZHeader
        isHideBack
        title={strings.appName}
        rightIcon={rightHeaderIcon}
        isLeftIcon={leftHeaderIcon}
      />
      {!pageIsLoading ? (
        <View style={{flex: 1}}>
          {user_access !== "master" && (<ScrollView 
            refreshControl={
              <RefreshControl onRefresh={onRefresh} />
            }>
            {postData.length > 0 ? (
              <FlashList
                data={postData}
                keyExtractor={item => item.id}
                renderItem={({item}) => <UserPost item={item} dataLength={postData.length}/>}
                ListHeaderComponent={headerStory}
                showsVerticalScrollIndicator={false}
              />
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
                <ZText type={'s28'} style={styles.mb10}>Máster</ZText>
              </View>
              
              {/* Buttons layer */}
              <View style={localStyles.imgContainer}>
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
                    Género
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
                    Edad
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
                    Sección
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
                    Intereses
                  </ZText>
                </TouchableOpacity>
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
                      {pageNumber === 1 ? 'Género'
                      : pageNumber === 2 ? 'Edad'
                      : pageNumber === 3 ? 'Sección'
                      : 'Intereses'}
                    </ZText>
                  </View>
    
                  <View style={[localStyles.container, 
                                {alignSelf: 'center'},
                                colors.dark && {borderColor: 'white'},
                                colors.light && {borderColor: 'black'}]}>
                    {/* Gender chart */}
                    {pageNumber === 1 && (
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
    
                    {/* Age chart */}
                    {pageNumber === 2 && (
                      <BarChart
                            style={localStyles.chart}
                            data={ageState.data}
                            xAxis={ageState.xAxis}
                            animation={{durationX: 2000}}
                            legend={ageState.legend}
                            borderColor={processColor('#B042FF')}
                            gridBackgroundColor={processColor('#ffffff')}
                            visibleRange={{x: { min: 5, max: 5 }}}
                            drawBarShadow={false}
                            drawValueAboveBar={true}
                            drawHighlightArrow={true}
                            // onSelect={this.handleSelect.bind(this)}
                            highlights={ageState.highlights}
                            // onChange={(event) => console.log(event.nativeEvent)}
                        />
                    )}
                    {/* Age chart */}
    
                    {(pageNumber === 3 || pageNumber === 4) && sectionLoaded ? (
                      <Dropdown
                        style={[localStyles.dropdown, isFocus && { borderColor: colors.primary }, {backgroundColor: colors.backgroundColor}]}
                        containerStyle={[{backgroundColor: colors.backgroundColor}]}
                        // itemContainerStyle={[{backgroundColor: 'red'}]}
                        itemContainerStyle={{alignContent: 'center'}}
                        itemTextStyle={{color: colors.textColor, alignContent: 'center', justifyContent: 'center'}}
                        activeColor={colors.primary}
                        placeholder={'Escoge una sección'}
                        placeholderStyle={[localStyles.placeholderStyle, {backgroundColor: colors.backgroundColor, color: colors.textColor}]}
                        selectedTextStyle={[localStyles.selectedTextStyle, {color: colors.textColor}]}
                        inputSearchStyle={[localStyles.inputSearchStyle, {backgroundColor: colors.backgroundColor}]}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        searchPlaceholder="Buscar..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                          setValue(item.value);
                          setIsFocus(false);
                        }}
                        // renderLeftIcon={() => (
                        //   // <AntDesign
                        //   //   style={styles.icon}
                        //   //   color={isFocus ? 'blue' : 'black'}
                        //   //   name="Safety"
                        //   //   size={20}
                        //   // />
                        //   <Ionicons
                        //     name={'game-controller'}
                        //     size={moderateScale(45)}
                        //     color={'black'}
                        //     style={[styles.selfCenter, styles.mt10]}
                        //   />
                        // )}
                      />
                    ) : (<View></View>)}
    
                {pageNumber === 3 && interestsLoaded ? (
                  <BarChart
                      style={localStyles.chart}
                      data={barSectionState.data}
                      xAxis={barSectionState.xAxis}
                      animation={{durationX: 2000}}
                      legend={barSectionState.legend}
                      borderColor={processColor('#B042FF')}
                      gridBackgroundColor={processColor('#ffffff')}
                      visibleRange={{x: { min: 5, max: 5 }}}
                      drawBarShadow={false}
                      drawValueAboveBar={true}
                      drawHighlightArrow={true}
                      // onSelect={this.handleSelect.bind(this)}
                      highlights={barSectionState.highlights}
                      // onChange={(event) => console.log(event.nativeEvent)}
                    />
                  ) : (<View></View>)}
    
                {pageNumber === 4 && interestsLoaded ? (
                  <BarChart
                      style={localStyles.chart}
                      data={barSectionState.data}
                      xAxis={barSectionState.xAxis}
                      animation={{durationX: 2000}}
                      legend={barSectionState.legend}
                      borderColor={processColor('#B042FF')}
                      gridBackgroundColor={processColor('#ffffff')}
                      visibleRange={{x: { min: 5, max: 5 }}}
                      drawBarShadow={false}
                      drawValueAboveBar={true}
                      drawHighlightArrow={true}
                      // onSelect={this.handleSelect.bind(this)}
                      highlights={barSectionState.highlights}
                      // onChange={(event) => console.log(event.nativeEvent)}
                    />
                  ) : (<View></View>)}
                </View>
              </View>)
                : (
                <View style={localStyles.loadingPosts}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
    
            </View>
            
            // <ScrollView 
            // refreshControl={
            //   <RefreshControl onRefresh={onRefresh} />
            // }>
              // 
                
              //   <View style={[localStyles.container, {height: 50}]}>
              //     <LineChart style={localStyles.chart}
              //       data={getLinearChartData()}
              //     />
              //   </View>
    
              //   <View style={localStyles.container}>
              //     <PieChart
              //       style={localStyles.chart}
              //       logEnabled={true}
              //       chartBackgroundColor={processColor('pink')}
              //       chartDescription={pieState.description}
              //       data={pieState.data}
              //       legend={pieState.legend}
              //       highlights={pieState.highlights}
    
              //       extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}
    
              //       entryLabelColor={processColor('green')}
              //       entryLabelTextSize={20}
              //       entryLabelFontFamily={'HelveticaNeue-Medium'}
              //       drawEntryLabels={true}
    
              //       rotationEnabled={true}
              //       rotationAngle={45}
              //       usePercentValues={true}
              //       styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
              //       centerTextRadiusPercent={100}
              //       holeRadius={40}
              //       holeColor={processColor('#f0f0f0')}
              //       transparentCircleRadius={45}
              //       transparentCircleColor={processColor('#f0f0f088')}
              //       maxAngle={350}
              //       // onSelect={this.handleSelect.bind(this)}
              //       // onChange={(event) => console.log(event.nativeEvent)}
              //     />
              //   </View>
    
              //   <View style={localStyles.container}>
              //     <BarChart
              //       style={localStyles.chart}
              //       data={barState.data}
              //       xAxis={barState.xAxis}
              //       animation={{durationX: 2000}}
              //       legend={barState.legend}
              //       gridBackgroundColor={processColor('#ffffff')}
              //       visibleRange={{x: { min: 5, max: 5 }}}
              //       drawBarShadow={false}
              //       drawValueAboveBar={true}
              //       drawHighlightArrow={true}
              //       // onSelect={this.handleSelect.bind(this)}
              //       highlights={barState.highlights}
              //       // onChange={(event) => console.log(event.nativeEvent)}
              //     />
              //   </View>
              // </View>
          )}
            {/* </ScrollView> */}
        </View>
      ) : (
        <View style={localStyles.loadingPosts}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}


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
    borderWidth: 2
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
    ...styles.rowSpaceBetween,
    ...styles.wrap,
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
});

export default Home;
