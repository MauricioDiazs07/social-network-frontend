import { URL_API,
         MASTER_DATA
} from "../../utils/api_constants";

const updateAdminProfile = async (
    profile_id,
    name,
    email,
    description,
    profile_photo
) => {
    const form = new FormData();
    form.append('profile_id', profile_id);
    form.append('name', name);
    form.append('email', email);
    form.append('description', description);

    if (profile_photo != '' ){
        const imageData = {
            uri: profile_photo.path,
            name: profile_photo.path.split("/").pop(),
            type: profile_photo.mime,
        }
        form.append('profile_photo', imageData)
    }

    const response = await fetch(URL_API + MASTER_DATA, {
        body: form,
        method: 'PUT'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    updateAdminProfile,
}