import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Container } from '@mui/material';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import HowItWorksSection from '../../components/landing/HowItWorksSection';
import BenefitsSection from '../../components/landing/BenefitsSection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import CtaSection from '../../components/landing/CtaSection';
import { HeroSkeleton } from '../../components/ui/SkeletonBlock';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <HeroSkeleton />
      </Container>
    );
  }

  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CtaSection />
    </Box>
  );
};

export default Home;
