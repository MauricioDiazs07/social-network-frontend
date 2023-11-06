import { 
    URL_API,
    LOGIN,
    SIGNUP,
    READ_INE,
    READ_INE_2,
    INTERESTS_LIST,
    UPDATE_INTERESTS,
 } from "../../utils/api_constants";

const getAuthToken = async (phoneNumber, password) => {
    const response = await fetch(URL_API + LOGIN, {
        method: "POST", 
        body: JSON.stringify({
            phoneNumber: phoneNumber,
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
        return resp;
    }
}

const readINE_3 = async (ine_pic) => {
    const formData = new FormData();
    const imageData = {
        uri: ine_pic,
        name: `img_${1}.jpg`,
        type: 'image/jpeg',
    } 
    // console.log('imageData', imageData);
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
        return resp;
    }
}

/* method to signup to the app */
const signUp = async (
    user
) => {
    const form = new FormData()
    form.append('phone', user['phone'])
    form.append('password', user['password'])
    form.append('name', user['name'])
    form.append('gender', user['gender'])
    form.append('state', user['state'])
    form.append('municipality', user['municipality'])
    form.append('section', user['section'])
    form.append('address', user['address'])
    form.append('birthday', user['birthday'])
    form.append('curp', user['curp'])
    form.append('email', user['email'])
    
    const value = user['identification_photo'];
    let imageData1;
    if (!Object.keys(value).includes('mime')){
        imageData1 = {
            uri: value,
            name: `img_${1}.jpg`,
            type: 'image/jpg',
        }
    } else {
        imageData1 = {
            uri: value.path,
            name: value.path.split("/").pop(),
            type: value.mime,
        }
    }
    
    if (user['profile_photo'] != ''){
        const imageData2 = {
            uri: user['profile_photo'].path,
            name: user['profile_photo'].path.split("/").pop(),
            type: user['profile_photo'].mime,
        }
        form.append('profile_photo', imageData2)
    }
    form.append('identification_photo', imageData1);
    console.log('Datos de registro: ', form);

    const response = await fetch(URL_API + SIGNUP, {
        method: "POST", 
        body: form,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    resp = await response.json();
    return resp;
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

const updateInterests = async (
    profile_id,
    interests
) => {
    const response = await fetch(URL_API + UPDATE_INTERESTS, {
        method: "POST", 
        body: JSON.stringify({
            profile_id: profile_id,
            interest: interests
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

export {
    getAuthToken,
    readINE,
    readINE_2,
    readINE_3,
    signUp,
    getInterests,
    updateInterests,
};