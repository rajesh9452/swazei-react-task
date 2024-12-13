import axios from "axios";

const ApiBaseUrl = axios.create({
    baseURL: "http://127.0.0.1:8000/api/", // Replace with your Laravel backend URL
});

export default ApiBaseUrl;
