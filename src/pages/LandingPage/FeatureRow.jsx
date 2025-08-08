import React from 'react';

const FeatureRow = ( {imgSrc, altText, title, description, featuresList, isReversed} ) => {

    const rowClasses = `row align-items-center gy-4${isReversed ? ' flex-row-reverse' : ''}`; 

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/600x400/E0E0E0/000000?text=Error';
    }

    return (
        <div className={rowClasses}>

            <div className='col-md-6'>
                <img 
                    src={imgSrc}
                    className="img-fluid rounded shadow-lg"
                    alt={altText}
                    onError={handleImageError}
                />
            </div>

            <div className='col-md-6'>
                <h3 className="fw-bold mx-2">
                    {title}
                </h3>
                <p className="text-muted lead fs-6 mx-2">
                    {description}
                </p>
                <ul className='list-unstyled text-muted'>
                    {
                        featuresList.map((item, index) => (
                            <li key={index} className='mb-2'>
                                <i className="bi bi-check-circle-fill text-primary me-2"></i>{item}
                            </li>
                        ))
                    }
                </ul>

            </div>



        </div>
    );
}

export default FeatureRow;