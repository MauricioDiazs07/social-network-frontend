import { 
    URL_API,
    LOGIN,
    SIGNUP,
    USER_DATA,
    READ_INE } from "../../utils/api_constants";

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

export {
    getAuthToken,
    getAuthData,
    readINE,
    signUp,
};