// src/pages/TermsOfServicePage.jsx

import styles from './LegalPage.module.css'; // Reusing our existing legal page styles

export const TermsOfServicePage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Terms of Service</h1>
          <p>Last Updated: October 3, 2025</p>
        </header>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>By using the CoStacked platform ("Site", "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service. These terms apply to all visitors, users, and others who access or use the Service.</p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>CoStacked provides a platform for individuals ("Founders") to post summaries of their project ideas and for other individuals ("Developers") to connect with them for potential collaboration. We are a platform for facilitating connections and are not a party to any agreement entered into between users.</p>
        </section>
        
        <section>
          <h2>3. User Accounts</h2>
          <p>To access most features of the Site, you must register for an account. When you register, you agree to provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
        </section>
        
        <section>
          <h2>4. User Content and Conduct</h2>
          <p>You are solely responsible for the content you post, including project descriptions, profile information, and messages ("User Content"). You agree not to post User Content that is unlawful, harmful, threatening, abusive, or otherwise objectionable.</p>
          <p>You grant Co-Stacked a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the User Content solely for the purposes of operating and providing the Service.</p>
        </section>
        
        <section>
          <h2>5. Intellectual Property</h2>
          <p>CoStacked is a platform for sharing ideas. When you connect with another user, you may be exposed to their confidential information. The **Non-Disclosure Agreement (NDA)** presented before you connect governs the confidentiality of this information. Co-Stacked does not claim ownership rights in the project ideas or content you post. The intellectual property of projects remains with the original Founder or as agreed between collaborating parties.</p>
        </section>

        <section>
          <h2>6. Limitation of Liability</h2>
          <p>In no event shall CoStacked, nor its directors or employees, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          <p><strong>Disclaimer:</strong> CoStacked does not vet users or projects. We are not responsible for the conduct of any user of our service. You are solely responsible for your interactions with other users.</p>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of South Africa, without regard to its conflict of law provisions.</p>
        </section>
        
        <section>
          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at: legal@costacked.com</p>
        </section>
      </div>
    </div>
  );
};