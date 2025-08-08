import React from 'react';
import { assets } from '../../assets/assets';
import FeatureRow from './FeatureRow';

const featuresData = [
     {
        imgSrc: assets.landing1,
        altText: 'Invoice Customization',
        title: 'Easy to Fill Invoice Details',
        description: 'Streamline your invoicing process. Our intuitive form lets you quickly add client information, item descriptions, quantities, and prices with ease.',
        featuresList: [
            'Curated list of templates from gallery to get you started.',
            'Effortlessly add your company logo and all essential invoice details.',
            'Tailor fields to your specific business needs for complete customization.'
        ],
        isReversed: false // Image on left, text on right
    },
    {
        imgSrc: assets.landing2,
        altText: 'Time Saving',
        title: 'Beautiful Dashboard',
        description: 'Gain a clear overview of your invoicing activity. Our beautiful dashboard provides quick access to all your previous invoices and key metrics.',
        featuresList: [
            'View all your past invoices in one organized place.',
            'Easily identify invoices with clear thumbnails and details.',
            'Save time by reusing existing invoice data for new bills.',
            'Track the status and history of all your invoices effectively.'
        ],
        isReversed: true // Image on right, text on left
    },
    {
        imgSrc: assets.landing3,
        altText: 'Invoice Preview',
        title: 'Invoice Preview with Action Buttons',
        description: 'See exactly how your invoice will look before it goes out. Our live preview ensures accuracy, and action buttons make final steps effortless.',
        featuresList: [
            'Get a real-time, live preview of your invoice as you build it.',
            'Effortlessly switch between multiple invoices for quick review.',
            'One-click options to Save, Download, and Delete invoices directly from the preview.'
        ],
        isReversed: false
    },
    {
        imgSrc: assets.landing4,
        altText: 'Send Invoices',
        title: 'Send Invoices Instantly',
        description: 'Don\'t waste time switching between applications. Send your professional invoices directly to your clients without ever leaving QuickInvoice.',
        featuresList: [
            'Send invoices instantly via email directly from the application.',
            'A single click is all it takes to dispatch your invoices.',
            'Enjoy the freedom to send an unlimited number of invoices.'
        ],
        isReversed: true
    }
]


const FeaturesSection = () => {

    return (
        <section id="features" className="py-5">
            <div className='container'>

                <h2 className='text-center mb-5 display-5 fw-bold'>
                    Why Choose QuickInvoice?
                </h2>

                {
                    featuresData.map((feature, index) => (
                        <React.Fragment key={index}>
                            <FeatureRow
                                imgSrc={feature.imgSrc}
                                altText={feature.altText}
                                title={feature.title}
                                description={feature.description}
                                featuresList={feature.featuresList}
                                isReversed={feature.isReversed}
                            />
                            {
                                index <featuresData.length - 1 && <div className='mt-5'></div>
                            }
                        </React.Fragment>
                    ))
                }

            </div>
        </section>
    );
}

export default FeaturesSection;