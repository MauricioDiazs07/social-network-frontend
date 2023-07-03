import { users } from "../constant"

const URL_API = 'https://762d-2806-2f0-a361-f356-214b-5128-b367-59b5.ngrok-free.app'

const authUser = (email, pass) => {
    // TODO: connection with auth user api
    const user = users.find(
        (user) => user.email==email && user.password==pass
    );

    if (user) {
        return user;
    }

    return {
        msg: 'Email o contraseña incorrectos',
    }
}

const getAuthToken = async (email, password) => {
    
    const response = await fetch(URL_API + '/api/login', {
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
    
    const response = await fetch(URL_API + '/api/user/self', {
        method: "POST", 
        body: JSON.stringify({
            email: email
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
    authUser,
    getAuthToken,
    getAuthData
};