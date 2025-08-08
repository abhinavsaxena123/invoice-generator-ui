import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePdfFromElement = async (element, filename = "invoice.pdf", returnBlob = false) => {

    // Check if the element exists to avoid errors.
    if (!element) {
        console.error("The provided element does not exist.");
        if (returnBlob) {
            return new Blob(); // Return an empty Blob to prevent crashes
        }
        return; 
    }

    // Step 1: Convert the HTML element to a canvas image.
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
        scrollY: -window.scrollY
    });

    // Step 2: Convert the canvas to an image data URL.
    const imgData = canvas.toDataURL("image/jpeg");

    // Step 3: Initialize jsPDF. "p" for portrait, "pt" for points, "a4" for page size.
    const pdf = new jsPDF("p", "pt", "a4");

    // Step 4: Get image properties to calculate proper scaling.
    const imgProps = pdf.getImageProperties(imgData);

    // Step 5: Calculate dimensions to fit the image to the PDF page while maintaining aspect ratio.
    const pdfdWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfdWidth) / imgProps.width;
    
    // Step 6: Add the image to the PDF.
    pdf.addImage(imgData, "JPEG", 0, 0, pdfdWidth, pdfHeight);

    // Step 7: Handle return or download based on the 'returnBlob' flag.
    if(returnBlob) {
        return pdf.output("blob");
    } 
    else {
        pdf.save(filename);
    }
}