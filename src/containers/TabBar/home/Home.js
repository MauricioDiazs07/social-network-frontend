import { View,
        TouchableOpacity,
        StyleSheet,
        ScrollView,
        RefreshControl,
        ActivityIndicator,
        AppRegistry,
        Text,
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
import _, { forEach } from 'lodash';
import {LineChart} from 'react-native-charts-wrapper';
import {PieChart} from 'react-native-charts-wrapper';

import {BarChart} from 'react-native-charts-wrapper';

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
import { getGeneralData } from '../../../api/master/masterData';

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
  const rightHeaderIcon = useMemo(() => <RightHeaderIcons />, []);
  const leftHeaderIcon = useMemo(() => <LeftHeaderIcon />, []);

  const [postData, setPostData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [genderPieChart, setGenderPieChart] = useState([]);
  const [interestLineChart, setInterestLineChart] = useState([]);
  const [ageBarChart, setAgeBarChart] = useState([]);

  useEffect(() => {
    getAsyncStorageData("PROFILE_PHOTO").then(photo => {
      setProfilePhoto(photo)
    });
    getGeneralData().then(data => {
      setMasterData(data);
      setGenderPieChart(data);
    });
  });

  const data = {
    "age": {
        "classified": {
            "11 - 20 años": 0,
            "21 - 30 años": 0,
            "31 - 40 años": 0,
            "41 - 50 años": 0,
            "51 - 60 años": 0,
            "61 - 70 años": 0,
            "71 - 80 años": 0,
            "Mayor 80 años": 0,
            "Menor o igual 10 años": 0
        },
        "data": {}
    },
    "gender": {
        "M": 2
    },
    "interests": [
        {
            "count": 0,
            "description": "Ciencia y tecnología",
            "id": 1
        },
        {
            "count": 0,
            "description": "Programas sociales",
            "id": 2
        },
        {
            "count": 0,
            "description": "Deportes",
            "id": 3
        },
        {
            "count": 0,
            "description": "Cultura",
            "id": 4
        },
        {
            "count": 0,
            "description": "Medio ambiente",
            "id": 5
        },
        {
            "count": 0,
            "description": "Economía",
            "id": 6
        },
        {
            "count": 0,
            "description": "Seguridad",
            "id": 7
        }
    ],
    "seccion": {}
};

const va = _;
const getLinearChartData = () => {
  const int = [
    {
        "count": 1,
        "description": "Ciencia y tecnología",
        "id": 1
    },
    {
        "count": 0,
        "description": "Programas sociales",
        "id": 2
    },
    {
        "count": 0,
        "description": "Deportes",
        "id": 3
    },
    {
        "count": 1,
        "description": "Cultura",
        "id": 4
    },
    {
        "count": 0,
        "description": "Medio ambiente",
        "id": 5
    },
    {
        "count": 1,
        "description": "Economía",
        "id": 6
    },
    {
        "count": 0,
        "description": "Seguridad",
        "id": 7
    }
];
const list_ = [];

int.forEach((x) => {
  list_.push({y: x['count'], marker: x['description'], x: x['id']})
});

return {dataSets: [{ values: list_, 
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
  const ages = {
    "11 - 20 años": 0,
    "21 - 30 años": 1,
    "31 - 40 años": 0,
    "41 - 50 años": 0,
    "51 - 60 años": 0,
    "61 - 70 años": 0,
    "71 - 80 años": 0,
    "Mayor 80 años": 0,
    "Menor o igual 10 años": 0
  };

  const keys_ = Object.keys(ages);

  const list_ = [];

  keys_.forEach((x) => {
    list_.push({y: ages[x], marker: x})
  });
  
  const data_ = {
    dataSets: [{
      values: list_,
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

  console.log("BARCHART DATA:", data_);

  return data_;


}

const COLOR_PURPLE = processColor('#697dfb');

const barState = {
  legend: {
    enabled: true,
    textSize: 14,
    form: 'SQUARE',
    formSize: 14,
    xEntrySpace: 10,
    yEntrySpace: 5,
    formToTextSpace: 5,
    wordWrapEnabled: true,
    maxSizePercent: 0.5
  },
  data: getBarchartData(),
  highlights: [{x: 3}, {x: 6}],
  xAxis: {
    valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    granularityEnabled: true,
    granularity : 1,
  }
};

  const state = {
    data: {
      set: {
        dataSets: [{
          values: [
            {
              x: 10,
              y: 10,
              marker: "#hola",
            }
          ],
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
          }
        }],
      }
    },
    xAxis: {
      $set: {
        textColor: processColor('red'),
        textSize: 16,
        gridColor: processColor('red'),
        gridLineWidth: 1,
        axisLineColor: processColor('darkgray'),
        axisLineWidth: 1.5,
        gridDashedLine: {
          lineLength: 10,
          spaceLength: 10
        },
        avoidFirstLastClipping: true,
        position: 'BOTTOM'
      }
    },
    yAxis: {
      $set: {
        left: {
          drawGridLines: false
        },
        right: {
          enabled: false
        }
      }
    },
  };

  const pieState = {
    legend: {
      enabled: false,
      textSize: 15,
      form: 'CIRCLE',

      horizontalAlignment: "RIGHT",
      verticalAlignment: "CENTER",
      orientation: "VERTICAL",
      wordWrapEnabled: false
    },
    data: {
      dataSets: [{
        values: [{value: 0, label: 'M'},
          {value: 1, label: 'H'}],
        label: 'Género',
        config: {
          colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF'), processColor('#FF8C9D')],
          valueTextSize: 20,
          valueTextColor: processColor('green'),
          sliceSpace: 5,
          selectionShift: 13,
          // xValuePosition: "OUTSIDE_SLICE",
          // yValuePosition: "OUTSIDE_SLICE",
          valueFormatter: "#.#'%'",
          valueLineColor: processColor('green'),
          valueLinePart1Length: 0.5
        }
      }],
    },
    highlights: [{x:2}],
    description: {
      text: 'Gráfica que muestra el género de los usuarios',
      textSize: 15,
      textColor: processColor('darkgray'),

    }
  };
  
  useEffect(() => {
    getAsyncStorageData("PROFILE_ID").then(profile => {
      getPosts(profile)
      .then(resp => {
        const new_posts = transformfPosts(resp['POST']);
        const new_history = transformfHistoy(resp['HISTORY'])
        setPostData(new_posts);
        setHistoryData(new_history)
        setIsLoaded(true);
      });
    });
  }, []);

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

  return (
    <ZSafeAreaView>
      <ZHeader
        isHideBack
        title={strings.appName}
        rightIcon={rightHeaderIcon}
        isLeftIcon={leftHeaderIcon}
      />
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
            <ActivityIndicator size="large" color="#B042FF" />
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
        <View style={{flex: 1, padding:20}}>
          <View>
            <ZText>Holaaa</ZText>
          </View>
          
          <View style={[localStyles.container, {height: 50}]}>
            <LineChart style={localStyles.chart}
              data={getLinearChartData()}
            />
            
          </View>

<View style={localStyles.container}>
          <PieChart
            style={localStyles.chart}
            logEnabled={true}
            chartBackgroundColor={processColor('pink')}
            chartDescription={pieState.description}
            data={pieState.data}
            legend={pieState.legend}
            highlights={pieState.highlights}

            extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

            entryLabelColor={processColor('green')}
            entryLabelTextSize={20}
            entryLabelFontFamily={'HelveticaNeue-Medium'}
            drawEntryLabels={true}

            rotationEnabled={true}
            rotationAngle={45}
            usePercentValues={true}
            styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
            centerTextRadiusPercent={100}
            holeRadius={40}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={45}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={350}
            // onSelect={this.handleSelect.bind(this)}
            // onChange={(event) => console.log(event.nativeEvent)}
          />
        </View>

        <View style={localStyles.container}>
          <BarChart
            style={localStyles.chart}
            data={barState.data}
            xAxis={barState.xAxis}
            animation={{durationX: 2000}}
            legend={barState.legend}
            gridBackgroundColor={processColor('#ffffff')}
            visibleRange={{x: { min: 5, max: 5 }}}
            drawBarShadow={false}
            drawValueAboveBar={true}
            drawHighlightArrow={true}
            // onSelect={this.handleSelect.bind(this)}
            highlights={barState.highlights}
            // onChange={(event) => console.log(event.nativeEvent)}
          />
        </View>
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
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  },
});

export default Home;
