import { URL_API,
    LIKE,
    DISLIKE,
    ADD_COMMENT,
    USER_DATA,
    MASTER_DATA,
    PROFILE_DATA,
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

const addComment = async (profileId, shareId, text) => {
    const response = await fetch(URL_API + ADD_COMMENT, {
        method: 'POST',
        body: JSON.stringify({
            profile_id: profileId,
            share_id: shareId,
            share_type: 'POST',
            text: text
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

const getProfileData = async (profile_id) => {
    const response = await fetch(URL_API + PROFILE_DATA + profile_id, {
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
    addComment,
    getUserData,
    getMasterData,
    getProfileData
}