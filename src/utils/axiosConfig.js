import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'; // Use 'csrftoken' instead of 'crsftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'; // Use 'X-CSRFToken' instead of 'X-CRSFToken'
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

export default client;