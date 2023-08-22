import { URL_API,
    USER_DATA
} from "../../utils/api_constants";

const getUserData = async (profile_id) => {
    const response = await fetch(URL_API + USER_DATA + profile_id, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    getUserData
}