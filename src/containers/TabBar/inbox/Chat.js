// Library import
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

// Local import
import ZSafeAreaView from '../../../components/common/ZSafeAreaView';
import ZHeader from '../../../components/common/ZHeader';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import ZText from '../../../components/common/ZText';
import ZInput from '../../../components/common/ZInput';
import {StackNav} from '../../../navigation/NavigationKeys';
import {checkPlatform, getAsyncStorageData} from '../../../utils/helpers';
import { getChats, sendChat } from '../../../api/chats/chats';
import { PROFILE_ID } from '../../../common/constants';

export default function Chat({navigation, route}) {
  const userName = route.params?.userName;
  const userImage = route.params?.userImage;
  const profileAdminId = route.params.profileId;
  const colors = useSelector(state => state.theme.theme);
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.btnColor1,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputFocusColor,
    borderColor: colors.primary,
  };

  const [addChat, setAddChat] = useState('');
  const [chatStyle, setChatStyle] = useState(BlurredStyle);
  const [isDisable, setIsDisable] = useState(true);
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    getInitChats();
  }, []);

  useEffect(() => {
    if (addChat.length > 0) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [addChat]);

  const onFocusInput = () => setChatStyle(FocusedStyle);

  const onBlurInput = () => setChatStyle(BlurredStyle);

  const onchangeComment = text => setAddChat(text);

  const getInitChats = async () => {
    await getAsyncStorageData(PROFILE_ID)
    .then(async (resp) => {
      let chats = await getChats(resp, profileAdminId);
      setChatData(chats['chats']);
    });
  }

  const sendMessage = async () => {
    setAddChat('');
    await getAsyncStorageData(PROFILE_ID)
    .then(async (resp) => {
      await sendChat(resp, profileAdminId, addChat);
    });
    await getInitChats();
  }

  const SenderMessage = memo(({item, index}) => {
    return (
      <View
        style={[
          localStyles.senderContainer,
          {
            backgroundColor:
              item.type == 'sender'
                ? colors.primary
                : colors.dark
                ? colors.dark3
                : colors.grayScale1,
            alignSelf: item.type == 'sender' ? 'flex-end' : 'flex-start',
          },
        ]}>
        <ZText 
          style={styles.flex}
          color={colors.grayScale6}
          type="m16"
          align={item.type == 'sender' ? 'right' : 'left'}
        >
          {item.message}
        </ZText>
        {/* <ZText color={colors.grayScale6} style={styles.pl10} type="r12">
          {item.time}
        </ZText> */}
      </View>
    );
  });

  const onPressProfile = () => {
    navigation.navigate(StackNav.ProfileDetail, {
      userName: userName,
      userImage: userImage,
    });
  };

  const UserProfile = () => {
    return (
      <TouchableOpacity onPress={onPressProfile}>
        <Image
          source={{
            uri: userImage,
          }}
          style={localStyles.avatar}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ZSafeAreaView>
      <ZHeader
        title={userName}
        isLeftIcon={<UserProfile />}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={
          checkPlatform() === 'ios' ? moderateScale(10) : null
        }
        style={styles.flex}
        behavior={checkPlatform() === 'ios' ? 'padding' : null}>
        <View style={styles.flex}>
          <FlatList
            data={chatData}
            renderItem={({item, index}) => (
              <SenderMessage item={item} index={index} />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.mh20}
          />
        </View>
        <View style={styles.rowCenter}>
          <ZInput
            placeHolder={strings.message + '...'}
            keyBoardType={'default'}
            _value={addChat}
            autoCapitalize={'none'}
            toGetTextFieldValue={onchangeComment}
            inputContainerStyle={[
              {backgroundColor: colors.inputBg},
              localStyles.inputContainerStyle,
              chatStyle,
            ]}
            _onFocus={onFocusInput}
            onBlur={onBlurInput}
          />
          <TouchableOpacity
            disabled={isDisable}
            style={[
              localStyles.sendBtn,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={sendMessage}
            >
            <Feather
              name={'send'}
              size={moderateScale(24)}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ZSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.flex,
    ...styles.ph20,
    ...styles.itemsCenter,
  },
  timeContainer: {
    ...styles.pv10,
    ...styles.mv15,
    ...styles.ph15,
    borderRadius: moderateScale(12),
  },
  senderContainer: {
    ...styles.p15,
    ...styles.flexRow,
    borderRadius: moderateScale(12),
    maxWidth: '80%',
    ...styles.itemsEnd,
    ...styles.mt10,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    ...styles.ph15,
    width: moderateScale(300),
  },
  sendBtn: {
    height: moderateScale(60),
    width: moderateScale(60),
    borderRadius: moderateScale(30),
    ...styles.rowCenter,
    ...styles.ml10,
  },
  avatar: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    ...styles.mh10,
  },
});
