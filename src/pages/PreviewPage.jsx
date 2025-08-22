import { useContext, useEffect } from "react";
import { templates } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import InvoicePreview from '../components/InvoicePreview';
import { deleteInvoice, saveInvoice } from "../service/InvoiceService";
import html2canvas from "html2canvas";

import uploadInvoiceThumbnail from '../service/cloudinaryService';
import { generatePdfFromElement } from "../util/pdfUtils";
import { sendInvoice } from "../service/EmailService";
import { useAuth, useUser } from "@clerk/clerk-react";

const PreviewPage = () => {

    const previewRef = useRef();  // Create a ref to attach to the InvoicePreview component

    // Consume state from AppContext
    const { selectedTemplate, invoiceData, setSelectedTemplate, baseURL } =  useContext(AppContext);

    const [loading, setLoading] = useState(false); // To manage the loading state of the save button
    const navigate = useNavigate();      // Hook for navigating between routes

    const [downloading, setDownloading] = useState(false);

    const [showModal, setShowModal] = useState();
    const [customerEmail, setCustomerEmail] = useState('');
    const [emailing, setEmailing] = useState(false);

    const {getToken} = useAuth();
    const {user} = useUser();

    useEffect(() => {
        if(!invoiceData || !invoiceData.items?.length) {
            toast.error("Invoice data is empty!");
            navigate("/dashboard");
        }
    },[invoiceData, navigate]);

    // Asynchronous function to handle the "Save and Exit" button click.
    const handleSaveAndExit = async () => {
        try {
            setLoading(true);   // Set loading to true to disable button and show feedback

            //Create thumbnail url
            const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#fff",
                scrollY: -window.scrollY,
            });
            
            const imageData = canvas.toDataURL("image/png");

            const thumbnailUrl = await uploadInvoiceThumbnail(imageData);

            // The backend (InvoiceController) expects an 'Invoice' object, which should match
            // the structure of 'invoiceData' after adding 'template'.
            const payload = {
                ...invoiceData,
                clerkId: user.id,
                thumbnailUrl,
                template: selectedTemplate,
            }

            const token = await getToken();
            const resposne = await saveInvoice(baseURL, payload, token);
            
            if(resposne.status === 200){
                toast.success("Invoice Saved Successfully");
                navigate("/dashboard");
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to save the invoice", error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {

        // Display a confirmation dialog to prevent accidental deletion
        if(!window.confirm("Are you sure you want to delete this invoice?")) {
            return;  // Exit the function if the user cancels
        }

        //Handle the case for an existing invoice with an ID.
        try {
            const token = await getToken();
            const response = await deleteInvoice(baseURL, invoiceData.id, token);

            if(response.status === 204) {
                toast.success("Invoice Deleted Successfully.");
                navigate("/dashboard");
            } 
            else {
                toast.error("Unable to delete invoice.");
            }
        } catch (error) {
            console.error("Deletion failed:", error);
            if(error.response && error.response.status === 404) {
                toast.error("Invoice not found.");
            }
            else {
                toast.error(`Failed to delete the invoice: ${error.message}`);
            }
        }
    }

    const handleDownloadPdf = async () => {
        if(!previewRef.current) {
            return;
        }

        try {
            setDownloading(true);
            await generatePdfFromElement(previewRef.current, `invoice_${Date.now()}.pdf`);
            toast.success("PDF download started.");
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            toast.error(`Failed to generate invoice: ${error.message || 'An unknown error occurred.'}`);
        } finally {
            setDownloading(false);
        }
    }

    const handleSendEmail = async () => {

        setEmailing(true);

        if(!previewRef.current || !customerEmail) {
            setEmailing(false);
            return toast.error("Please enter a valid email and try again.");
        }

        try {
            const filename = `invoice_${Date.now()}.pdf`;
            const pdfBlob = await generatePdfFromElement(previewRef.current, filename, true);

            const formData = new FormData();
            formData.append("file", pdfBlob, filename);
            formData.append("email", customerEmail);
            
            const token = await getToken();
            const response = await sendInvoice(baseURL, formData, token);

            if(response.status === 200){
                toast.success("Email Sent Successfully.");
                setShowModal(false);
                setCustomerEmail("");
            }
            else {
                toast.error("Failed to send email.");
            }
        } catch(error) {
            console.error("Email sending failed:", error); 
            if(error.response) {
                toast.error(`Failed to send email: ${error.response.data || 'Server error'}`);
            }
            else {
                toast.error(`Failed to send email: ${error.message}`);
            }
        } finally {
            setEmailing(false);
        }
    }

    // useEffect(() => {
    //     if(!invoiceData || !invoiceData.items?.length) {
    //         toast.error("Invoice data is empty!");
    //         navigate("/dashboard");
    //     }
    // },[invoiceData, navigate]);

    return (
        
        <div className="previewpage container-fluid d-flex flex-column p-3 min-vh-100">

            {/* Action buttons */}
            <div className="d-flex flex-column align-items-center mb-4 gap-3">
                {/* List of template buttons */}
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                    {
                        templates.map(({id, label}) => (  //  Map over the 'templates' array
                            <button 
                                key={id}
                                style={{minWidth: "100px", height: "38px"}}
                                className={`btn btn-sm rounded-pill p-2 ${selectedTemplate === id ? 'btn-warning': 'btn-outline-secondary'}`}
                                onClick={() => setSelectedTemplate(id)}
                            >
                                {label}
                            </button>
                        ))
                    }
                </div>

                {/* List of actions */}
                <div className="d-flex flex-wrap  justify-content-center gap-3">

                    <button 
                        className="btn btn-primary d-flex align-items-center justify-content-center"
                        onClick={handleSaveAndExit}
                        disabled = {loading}
                    >
                            { loading && <Loader2 className="me-2 spin-animation" size={18} /> }
                            {loading ? "Saving..." : "Save and Exit"}
                    </button>

                    {/* Conditional Rendering for the Delete button */}
                    {
                        invoiceData.id && (
                        <button onClick={handleDelete} className="btn btn-danger">
                            Delete Invoice
                        </button>
                    )}

                    <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
                        Back to Dashboard
                    </button>

                    <button onClick={() => setShowModal(true)} className="btn btn-info">
                        Send Email
                    </button>
                    
                    <button onClick={handleDownloadPdf} disabled={loading} className="btn btn-success d-flex align-items-center justify-content-center">
                        {downloading && (
                            <Loader2 className="me-2 spin-animation" size={18} />
                        )}
                        {downloading ? "Downloading.." : "Download PDF"}
                    </button>
                    
                </div>
            </div>

            {/* Display the invoice Preview */}
            <div className="flex-grow-1 overflow-auto d-flex justify-content-center align-items-start bg-light py-3">
                <div ref={previewRef} className="invoice-preview">
                    <InvoicePreview 
                        ref={previewRef}  //  Pass the ref to InvoicePreview
                        invoiceData={invoiceData}    // Pass the global invoice data
                        template={selectedTemplate}    // Pass the currently selected template ID
                    />
                </div>
            </div>

            {showModal && (
                <div className="modal d-block" 
                    role="dialog" 
                    tabIndex="-1" 
                    style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            
                            <div className="modal-header">
                                <h5 className="modal-title">Send Invoice</h5>
                                <button onClick={() => setShowModal(false)} type="button" className="btn-close"></button>
                            </div>

                            <div className="modal-body">
                                <input onChange={(e) => setCustomerEmail(e.target.value)} value={customerEmail} type="email" className="form-control" placeholder="Customer email" />
                            </div>

                            <div className="modal-footer">
                                <button onClick={handleSendEmail} disabled={emailing} type="button" className="btn btn-primary">
                                    {emailing ? "Sending": "Send"}
                                </button>
                                <button onClick={() => setShowModal(false)} type="text" className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}

export default PreviewPage;