import { URL_API,
         GENERAL_DATA,
         SECTION_DATA,
         INTERESTS_DATA,
         INTERACTION_DATA,
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

const getSectionData = async (section) => {
    const response = await fetch(URL_API + SECTION_DATA + section, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const getInterestsData = async (interests) => {
    const response = await fetch(URL_API + INTERESTS_DATA + interests, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

const getInteractionData = async (section) => {
    const response = await fetch(URL_API + INTERACTION_DATA + section, {
        method: 'GET'
    });

    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
}

export {
    getGeneralData,
    getSectionData,
    getInterestsData,
    getInteractionData,
}