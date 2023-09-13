import { 
    URL_API,
    LOGIN,
    SIGNUP,
    READ_INE,
    READ_INE_2,
    INTERESTS_LIST
 } from "../../utils/api_constants";

const getAuthToken = async (email, password) => {

    const response = await fetch(URL_API + LOGIN, {
        method: "POST", 
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const token = await response.json();
    if (token && response.ok){
        return token;
    } else {
        return {
            success: false,
            error: 'Email o contraseña incorrectos',
        }
    }
}


/* method to send INE pic and get the information */
const readINE = async (ine_pic) => {
    const formData = new FormData();
    formData.append("INE", ine_pic, ine_pic.path);
    
    const response = await fetch(URL_API + READ_INE, {
        method: "POST",
        body: JSON.stringify({INE: ine_pic}),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const readINE_2 = async (ine_pic) => {

    const formData = new FormData();
    const imageData = {
        uri: ine_pic.path,
        name: `img_${1}.jpg`,
        type: ine_pic.mime,
      }
    formData.append("ine", imageData);
    
    const response = await fetch(URL_API + READ_INE_2, {
        method: "POST", 
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    
    resp = await response.json();
    if (response.ok) {
        console.log(resp);
        return resp;
    }
}

/* method to signup to the app */
const signUp = async (
    user
) => {
    const response = await fetch(URL_API + SIGNUP, {
        method: "POST", 
        body: JSON.stringify({
            ...user
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    resp = await response.json();
    if (response.ok){
        
        return resp;
    }
}

const signUp2 = async (
    user
) => {

    const form = new FormData()
    form.append('email', user['email'])
    form.append('password', user['password'])
    form.append('name', user['name'])
    form.append('gender', user['gender'])
    form.append('state', user['state'])
    form.append('municipality', user['municipality'])
    form.append('address', user['address'])
    form.append('birthday', user['birthday'])
    form.append('curp', user['curp'])
    form.append('phone', user['phone'])

    const value = user['identification_photo']
    const imageData = {
        uri: value.path,
        name: `img_${1}.jpg`,
        type: value.mime,
      }

    form.append('identification_photo', imageData);
    const response = await fetch(URL_API + SIGNUP, {
        method: "POST", 
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });

    resp = await response.json();
    if (response.ok){
        return resp;
    }
}

const getInterests = async () => {
    const response = await fetch(URL_API + INTERESTS_LIST, {
        method: 'GET'
    });

    resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    getAuthToken,
    readINE,
    readINE_2,
    signUp,
    signUp2,
    getInterests,
};