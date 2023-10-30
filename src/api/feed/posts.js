import { URL_API,
         GET_POSTS,
         CREATE_POSTS,
         GET_SHARE,
 } from "../../utils/api_constants";

const getPosts = async (profile_id) => {
    const response = await fetch(URL_API + GET_POSTS, {
        method: 'POST',
        body: JSON.stringify({
            profile_id: profile_id
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

const createPost = async (form) => {
    const response = await fetch(URL_API + CREATE_POSTS, {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const getShare = async (postId) => {
    const response = await fetch(URL_API + GET_SHARE, {
        method: 'POST',
        body: JSON.stringify({
            share_id: postId,
            share_type: 'POST'
        }),
        headers: {
            'Content-type': 'application/json'
          },
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    getPosts,
    createPost,
    getShare,
}