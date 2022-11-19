const API_URL = 'http://4176-68-34-104-179.ngrok.io/'

function registerUser(bodyData) {
    return httpPostRequest('/register',bodyData)
}

function loginUser(bodyData) {
    return httpPostRequest('/login',bodyData);
}

function  httpPostRequest(route,bodyData) {
    return fetch(API_URL + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    }).then(response => response.json());
}