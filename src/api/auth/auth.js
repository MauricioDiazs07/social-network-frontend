const URL_API = ''
const LOGIN = '/api/auth/login'
const SIGNUP = '/api/auth/signup'
const USER_DATA = '/api/user/self'


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

/* Falta probar este metodo :D JY */
const signup = async (email, password, name,gender,state,municipality,colony,street,int_number,ext_number,birthday,curp,identification_photo) =>{
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
    })

    resp = await response.json()
    if (response.ok){
        return resp
    }
}

export {
    getAuthToken,
    getAuthData,
    signup
};