import { URL_API,
         GET_POSTS,
         CREATE_POSTS,
         GET_SHARE,
         EDIT_POST,
         DELETE_POST,
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

const editPost = async (id, text) => {
    const response = await fetch(URL_API + EDIT_POST, {
        method: 'POST',
        body: JSON.stringify({
            share_id: id,
            description: text
        }),
        headers: {
          'Content-Type': 'application/json',
        },
    });
    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const deletePost = async (post_id) => {
    const response = await fetch(URL_API + DELETE_POST, {
        method: 'DELETE',
        body: JSON.stringify({
            "shareId": post_id,
            "shareType": "POST"
        }),
        headers: {
          'Content-Type': 'application/json',
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
    editPost,
    deletePost,
}