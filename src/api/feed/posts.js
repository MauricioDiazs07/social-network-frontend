import { URL_API,
         GET_POSTS,
         CREATE_POSTS
 } from "../../utils/api_constants";

const getPosts = async () => {
    const response = fetch(URL_API + GET_POSTS, {
        method: 'GET'
    });

    const resp = await response.json();
    console.log(resp);
    if (response.ok) {
        return resp;
    }
}

const createPost = async (form) => {
    // const response = fetch(URL_API + CREATE_POSTS, {
    //     method: 'POST',
    //     body: form
    // });

    // const resp = await response.json();
    // if (response.ok) {
    //     return resp;
    // }

    /* TESTING */
    console.log("FORM:", form);
    return 'holi';
}

export {
    getPosts,
    createPost
}