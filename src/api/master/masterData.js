import { URL_API,
         GENERAL_DATA
} from "../../utils/api_constants";

const getGeneralData = async () => {
    const response = await fetch(URL_API + GENERAL_DATA, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    getGeneralData,
}