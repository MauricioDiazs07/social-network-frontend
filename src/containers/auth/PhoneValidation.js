// Library import
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDownTimer from 'react-native-countdown-timer-hooks';

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

const PhoneValidation = props => {
  const { navigation } = props;
  // const email = props.route.params.email2Send;
  const phone = props.route.params.phone

  const colors = useSelector(state => state.theme.theme);

  const [otp, setOtp] = useState('');
  const [counterId, setCounterId] = useState('1');
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [counter, setCounter] = useState(10);

  
  // TWILIO CODE*************
  // const accountSid = 'ACcbd70358aa76ae1a66cba60ad187a99c';
  // const authToken = '9765c162ce965ee7555095e1828c2417';

  // const client = require('twilio')(accountSid, authToken);

  // client.messages
  //   .create({
  //     body: 'Hello from twilio-node',
  //     to: '+12345678901', // Text your number
  //     from: '+12345678901', // From a valid Twilio number
  //   })
  //   .then((message) => console.log(message.sid));

/******** */
  const onOtpChange = code => setOtp(code);
  const onPressVerify = () => navigation.navigate(StackNav.CreateNewPassword);

  const onFinishTimer = () => setIsTimeOver(true);

  const refTimer = useRef();

  const onPressResend = () => {
    setCounter(counter + 20);
    setCounterId(counterId + '1');
    setIsTimeOver(false);
    setOtp('');
  };

  return (
    <ZSafeAreaView>
      <ZHeader title={strings.forgotPassword} />
      <ZKeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyles.root}>
          <ZText type={'r18'} align={'center'} style={styles.mb20}>
            {/* {strings.codeSendOn + email} */}
          </ZText>
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
              <TouchableOpacity
                onPress={onPressResend}
                disabled={isTimeOver ? false : true}
                style={styles.p5}>
                <ZText type={'m18'} color={colors.primary} align={'center'}>
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
            )}
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
