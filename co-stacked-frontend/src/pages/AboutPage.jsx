// src/pages/AboutPage.jsx
import { Button } from '../components/shared/Button';
import { TeamMemberCard } from '../components/about/TeamMemberCard';
import styles from './AboutPage.module.css';

// Placeholder for founder image - put a real image in your assets folder!
import founderImage from '../assets/IMG_7062.jpeg; 

export const AboutPage = () => {
  return (
    <div className={styles.pageContainer}>
      {/* --- Hero Section --- */}
      <section className={styles.hero}>
        <h1>Our mission is to bridge the gap between brilliant ideas and brilliant minds.</h1>
        <p>We believe that no great idea should fail simply because the right people couldn't find each other. Co-Stacked was built to be the launchpad for the next generation of digital products and startups.</p>
      </section>

      {/* --- Our Story Section --- */}
      <section className={styles.storySection}>
        <div className={styles.storyContent}>
          <h2>From a single idea to a community.</h2>
          <p>Co-Stacked was born from a simple observation: founders with groundbreaking ideas often struggle to find the technical talent to bring them to life. At the same time, countless skilled developers are searching for meaningful projects to contribute to, learn from, or even co-found.</p>
          <p>We created this platform to be that essential bridge. A place for collaboration, innovation, and shared success. It's a space built on the belief that the right partnership can turn a simple concept into a world-changing reality.</p>
        </div>
      </section>

      {/* --- Meet the Team Section --- */}
      <section className={styles.teamSection}>
        <h2>Meet the Founder</h2>
        <div className={styles.teamGrid}>
          <TeamMemberCard 
            imageUrl={founderImage}
            name="Moise Kobokiba"
            role="Founder & Full-Stack Developer"
            linkedInUrl="http://linkedin.com/in/moise-kobokiba"
          />
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className={styles.ctaSection}>
        <h2>Ready to Build the Future?</h2>
        <p>Whether you're a founder with a vision or a developer ready for a challenge, your journey starts here.</p>
        <div className={styles.ctaButtons}>
            <Button to="/projects" variant="primary">Explore Projects</Button>
            <Button to="/signup" variant="secondary">Join the Community</Button>
        </div>
      </section>
    </div>
  );
};