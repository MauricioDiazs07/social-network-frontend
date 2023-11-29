import { URL_API,
    USER_DATA,
    USER_UPDATE,
    USER_BY_PHONE
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

const getUserDataByPhone = async (phone_no) => {
    const response = await fetch(URL_API + USER_BY_PHONE + phone_no, {
        method: 'GET'
    });
    
    const resp = await response.json();
    return resp;
}

const updateUserData = async (
    profile_id,
    email,
    phone_number,
    profile_photo
) => {
    const form = new FormData();
    form.append('profile_id',profile_id)
    form.append('email',email)
    form.append('phone_number', phone_number)

    if (profile_photo != '' ){
        const imageData = {
            uri: profile_photo.path,
            name: profile_photo.path.split("/").pop(),
            type: profile_photo.mime,
        }
        form.append('profile_photo', imageData)
    }
    
    const response = await fetch(URL_API + USER_UPDATE, {
        method : 'PATCH',
        body: form,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })

    resp = await response.json();
    if (response.ok){
        return resp;
    }
}

export {
    getUserData,
    updateUserData,
    getUserDataByPhone
}