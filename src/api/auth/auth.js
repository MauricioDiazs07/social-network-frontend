import { users } from "../constant"

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

async function getAuthToken (email, password) {
    
    console.log("Metodo para obtener token");
    const response = await fetch('https://9127-2806-2f0-a361-f356-4c45-835b-abd4-f2e.ngrok-free.app/api/login', {
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
        console.log(token['token']);
        return token['token'];
    } else {
        console.log('Email o contraseña incorrectos');
        return {
            msg: 'Email o contraseña incorrectos',
        }
    }
}

async function getAuthData (email) {
    
    console.log("Busqueda de datos de perfil");
    const response = await fetch('https://9127-2806-2f0-a361-f356-4c45-835b-abd4-f2e.ngrok-free.app/api/user/self', {
        method: "POST", 
        body: JSON.stringify({
            email: email
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })

    console.log(response)
    resp = await response.json()
    if (response.ok){
        console.log(resp);
        return resp
    }
    
}

export {
    authUser,
    getAuthToken,
    getAuthData
};