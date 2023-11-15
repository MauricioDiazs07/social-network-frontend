import base64 from 'react-native-base64'
import {
    ACCOUNT_SID_TWILIO,
    AUTH_TOKEN_TWILIO,
    SEND_SMS_TWILIO,
    VERIFY_SMS_TWILIO, } from '../../utils/api_constants';

const accountSid = ACCOUNT_SID_TWILIO
const authToken =  AUTH_TOKEN_TWILIO;
const credentials = `${accountSid}:${authToken}`;

const sendSMS = async (phone) => {
  const formData = new FormData();
  formData.append('To', phone);
  formData.append('Channel', 'sms');

  const response = await fetch(SEND_SMS_TWILIO, {
      method: "POST", 
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Basic ' + base64.encode(credentials)
      }
  });

  const resp = await response.json();
  return resp;
}


const checkSMS = async (phone, code) => {
  const formData = new FormData();
  formData.append('To', phone);
  formData.append('Code', code);
  
    try {
      const response = await fetch(VERIFY_SMS_TWILIO, {
        method: "POST", 
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Basic ' + base64.encode(credentials)
        }
      })
      const resp = await response.json();        
      if(resp.status === 'approved'){
        return resp.status;
      }
    } catch(error) {
      console.log('Error Twilio verify message: ', error);
    }
}

export { sendSMS, checkSMS };