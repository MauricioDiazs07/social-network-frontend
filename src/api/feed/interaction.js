import { URL_API,
    LIKE,
    DISLIKE,
    USER_DATA,
    MASTER_DATA
} from "../../utils/api_constants";

const addLike = async (profile_id,share_id,share_type) => {
    const response = await fetch(URL_API + LIKE, {
        method: 'POST',
        body: JSON.stringify({
            profile_id: profile_id,
            share_id: share_id,
            share_type: share_type
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const disLike = async (profile_id,share_id,share_type) => {
    const response = await fetch(URL_API + DISLIKE, {
        method: 'DELETE',
        body: JSON.stringify({
            profile_id: profile_id,
            share_id: share_id,
            share_type: share_type
        }),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const getUserData = async (profile_id) => {
    const response = await fetch(URL_API + USER_DATA + profile_id, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}


const getMasterData = async (profile_id) => {
    const response = await fetch(URL_API + MASTER_DATA + profile_id, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    addLike,
    disLike,
    getUserData,
    getMasterData
}