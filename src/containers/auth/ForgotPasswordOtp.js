// Library import
import {StyleSheet, View, TouchableOpacity, Button} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import {Snackbar} from '@react-native-material/core';

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
import { sendSMS, checkSMS } from '../../api/auth/sendSMS';

const ForgotPasswordOtp = props => {
  const { navigation } = props;
  const user_id = props.route.params.userId;
  const phoneNo = props.route.params.phone2Send;
  const areaCode = props.route.params.areaCode;
  const phone = `+${areaCode}${phoneNo}`;
  const colors = useSelector(state => state.theme.theme);

  const [otp, setOtp] = useState('');
  const [counterId, setCounterId] = useState('1');
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [counter, setCounter] = useState(15);
  const [isFailed, setIsFailed] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  
  const getSMS = (phoneNum) => {
    sendSMS(phoneNum).then(attempts => {
      if(attempts.status === 429){
        setSnackVisible(true);
      } else {
        setCounter(counter + 10);
      }
    });
  }

  useEffect(() => {  
    getSMS(phone);
  },[]);

  const onOtpChange = code => setOtp(code);
  
  const onPressVerify = () => {
      checkSMS(phone, otp).then(status =>
      {
        if(status === 'approved'){
          setIsFailed(false);
          navigation.navigate(StackNav.CreateNewPassword, {
            userId: user_id
          });
        } else {
          setIsFailed(true);
        }
      }
    )
  }

  const onFinishTimer = () => setIsTimeOver(true);

  const refTimer = useRef();

  const onPressResend = () => {
    getSMS(phone);
    setCounterId(counterId + '1');
    setIsTimeOver(false);
    setOtp('');
  };

  const closeSnackBar = () => {
    navigation.navigate(StackNav.ForgotPassword)
  };

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.forgotPassword} />
      <ZKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          {!isTimeOver && (
            <TouchableOpacity>
              <ZText type={'r18'} align={'center'} style={styles.mb20}>
                {strings.codePhoneSendOn}
              </ZText>
              <ZText type={'m18'} color={colors.primary} align={'center'}>
                {phone}
              </ZText>
            </TouchableOpacity>
          )}
          <OTPInputView
            pinCount={6}
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
          {snackVisible ? (
                <View style={{flex: 1}}>
                  <Snackbar
                    message={strings.maxAttempts}   
                    action={
                      <Button
                        variant="text"
                        title={strings.close}
                        color={colors.primary}
                        compact
                        onPress={closeSnackBar}
                      />
                    }
                  />
                </View>
              ) : 
            (isTimeOver ? (
              <ZText type={'m18'} align={'center'}>
                {strings.timeExceeded}
              </ZText>
              )
            : (
              isFailed === true && (
                <ZText type={'m18'} align={'center'}>
                  {strings.invalidCode}
                </ZText>
            )
            ))}
          </View>
          {!snackVisible && 
          <View style={styles.rowCenter}>
             {isTimeOver ? (
                <TouchableOpacity
                  onPress={onPressResend}
                  disabled={isTimeOver ? false : true}
                  style={[
                    localStyles.btnResendCodeContainer,
                    {backgroundColor: colors.primary}]}>
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
                    {strings.minutes}
                  </ZText>                     
                </View>
                )}
          </View>}
        </View>
        <ZButton
          textType={'b18'}
          color={colors.white}
          title={strings.verify}
          onPress={onPressVerify}
          containerStyle={[
            localStyles.btnContainerStyle,
            otp.length < 6 && {opacity: 0.5}
          ]}
          disabled={otp.length === 6 ? false : true}
        />
      </ZKeyBoardAvoidWrapper>
    </ZSafeAreaView>
  );
};

export default ForgotPasswordOtp;
const localStyles = StyleSheet.create({
  root: {
    ...styles.ph30,
    ...styles.justifyCenter,
    ...styles.flex,
  },
  pinInputStyle: {
    height: moderateScale(60),
    width: moderateScale(55),
    fontSize: moderateScale(26),
    borderRadius: moderateScale(15),
  },
  btnContainerStyle: {
    ...styles.m20,
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
