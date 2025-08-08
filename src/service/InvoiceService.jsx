import axios from "axios";  // (1) Import axios for making HTTP requests

// --- saveInvoice utility function ---
// This function sends an HTTP POST request to your backend to save an invoice.
export const saveInvoice = (baseURL, payload, token) => {

    // The URL is constructed by combining the baseURL and the specific endpoint "/invoices".
    // The 'payload' object is sent as the request body.
    return axios.post(`${baseURL}/invoices`, payload, {headers: {Authorization: `Bearer ${token}`}});
}

export const getAllInvoices = (baseURL, token) => {
    return axios.get(`${baseURL}/invoices`, {headers: {Authorization: `Bearer ${token}`}});
}

export const deleteInvoice = (baseURL, id, token) => {
    return axios.delete(`${baseURL}/invoices/${id}`, {headers: {Authorization: `Bearer ${token}`}});
}



