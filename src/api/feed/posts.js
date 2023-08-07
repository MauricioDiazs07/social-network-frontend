import { URL_API,
         GET_POSTS,
         CREATE_POSTS
 } from "../../utils/api_constants";

const getPosts = async () => {
    const response = await fetch(URL_API + GET_POSTS, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const createPost = async (form) => {
    console.log("FORM", form);
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

export {
    getPosts,
    createPost
}