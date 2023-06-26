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

export {
    authUser,
};