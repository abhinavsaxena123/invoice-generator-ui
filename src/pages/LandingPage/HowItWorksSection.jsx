import React from 'react'
import HowItWorksCards from './HowItWorksCard';

const stepsData = [
    {
        stepNumber: 1,
        title: 'Enter Details',
        description: 'Quickly fill in your clients information, item descriptions, quantities, and prices. Our intuitive form makes it a breeze.',
        imgSrc: 'https://placehold.co/150x150/0D6EFD/FFFFFF?text=1&font=montserrat',
        bgColorClass: 'bg-primary-soft'
    },
    {
        stepNumber: 2,
        title: 'Choose Template',
        description: 'Browse our gallery of professionally designed templates. Pick one that matches your brand and style.',
        imgSrc: 'https://placehold.co/150x150/198754/FFFFFF?text=2&font=montserrat',
        bgColorClass: 'bg-success-soft'
    },
    {
        stepNumber: 3,
        title: 'Preview Invoice',
        description: 'See exactly how your invoice will look before sending it. Make any last-minute adjustments with ease.',
        imgSrc: 'https://placehold.co/150x150/FFC107/000000?text=3&font=montserrat',
        bgColorClass: 'bg-warning-soft'
    },
    {
        stepNumber: 4,
        title: 'Download & Save',
        description: 'Download your invoice as a PDF, send it directly via email, or save it for your records and future reference.',
        imgSrc: 'https://placehold.co/150x150/0DCAF0/FFFFFF?text=4&font=montserrat',
        bgColorClass: 'bg-info-soft'
    },
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-5 bg-light">
            <div className="container">

                <h2 className="text-center mb-5 display-7 fw-bold">
                    Get Started in 4 Simple Steps
                </h2>

                <div className="row g-4 justify-content-center">
                    {
                        stepsData.map((step) => (
                            <HowItWorksCards 
                                key={step.stepNumber}
                                stepNumber={step.stepNumber}
                                title={step.title}
                                description={step.description}
                                imgSrc={step.imgSrc}
                                bgColorClass={step.bgColorClass}
                            />
                        ))
                    }
                </div>

            </div>
        </section>
    );
}

export default HowItWorksSection;