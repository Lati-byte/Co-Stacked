// src/pages/PrivacyPolicyPage.jsx

import styles from './LegalPage.module.css'; // We'll use a shared style for legal pages

export const PrivacyPolicyPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Privacy Policy for Co-Stacked</h1>
          <p>Last Updated: October 3, 2025</p>
        </header>

        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Co-Stacked ("we," "our," "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms, do not access the site.</p>
        </section>

        <section>
          <h2>2. Collection of Your Information</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the Site.</li>
            <li><strong>Profile Data:</strong> Information you provide for your user profile, such as your bio, skills, location, availability, portfolio links, and avatar. This information is displayed publicly to facilitate connections.</li>
            <li><strong>Project Data:</strong> Information and content you post for project listings, including titles, descriptions, and required skills. This content is considered public.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, and the dates and times you access the Site.</li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Facilitate connections between founders and developers.</li>
            <li>Display your profile and project information to other users.</li>
            <li>Email you regarding your account or project interactions.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
            <li>Resolve disputes and troubleshoot problems.</li>
          </ul>
        </section>

        <section>
          <h2>4. Disclosure of Your Information</h2>
          <p>We do not share your personal information with third parties except as described in this policy. We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul>
            <li><strong>Publicly on the Platform:</strong> Your profile information (name, bio, skills, etc.) and project details are visible to other users of the platform to enable the core functionality of Co-Stacked.</li>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, we may share your information as permitted or required by any applicable law.</li>
          </ul>
        </section>
        
        <section>
          <h2>5. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at: privacy@costacked.com</p>
        </section>
      </div>
    </div>
  );
};