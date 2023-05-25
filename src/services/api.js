import axios from "axios";

const api = axios.create({
    baseURL: "https://v6.exchangerate-api.com/v6/88882f44ed24bf86119746e1/latest/USD",
});

export default api;