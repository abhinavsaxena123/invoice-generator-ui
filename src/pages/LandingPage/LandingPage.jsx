import './LandingPage.css'; 
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import Logo from '../../components/Logo';

const LandingPage = () => {

    const handleActionButton = () => {
        if (user) {
            setInvoiceData(initialInvoiceData);
            setSelectedTemplate("template1");
            setInvoiceTitle("Create Invoice");
            navigate("/generate");
        } else {
            openSignIn({});
        }
    }

    return (
        <>
            <header id="hero" className="hero-section text-white text-center">
                <div className="container py-5 d-flex flex-column justify-content-center" style={{ minHeight: '85vh' }}>
                    
                    <div className="row py-lg-5">
                        <div className="col-lg-9 col-md-10 mx-auto">
                            <h1 className="display-3 fw-bold mb-4">
                                Effortless Invoicing. Professional Results.
                            </h1>
                            <p className="lead mb-5" style={{ fontSize: '1.3rem' }}>
                                Stop wrestling with spreadsheets. QuickInvoice helps you create and send beautiful invoices in minutes, so you get paid faster.
                            </p>
                            <p>
                                <button className="btn btn-lg btn-warning fw-bold rounded-pill my-2 mx-1 px-5 py-3">
                                    Generate Your First Invoice
                                </button>
                                <a href="#how-it-works" className="btn btn-lg btn-outline-light rounded-pill my-2 mx-1 px-5 py-3">
                                    Learn More
                                </a>
                            </p>
                        </div>
                    </div>

                </div>
            </header>

            {/* How It Works Section: Explains the process in steps using cards */}
            <HowItWorksSection />

            {/* Features Section: Highlights key benefits with images and text */}
            <FeaturesSection />

            {/* Call to Action Section: Final prompt for users to start */}
            <section id="generate-invoice" className="py-5 text-center bg-primary text-white">
                <div className="container">

                    <h2 className="display-5 fw-bold mb-3">
                        Ready to Streamline Your Invoicing?
                    </h2>

                    <p className="lead mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                        Join thousands of freelancers and small businesses who trust QuickInvoice.
                        Start creating professional invoices today – its fast, easy, and effective!
                    </p>

                    <button className="btn btn-lg btn-warning fw-bold rounded-pill px-5 py-3" 
                            onClick={handleActionButton}
                    >
                        Start Generating Invoices Now
                    </button>

                    <p className="mt-3 small">
                        (This will lead to the invoice generation interface)
                    </p>

                </div>
            </section>

            {/* Footer: Copyright and social media links */}
            <footer className="py-5 bg-dark text-white-50">
                <div className="container text-center">

                    <Logo />

                    <p className="text-white fw-bold mt-2">QuickInvoice</p>
                    <p className="mb-0">
                        &copy; {new Date().getFullYear()} QuickInvoice. All Rights Reserved.
                    </p>
                    <p className="mb-0 small">
                        Crafted with <i className="bi bi-heart-fill text-danger"></i> for freelancers and small businesses.
                    </p>
                    <p className="mt-2">
                        {/* Placeholder social media links */}
                        <a href="#" className="text-white-50 me-2">Twitter</a>
                        <a href="#" className="text-white-50 me-2">Facebook</a>
                        <a href="#" className="text-white-50">Linkedin</a>
                    </p>
                </div>
            </footer>

        
        </>
    );

}

export default LandingPage;