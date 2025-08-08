import axios from "axios";

export const sendInvoice = (baseURL, formData, token) => {
    return axios.post(`${baseURL}/emails/sendInvoice`, formData, {headers: {Authorization: `Bearer ${token}`}});
}