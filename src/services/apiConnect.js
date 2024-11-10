import axios from 'axios';

const apiConnect = (url, method, token, bodyData, params) => {
    axios.create({
        baseURL: process.env.REACT_APP_BASE_URL + url,
        method: method,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: bodyData || null,
        params: params || null,
    });
}

export default apiConnect;