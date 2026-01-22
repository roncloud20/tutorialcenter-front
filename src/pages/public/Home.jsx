import Footer from "../../components/pageComponents/public/Global/Footer";
import Navbar from "../../components/pageComponents/public/Global/Navbar";
import StickyButtons from "../../components/pageComponents/public/Global/StickyButtons";
import BenefitSection from "../../components/pageComponents/public/HomePage/BenefitSection";
import ContactSection from "../../components/pageComponents/public/HomePage/ContactSection";
import FaqSection from "../../components/pageComponents/public/HomePage/FaqSection";
import Hero from "../../components/pageComponents/public/HomePage/Hero";
import ProgramSection from "../../components/pageComponents/public/HomePage/ProgramSection";
import Slider from "../../components/pageComponents/public/HomePage/Slider";
import TestimonialSection from "../../components/pageComponents/public/HomePage/TestimonialSection";

const Home = () => {
    return (
        <>
            <Navbar />
            <StickyButtons />
            <Hero />
            <BenefitSection />
            <Slider />
            <ProgramSection />
            <TestimonialSection />
            <FaqSection />
            <ContactSection />
            <Footer />
        </>
    );
}
 
export default Home;