// Library import
import {StyleSheet, View, TouchableOpacity, Button} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import { encode } from 'base-64';

// Local import
import ZSafeAreaView from '../../components/common/ZSafeAreaView';
import ZHeader from '../../components/common/ZHeader';
import strings from '../../i18n/strings';
import ZText from '../../components/common/ZText';
import ZKeyBoardAvoidWrapper from '../../components/common/ZKeyBoardAvoidWrapper';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import {StackNav} from '../../navigation/NavigationKeys';
import typography from '../../themes/typography';
import ZButton from '../../components/common/ZButton';
import {
  ACCOUNT_SID_TWILIO,
  AUTH_TOKEN_TWILIO,
  PHONE_TWILIO,
  API_TWILIO } from '../../utils/api_constants';

const PhoneValidation = props => {
  const { navigation } = props;
  const phone = props.route.params.phone
  const colors = useSelector(state => state.theme.theme);

  const [otp, setOtp] = useState('');
  const [counterId, setCounterId] = useState('1');
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [counter, setCounter] = useState(15);
  const [phoneCode, setPhoneCode] = useState(null);
  const [isFailed, setIsFailed] = useState(false);

  const generateRandomNumber = () => {
    const min = 1000; 
    const max = 9999; 
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setPhoneCode(randomNumber);
    return randomNumber;
  }  

  const getTwilio = async () => { 
    const formData = new FormData();

    formData.append('From', `${PHONE_TWILIO}`);
    formData.append('To', `+52${phone}`);
    formData.append('Body', strings.codeSMS +`${phoneCode}`);
    console.log("phoneCode:", phoneCode);

    try{
      if(phoneCode !== null) {
        const response = await fetch(API_TWILIO, {
          method: "POST", 
          body: formData,  
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Basic ' + encode(`${ACCOUNT_SID_TWILIO}:${AUTH_TOKEN_TWILIO}`),
          },
        });
      }

    } catch(error){
      console.error('Error in API Twilio:', error);
    }
  }

  useEffect(() => {    
    getTwilio()
  },[phoneCode]);

  const onPressSend = () => {
    generateRandomNumber();
    getTwilio()
  }

  const onOtpChange = code => setOtp(code);

  const onPressVerify = () => {
    const numberOtp = parseInt(otp, 10);
    if(!isTimeOver) {
      if(numberOtp === phoneCode){
        setIsFailed(false);
        navigation.reset({
              index: 0,
              routes: [{name: StackNav.TabBar}],
            });
      } else {
        setIsFailed(true);
      }
    } 
  }

  const onFinishTimer = () => {
    setIsTimeOver(true)
  };

  const refTimer = useRef();

  const onPressResend = () => {
    generateRandomNumber();
    getTwilio();
    setCounter(counter + 10);
    setCounterId(counterId + '1');
    setIsTimeOver(false);
    setIsFailed(false);
    setOtp('');
  };
  
  return (
    <ZSafeAreaView>
      <ZHeader title={strings.validateOtp} />
      <ZKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          {(phoneCode === null) ? (
            <TouchableOpacity
                  onPress={onPressSend}
                  disabled={phoneCode === null ? false : true}
                  style={[
                    localStyles.btnSendCodeContainer,
                    {backgroundColor: colors.primary}]}>
                  <ZText type={'m18'} align={'center'}>
                    {strings.sendCode + phone}
                  </ZText>
                </TouchableOpacity>
                ) : (!isTimeOver && (
                  <TouchableOpacity>
                    <ZText type={'r18'} align={'center'} style={styles.mb20}>
                      {strings.codePhoneSendOn}
                    </ZText>
                    <ZText type={'m18'} color={colors.primary} align={'center'}>
                      {phone}
                    </ZText>
                  </TouchableOpacity>
                )) 
          }
          <OTPInputView
            pinCount={4}
            code={otp}
            onCodeChanged={onOtpChange}
            autoFocusOnLoad={false}
            codeInputFieldStyle={[
              localStyles.pinInputStyle,
              {
                color: colors.textColor,
                backgroundColor: colors.inputBg,
                borderColor: colors.bColor,
              },
            ]}
            codeInputHighlightStyle={{
              backgroundColor: colors.inputFocusColor,
              borderColor: colors.primary,
            }}
            style={localStyles.inputStyle}
            secureTextEntry={false}
          />          
          <View style={styles.rowCenter}>
            {isTimeOver ? (
              <ZText type={'m18'} align={'center'}>
                {strings.timeExceeded}
              </ZText>
              )
            : (
              isFailed === true && (
                <ZText type={'m18'} align={'center'}>
                  {strings.invalidCode}
                </ZText>
            ))}
          </View>
          <View style={styles.rowCenter}>
           {(phoneCode !== null) && (
              isTimeOver ? (
                <TouchableOpacity
                  onPress={onPressResend}
                  disabled={isTimeOver ? false : true}
                  style={[
                    localStyles.btnResendCodeContainer,
                    {backgroundColor: colors.primary}]
                    }>
                  <ZText type={'m18'}  align={'center'}>
                    {strings.resendCode}
                  </ZText>
                </TouchableOpacity>
              ) : (
                <View style={styles.rowCenter}>
                  <ZText type={'m18'} align={'center'}>
                    {strings.resendCodeIn}
                  </ZText>
                  <CountDownTimer
                    ref={refTimer}
                    timestamp={counter}
                    timerCallback={onFinishTimer}
                    containerStyle={{backgroundColor: colors.backgroundColor}}
                    textStyle={[
                      localStyles.digitStyle,
                      {color: colors.primary},
                    ]}
                  />
                  <ZText type={'m18'} align={'center'}>
                    {strings.second}
                  </ZText>
                </View>
              ))}
          </View>
        </View>
        <ZButton
          textType={'b18'}
          color={colors.white}
          title={strings.verify}
          onPress={onPressVerify}
          containerStyle={[
            localStyles.btnContainerStyle,
            otp.length < 4 && {opacity: 0.5}
          ]}
          disabled={otp.length === 4 ? false : true}
        />
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default PhoneValidation;

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph30,
    ...styles.justifyCenter,
    ...styles.flex,
  },
  pinInputStyle: {
    height: moderateScale(60),
    width: moderateScale(75),
    fontSize: moderateScale(26),
    borderRadius: moderateScale(15),
  },
  btnContainerStyle: {
    ...styles.m20,
  },
  btnSendCodeContainer: {
    ...styles.p10,
    height: getHeight(75),
    borderRadius: moderateScale(40),
    borderWidth: moderateScale(1),
    fontWeight: typography.fontWeights.SemiBold
  },
  btnResendCodeContainer: {
    ...styles.p10,
      ...styles.mt15,
      height: getHeight(55),
      borderRadius: moderateScale(30),
      borderWidth: moderateScale(1)
  },
  inputStyle: {
    height: getHeight(60),
    ...styles.mv30,
  },
  digitStyle: {
    fontSize: moderateScale(18),
    ...typography.fontWeights.Regular,
    ...styles.ml5,
    ...styles.mr5,
  },
});
