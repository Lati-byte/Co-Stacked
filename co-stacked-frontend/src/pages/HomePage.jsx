// src/pages/HomePage.jsx

import { Link } from 'react-router-dom'; // Keep for other potential links
import { Button } from '../components/shared/Button';
import { FeatureCard } from '../components/shared/FeatureCard';
import { TestimonialCard } from '../components/shared/TestimonialCard';
import { Lightbulb, Users, ShieldCheck } from 'lucide-react';
import heroBgImage from '../assets/hero-background.jpg'; // Ensure this path and extension are correct
import styles from './HomePage.module.css';

// Define data outside the component to prevent re-creation on every render
const features = [
  { icon: Lightbulb, title: '1. Share Your Vision', description: 'Founders post their project ideas, detailing the skills needed, compensation, and their collaboration style.' },
  { icon: Users, title: '2. Discover Your Match', description: 'Developers browse projects, and founders can search for talent based on specific skills, roles, and interests.' },
  { icon: ShieldCheck, title: '3. Collaborate & Build', description: 'Connect with your ideal partner, discuss details, and start building amazing things together securely.' },
];
const testimonials = [
  { quote: "CoStacked helped me find the perfect co-founder for my startup...", authorName: 'Jane Smith', authorRole: 'Founder' },
  { quote: "As a developer, I found exciting projects that truly aligned with my skills...", authorName: 'Mark Davis', authorRole: 'Developer' },
  { quote: "The best platform for connecting with like-minded individuals...", authorName: 'Anna Lee', authorRole: 'Creative' },
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

        <div className={styles.ctaGroup}>
          <Button 
            variant="primary" 
            to="/signup"
          >
            Join as Developer
          </Button>
          
           <Button variant="outline" to="/post-project">
            Post a Project
          </Button>
          
          {/* === THIS IS THE UPDATE === */}
          {/* Replaced the <Link> with our Button component for consistent styling */}
          <Button 
            variant="outline" 
            to="/projects"
          >
            Browse Projects
          </Button>
          {/* ========================== */}

        </div>
      </section>

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
        <div className={styles.featuresGrid}>
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