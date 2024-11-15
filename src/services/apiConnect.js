import axios from 'axios';
export const axiosInstance = axios.create({});

const apiConnector = (method, url, bodyData, header, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        timeout: 10000,
        headers: header ? header : null,
        data: bodyData ? bodyData : null,
        params: params ? params : null,
    });
}

export default apiConnector;