import { URL_API, LOGIN, SIGNUP, USER_DATA } from "../../utils/constants";

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
    })
    const token = await response.json()
    if (token && response.ok){
        return token;
    } else {
        return {
            success: false,
            error: 'Email o contraseña incorrectos',
        }
    }
}

const getAuthData = async (email) => {
    
    const response = await fetch(URL_API + USER_DATA, {
        method: "POST", 
        body: JSON.stringify({
            email: email
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })

    resp = await response.json();
    if (response.ok){
        return resp
    }
}

/* method to send INE pic and get the information */
const readINE = async (ine_pic) => {
    const response = await fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
            ine_pic
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

/* Falta probar este metodo :D JY */
const signUp = async (
    email,
    password,
    name,
    gender,
    state,
    municipality,
    colony,
    street,
    int_number,
    ext_number,
    birthday,
    curp,
    identification_photo
) => {
    const response = await fetch(URL_API + SIGNUP, {
        method: "POST", 
        body: JSON.stringify({
            email,
            password,
            name,
            gender,
            state,
            municipality,
            colony,
            street,
            int_number,
            ext_number,
            birthday,
            curp,
            identification_photo
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
    getAuthData,
    signUp,
    readINE,
};