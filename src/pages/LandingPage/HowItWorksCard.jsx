import React from 'react';

const HowItWorksCards = ({ stepNumber, title, description, imgSrc, bgColorClass }) => {

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/150x150/E0E0E0/000000?text=Error';
    };

    return (
        <div className="col-md-6 col-lg-3 d-flex">
            <div className="card h-100 shadow-sm border-0 text-center flex-fill">
                
                <div className={`card-img-top-container d-flex align-items-center justify-content-center p-4 ${bgColorClass}`}>  
                    <img 
                        src={imgSrc}
                        className="rounded-circle"
                        alt={title}
                        onError={handleImageError}
                    />
                </div>

                <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-2 fs-7">{title}</h5>
                    <p className="card-text text-muted small">{description}</p>
                </div>

            </div>
        </div>
    );
}

export default HowItWorksCards;