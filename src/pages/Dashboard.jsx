import { useContext, useEffect, useState } from "react";
import { AppContext, initialInvoiceData } from "../context/AppContext";
import { getAllInvoices } from "../service/InvoiceService";

import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { formatDate } from "../util/FormatInvoiceData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const Dashboard = () => {

    const [invoices, setInvoices] = useState([]);
    const {baseURL, setInvoiceData, setSelectedTemplate, setInvoiceTitle} = useContext(AppContext);

    const navigate = useNavigate();
    const {getToken} = useAuth();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = await getToken();
                const response = await getAllInvoices(baseURL, token);
                console.log(response.data);
                if (Array.isArray(response.data)) {
                    setInvoices(response.data);
                } else {
                    console.warn("API response for invoices was not an array:", response.data);
                    setInvoices([]); // Set to empty array to prevent map error
                    toast.error("Received unexpected data format for invoices.");
                }
                //setInvoices(response.data);
            } catch (error) {
                toast.error('Failed to load the invoices', error);
                toast.error('Failed to load the invoices. Please try again.');
                setInvoices([]);
            }
        }

        fetchInvoices();
    }, [baseURL, getToken]);


    const handleViewClick = (invoice) => {

        setInvoiceData(invoice);
        setSelectedTemplate(invoice.template || "template1");
        setInvoiceTitle(invoice.title || "New Invoice");
        navigate('/preview');
    }

    const handleCreateNew = () => {
        setInvoiceTitle("New Invoice");
        setSelectedTemplate("template1");
        setInvoiceData(initialInvoiceData);
        navigate("/generate")
    }

    return (
        <div className="container py-4">

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                
                {/* Create new Invoice card */}
                <div className="col">
                    <div onClick={handleCreateNew} className="card h-170 d-flex justify-content-center align-items-center border border-2 border-light shadow-sm cursor-pointer" style={{minHeight: '250px'}}>
                        <Plus size={35} />
                        <p className="mt-3 fw-medium">
                            Create New Invoice
                        </p>
                    </div>
                </div>

                {/* Render the existing invoices */}
                {
                    invoices.map((invoice, idx) => (
                        <div className="col" key={idx}>
                            <div className="card h-100 shadow-sm cursor-pointer" 
                                style={{minHeight: '200px'}}
                                onClick={() => handleViewClick(invoice)}
                            >
                                {invoice.thumbnailUrl && (
                                    <img src={invoice.thumbnailUrl} 
                                        alt="Invoice Thumbnail" 
                                        className="card-img-top" 
                                        style={{height: "190px", objectFit: "cover" }} 
                                    />
                                )}

                                <div className="card-body">
                                    <h6 className="card-title mb-1">{invoice.title}</h6>
                                    <small className="text-muted">
                                        Last Updated: {formatDate(invoice.lastUpdatedAt)}
                                    </small>
                                </div>

                            </div>
                        </div>
                    ))
                }
                
            </div>
        </div>
    );

}

export default Dashboard;