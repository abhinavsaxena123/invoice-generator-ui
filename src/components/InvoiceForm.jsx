import { Trash2 } from "lucide-react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect } from "react";

const InvoiceForm = () => {

    // (1) Consume the global state from AppContext
    const {invoiceData, setInvoiceData} = useContext(AppContext);

    // (2) Generic handler for top-level sections (company, billing, shipping, invoice, account)
    const handleChange = (section, field, value) => {
        setInvoiceData((prev) => ({
            ...prev,  // Copy all previous invoiceData
            [section]: {   // Update the specific section 
                ...prev[section],   // Copy all previous fields within that section
                [field]: value    // Update the specific field with the new value
            },
        } 
        ));
        //console.log(invoiceData);
    };

    // (3) Handler for changes within the 'items' array
    const handleItemChange = (index, field, value) => {
        // Create a mutable copy of the items array
        const items = [...invoiceData.items];
        // Update the specific field of the item at the given index
        items[index][field] = value;

        // Recalculate total if quantity or amount changes
        if(field == "qty" || field == "amount") {
            const qty = Number(items[index].qty) || 0;
            const amount = Number(items[index].amount) || 0;
            items[index].total = qty * amount;
        }

        // Update the invoiceData state with the modified items array
        setInvoiceData((prev) => ({...prev, items}));
    };

    // (4) Function to add a new item row to the invoice
    const addItem = () => {
        setInvoiceData((prev) => ( {
                ...prev,
                items: [
                    ...prev.items,  // Keep existing items
                    {name: "", qty: "", amount: "", total: 0, description: ""},
                ],
            }));
    };

     // (5) Function to delete an item row from the invoice
    const deleteItem = (index) => {
        // Filter out the item at the given index
        const items = invoiceData.items.filter((_, i) => i != index);
        setInvoiceData((prev) => ({...prev, items })); // Update state with the new items array
    };

    // (6) Function to copy billing details to shipping details
    const handleSameAsBilling = (e) => {
        // Only update if the checkbox is checked
        if(e.target.checked) {
            setInvoiceData((prev) => ({
                    ...prev,
                    shipping: {...prev.billing},  // Copy billing object to shipping
                }
            ));
        }
    };

    // (7) Function to calculate subtotal, tax amount, and grand total
    const calculateTotals = () => {
        // Calculate subtotal by summing up all item totals
        const subtotal = invoiceData.items.reduce( (sum, item) => sum + ( Number(item.total) || 0), 0 );
        
        // Get tax rate, default to 0 if not a valid number
        const taxRate = Number(invoiceData.tax || 0);
        // Calculate tax amount
        const taxAmount = (subtotal * taxRate) / 100;
        // Calculate grand total
        const grandTotal = subtotal + taxAmount;

        return { subtotal, taxAmount, grandTotal };
    }

    // (8) Destructure calculated totals for direct use in JSX
    const { subtotal, taxAmount, grandTotal } = calculateTotals();

    // (9) Handler for company logo file upload
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];   // Get the first selected file

        if(file) {
            const reader = new FileReader();  // Create a FileReader instance

            reader.onloadend = () => {
                // When the file is done reading, set its result (base64 URL) as the logo
                setInvoiceData((prev) => ({
                        ...prev,
                        logo: reader.result
                }));
            };

            reader.readAsDataURL(file);  // Read the file as a Data URL (base64)
        }
    };

    // (10) useEffect hook to generate an invoice number on component mount
    useEffect( () => {
        // Only generate if it's not already set (for example, editing an existing invoice)
        if(!invoiceData.invoice.number) {
            const randomNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
            
            setInvoiceData((prev) => ({
                ...prev,
                invoice: {...prev.invoice, number: randomNumber},
            }));
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    return (

        <div className="invoiceform container py-4">
            
            {/* Company Logo */}
            <div className="mb-4">
                <h5>Company Logo</h5>

                <div className="d-flex align-items-center gap-3">
                    <label htmlFor="image" className="form-label">
                        <img 
                            src={invoiceData.logo ? invoiceData.logo : assets.upload_area} 
                            alt="Company Logo Upload Area" 
                            width={98} 
                            style={{ cursor: 'pointer' }}
                        />
                    </label>
                    <input 
                        type="file" 
                        name="logo" 
                        id="image" 
                        hidden   // Hides the default file input button
                        className="form-control"
                        accept="image/*"   // Restrict to image file types
                        onChange={handleLogoUpload}
                    />
                </div>
            </div>

            {/* Company Info */}
            <div className="mb-4">
                <h5>Your Company</h5>

                <div className="row g-3">

                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Company name" 
                            onChange={(e) => handleChange("company", "name", e.target.value)}
                            value={invoiceData.company.name}
                        />
                    </div>

                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Company Phone" 
                            value={invoiceData.company.phone}
                            onChange={(e) => handleChange("company", "phone", e.target.value)}
                        />
                    </div>

                    <div className="col-md-12">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Company Address" 
                            value={invoiceData.company.address}
                            onChange={(e) => handleChange("company", "address", e.target.value)}
                        />
                    </div>
                    
                </div>

            </div>
            
            {/* Bill to */}
            <div className="mb-4">
                <h5>Bill To</h5>

                <div className="row g-3">
                    
                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Name" 
                            value={invoiceData.billing.name}
                            onChange={(e) => handleChange("billing", "name", e.target.value)}
                        />
                    </div>

                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Phone" 
                            value={invoiceData.billing.phone}
                            onChange={(e) => handleChange("billing", "phone", e.target.value)}
                        />
                    </div>

                    <div className="col-md-12">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Billing Address" 
                            value={invoiceData.billing.address}
                            onChange={(e) =>handleChange("billing", "address", e.target.value)} 
                        />
                    </div>

                </div>
            </div>
            
            {/* Ship to */}
            <div className="mb-4">
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Ship To</h5>

                    {/*For Checkbox (Same as Billing details) */}
                    <div className="form-check">
                        <input 
                            type="checkbox" 
                            className="form-check-input" 
                            id="sameAsBilling" 
                            onChange={handleSameAsBilling}
                        />
                        <label htmlFor="sameAsBilling" className="form-check-label">
                            Same as Billing
                        </label>
                    </div>

                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Name" 
                            value={invoiceData.shipping.name}
                            onChange={(e) => handleChange("shipping", "name", e.target.value)}
                        />
                    </div>

                    <div className="col-md-6">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Phone" 
                            value={invoiceData.shipping.phone}
                            onChange={(e) =>handleChange("shipping", "phone", e.target.value)}
                        />
                    </div>

                    <div className="col-md-12">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Shipping Address" 
                            value={invoiceData.shipping.address}
                            onChange={(e) => handleChange("shipping", "address", e.target.value)}
                        />
                    </div>

                </div>
            </div>
            
            {/* Invoice info */}
            <div className="mb-4">

                <h5>Invoice Information</h5>

                <div className="row g-3">
                    
                    <div className="col-md-4">
                        <label htmlFor="invoiceNumber" className="form-label">
                            Invoice Number
                        </label>
                        <input 
                            disabled  // Invoice number is auto-generated and shouldn't be edited by user
                            type="text" 
                            className="form-control" 
                            id="invoiceNumber"
                            value={invoiceData.invoice.number}
                            onChange={(e) =>handleChange("invoice", "number", e.target.value)}  // Keep handler for consistency
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">
                            Invoice Date
                        </label>
                        <input 
                            type="date" 
                            className="form-control" 
                            id="invoiceDate"
                            value={invoiceData.invoice.date}
                            onChange={(e) => handleChange("invoice", "date", e.target.value)}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">
                            Invoice Due Date
                        </label>
                        <input 
                            type="date" 
                            className="form-control"  
                            id="invoiceDueDate"
                            value={invoiceData.invoice.dueDate}
                            onChange={(e) => handleChange("invoice", "dueDate", e.target.value)}
                        />
                    </div>

                </div>

            </div>
            
            {/* Item details */}
            <div className="mb-4">

                <h5>Item Details</h5>
                {
                    invoiceData.items.map((item, index) => (
                        <div key={index} className="card p-3 mb-3">
                            <div className="row g-2 mb-2">
                                <div className="col-md-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Item Name" 
                                        value={item.name}
                                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Qty" 
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, "qty", Number(e.target.value))}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Amount" 
                                        value={item.amount}
                                        onChange={(e) => handleItemChange(index, "amount", Number(e.target.value))}
                                    />
                                </div>

                                <div className="col-md-3">
                                    <input 
                                        type="number" 
                                        className="form-control bg-light" 
                                        placeholder="Total" 
                                        value={item.total.toFixed(2)}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <textarea 
                                    className="form-control" 
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                />
                                {
                                    // Only show delete button if there's more than one item
                                    invoiceData.items.length > 1 && (
                                        <button 
                                            className="btn btn-outline-danger" 
                                            type="button"
                                            onClick={() => deleteItem(index)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    ))
                } 

                <button onClick={addItem} className="btn btn-primary" type="button">
                    Add Item
                </button>

            </div>
            
            {/* Bank account info */}
            <div className="mb-4">

                <h5>Bank Account Details</h5>

                <div className="row g-3">
                    
                    <div className="col-md-4">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Account Name"
                            value={invoiceData.account.name}
                            onChange={(e) => handleChange("account", "name", e.target.value)} 
                        />
                    </div>

                    <div className="col-md-4">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Account Number" 
                            value={invoiceData.account.number}
                            onChange={(e) => handleChange("account", "number", e.target.value)} 
                        />
                    </div>

                    <div className="col-md-4">
                        <input 
                            type="text" 
                            className="form-control"  
                            placeholder="IFSC Code" 
                            value={invoiceData.account.ifscCode}
                            onChange={(e) => handleChange("account", "ifscCode", e.target.value)} 
                        />
                    </div>

                </div>

            </div>
            
            {/* Totals */}
            <div className="mb-4">
                
                <h5>Totals</h5>

                <div className="d-flex justify-content-end">
                    
                    <div className="w-100 w-md-50">
                        
                        <div className="d-flex justify-content-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center my-2">
                            <label htmlFor="taxInput" className="me-2">
                                Tax Rate(%)
                            </label>
                            <input 
                                type="number" 
                                id="taxInput" 
                                className="form-control w-25 text-end" 
                                value={invoiceData.tax}
                                onChange={(e) =>  setInvoiceData((prev) => ({...prev, tax: Number(e.target.value)}))}
                            />
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>Tax Amount</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>

                        <div className="d-flex justify-content-between fw-bold mt-2">
                            <span>Grand Total</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Notes */}
            <div className="mb-4">
                <h5>Notes:</h5>

                <div className="w-100">
                    <textarea 
                        name="notes" 
                        className="form-control" 
                        rows={3}
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData((prev) => ({...prev, notes: e.target.value}))}  
                    >
                    </textarea>
                </div>

            </div>

            {/* <button onClick={handleSubmit}>
                SUBMIT
            </button>*/}
            
        </div>

    );
}

export default InvoiceForm;