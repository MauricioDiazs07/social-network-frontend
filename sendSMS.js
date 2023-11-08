import base64 from 'react-native-base64'
import { encode } from 'base-64';
import {decode as atob, encode as btoa} from 'base-64'
import {
    ACCOUNT_SID_TWILIO,
    AUTH_TOKEN_TWILIO,
    PHONE_TWILIO,
    API_TWILIO } from './src/utils/api_constants'
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = ACCOUNT_SID_TWILIO
const authToken =  AUTH_TOKEN_TWILIO;

// const client = require('twilio')(accountSid, authToken);

// const sendSMS = async () => {
//   let msgOptions = {
//     to: '+527225572870',
//     channel: 'sms'
//   }
//   try {
//     const message = await client.verify.v2.services('VA12886b7880b46bd2bf9df30228b6b010')
//     .verifications
//     .create(msgOptions)
//     .then(verification => console.log(verification.status));

//     console.log('MY MESSAGE: ',message)
//   } catch(error) {
//     console.log('Error Twilio: ', error)
//   }
// }

// sendSMS('Holiii testing');

const credentials = `${accountSid}:${authToken}`;
console.log('MY credentials: ',credentials)

const sendSMS = async () => {
    const formData = new FormData();
    formData.append('To', `+527225572870`);
    formData.append('Channel', 'sms');
    console.log('MY formData: ',formData)
  
  try {

    const testMessage = await fetch('https://verify.twilio.com/v2/Services/VA12886b7880b46bd2bf9df30228b6b010/Verifications', {
        method: "POST", 
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Basic ' + base64.encode(credentials)
        }
    })
    .then(verification => console.log(verification.status));

  } catch(error) {
    console.log('Error Twilio: ', error)
  }
}

// sendSMS();
export default sendSMS;