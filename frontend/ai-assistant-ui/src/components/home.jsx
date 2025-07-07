import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero/Hero';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';
import CTASection from './CTASection';

const Home = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-transparent">
      <Hero />
      <FeaturesSection />
      <CTASection/> 
      <Footer/> 
     
    </div>
  );
};

export default Home;
