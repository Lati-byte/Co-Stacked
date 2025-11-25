// src/pages/HomePage.jsx

// --- THIS IS THE UPDATE ---
// Import the useTheme hook from its new, simple file.
import { useTheme } from '../context/ThemeContext';

// Import BOTH hero images with their correct paths.
import heroLight from '../assets/hero-light.jpg';
import heroDark from '../assets/hero-dark.png';

// Import other necessary components
import { Button } from '../components/shared/Button';
import { FeatureCard } from '../components/shared/FeatureCard';
import { Lightbulb, Users, ShieldCheck } from 'lucide-react';
import styles from './HomePage.module.css';

// Data can remain outside the component
const features = [
  { icon: Lightbulb, title: '1. Share Your Vision', description: 'Founders post their project ideas, detailing the skills needed and their collaboration style.' },
  { icon: Users, title: '2. Discover Your Match', description: 'Developers browse projects, and founders can search for talent based on specific skills.' },
  { icon: ShieldCheck, title: '3. Collaborate & Build', description: 'Connect with your ideal partner and start building amazing things together securely.' },
];
const testimonials = [
  { name: "Sarah L.", role: "Founder, Innovate Inc.", quote: "CoStacked was the bridge I needed. I found a brilliant developer in just a week!" },
  { name: "Mike R.", role: "React Developer", quote: "I was tired of boring projects. On CoStacked, I found a startup I was passionate about." }
];

export const HomePage = () => {
  const { theme } = useTheme(); // Get the current theme from our context

  // Conditionally select the correct image source based on the theme
  const heroBgImage = theme === 'light' ? heroLight : heroDark;

  return (
    <div className={styles.pageContainer}>
      <section 
        className={styles.hero} 
        // Apply the selected image as a CSS variable via an inline style
        style={{ '--hero-bg-image': `url(${heroBgImage})` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Connect, Collaborate, Create. <br /> Your Next Project Starts Here.
          </h1>
          <p className={styles.heroSubtitle}>
            CoStacked is the platform where ambitious founders and talented developers unite to build the future. Find your perfect match and bring your ideas to life.
          </p>
          <div className={styles.heroActions}>
            <Button to="/projects" variant="primary">Discover Projects</Button>
            <Button to="/signup" variant="outline">Join the Community</Button>
          </div>
        </div>
      </section>

      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How CoStacked Works</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      
    </div>
  );
};