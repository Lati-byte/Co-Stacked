// src/pages/HomePage.jsx

import { Link } from 'react-router-dom';
import { Button } from '../components/shared/Button';
import { FeatureCard } from '../components/shared/FeatureCard';
import { TestimonialCard } from '../components/shared/TestimonialCard';
import { Lightbulb, Users, ShieldCheck } from 'lucide-react';
import heroBgImage from '../assets/hero-background.jpg';
import styles from './HomePage.module.css';

// 3. Define the data for our features
const features = [
  {
    icon: Lightbulb,
    title: '1. Share Your Vision',
    description: 'Founders post their project ideas, detailing the skills needed, compensation, and their collaboration style.',
  },
  {
    icon: Users,
    title: '2. Discover Your Match',
    description: 'Developers browse projects, and founders can search for talent based on specific skills, roles, and interests.',
  },
  {
    icon: ShieldCheck,
    title: '3. Collaborate & Build',
    description: 'Connect with your ideal partner, discuss details, and start building amazing things together securely.',
  },
];

const testimonials = [
  {
    quote: "CoStacked helped me find the perfect co-founder for my startup. The matching process was incredibly efficient!",
    authorName: 'Jane Smith',
    authorRole: 'Founder',
  },
  {
    quote: "As a developer, I found exciting projects that truly aligned with my skills and passion. Highly recommend!",
    authorName: 'Mark Davis',
    authorRole: 'Developer',
  },
  {
    quote: "The best platform for connecting with like-minded individuals. My project took off thanks to CoStacked!",
    authorName: 'Anna Lee',
    authorRole: 'Creative',
  }
];



export const HomePage = () => {
  return (
    <>
     <section 
        className={styles.hero} 
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
      <h1 className={styles.headline}>
        Connect, Collaborate, Create. <br /> Your Next Project Starts Here.
      </h1>
      <p className={styles.tagline}>
        CoStacked is the platform where ambitious founders and talented developers unite to build the future. Find your perfect match and bring your ideas to life.
      </p>

      {/* === THIS IS THE UPDATED SECTION === */}
      <div className={styles.ctaGroup}>
        {/* This button correctly leads to the general sign-up/login flow */}
        <Button 
          variant="primary" 
          to="/signup"
        >
          Join as Developer
        </Button>
        
        {/* This button now takes founders directly to their primary action */}
        <Button 
          variant="secondary" 
          to="/post-project" // <-- THIS IS THE CRITICAL CHANGE
        >
          Post a Project
        </Button>

        <Link to="/projects" className={styles.browseLink}>
          Browse Projects
        </Link>
      </div>
    </section>

     {/* 4. ADD THE NEW SECTION */}
      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How CoStacked Works</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              IconComponent={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

       <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>What Our Users Say</h2>
        <div className={styles.featuresGrid}> {/* We can reuse this grid style! */}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
            />
          ))}
        </div>
      </section>
    </>
  );
};