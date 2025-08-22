import { createContext, useState } from "react";

export const AppContext = createContext();  // (1) Create Context

{/*AppContextprovider is a wrapper component that holds the invoiceTitle state 
and makes it available to its entire subtree via AppContext. */}

export const initialInvoiceData = {
    title: "New Invoice",
    billing: { name: "", phone: "", address: "" },
    shipping: { name: "", phone: "", address: "" },
    invoice: { number: "", date: "", dueDate: "" },
    account: { name: "", number: "", ifscCode: "" },
    company: { name: "", phone: "", address: "" },
    tax: "",
    notes: "",
    items: [
        {name: "", qty:"", amount:"", description:"", total: 0}
    ],
    logo: ""  // Stores the base64 string of the uploaded logo
};

export const AppContextprovider = ({ children } ) => {  // (2) Define Provider Component

    // State for the invoice title
    const [invoiceTitle, setInvoiceTitle] = useState("New Invoice");  
    
    // State for the main invoice data object, initialized with `initialInvoiceData`
    const [invoiceData, setInvoiceData] = useState(initialInvoiceData);

    // State for tracking the currently selected template
    const [selectedTemplate, setSelectedTemplate] = useState("template1");

    const baseURL = import.meta.env.VITE_API_BASE_URL + "/api";

    // Changed baseURL (see up)
    //const baseURL = "http://localhost:8080/api";
    
    // (3) Bundle all state variables and their setters into a single object
    // This object will be passed down to all consuming components.
    const contextValue = {  
        invoiceTitle, setInvoiceTitle,
        invoiceData, setInvoiceData,
        selectedTemplate, setSelectedTemplate,
        initialInvoiceData,
        baseURL
    }

    return (
        // (4) Provide the bundled `contextValue` to all child components
        <AppContext.Provider value={contextValue}>  
            {children}
        </AppContext.Provider>
    )
}