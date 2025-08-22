import axios from "axios";

// This function handles uploading an image/invoice to Cloudinary.
const uploadInvoiceThumbnail = async (imageData) => {
    
    // (1) Create a new FormData object.
    const formData = new FormData();

    // (2) Append the image data to the FormData object.
    formData.append('file', imageData);

    // (3) Append Cloudinary upload preset(it's like settings)
    formData.append('upload_preset', 'invoices-thumbnail');

    // (4) Append your Cloudinary cloud name(identifier)
    formData.append('cloud_name', 'dlzcq22u6');

    // (5) Send a POST request to Cloudinary's upload API endpoint using axios.
    const response = await axios.post(`https://api.cloudinary.com/v1_1/dlzcq22u6/image/upload`, formData);

    // (6) Return the 'secure_url' from Cloudinary's response.
    // Cloudinary's successful upload response contains various details, 
    // and 'secure_url' is the HTTPS URL of the uploaded image.
    return response.data.secure_url;
}

export default uploadInvoiceThumbnail;