import { forwardRef } from "react"
import { FormatInvoiceData } from "../util/FormatInvoiceData";
import { templateComponents } from "../util/InvoiceTemplate";

const InvoicePreview = forwardRef( ({invoiceData, template}, ref) => {  //  Define a forwardRef component
    // Props received: invoiceData (the complete invoice data object)
    //                template (the ID of the selected template)
    //                ref (a ref forwarded from the parent component)

    const formattedData  = FormatInvoiceData(invoiceData);

    const SelectedTemplate = templateComponents[template] || templateComponents["template1"];

    return (
        // 'ref' allows the parent component to directly access this DOM element,
        // which is crucial for PDF generation tools
        <div ref={ref} className="invoice-preview container px-2 py-2 overflow-auto">
            <SelectedTemplate data={formattedData} />
        </div>
    )
});

export default InvoicePreview;