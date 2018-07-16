const assert = require("assert");
const axios = require("axios");

export async function getSupportedLangNames() {
    let url = "/api/supportedLangNames";
    let response = await axios.get(url);

    assert(response.status === 200);
    let data = response.data;

    return data["supportedLangNames"];
}

export async function translateAjax(srcText, type, options, isPublic) {
    let url = "/api/translate/ajax";
    let response = await axios.post(url, {
        srcText: srcText,
        type: type,
        options: options,
        isPublic: isPublic
    });

    assert(response.status === 200);
    let data = response.data;

    return data["translation"];
}

export async function translateEmail(srcText, type, options, isPublic, to) {
    let url = "/api/translate/email";
    let response = await axios.post(url, {
        srcText: srcText,
        type: type,
        options: options,
        isPublic: isPublic,
        to: to
    });

    assert(response.status === 200);
}

export async function getRecentTranslations() {
    let url = "/api/recentTranslations";
    let response = await axios.get(url);

    assert(response.status === 200);
    let data = response.data;

    return data["recentTranslations"];
}

export async function getTranslation(translationId) {
    try {
        let url = "/api/translations/" + translationId;
        let response = await axios.get(url);

        assert(response.status === 200);
        let data = response.data;

        return data["translation"];
    } catch (err) {
        if (err.response.status === 404) {
            return null;
        }

        throw err;
    }
}
