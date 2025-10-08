// src/pages/SupportPage.jsx
import { useState } from 'react';
import { Accordion } from '../components/shared/Accordion';
import { Card } from '../components/shared/Card';
import { Input } from '../components/shared/Input';
import { Label } from '../components/shared/Label';
import { Select } from '../components/shared/Select';
import { Textarea } from '../components/shared/Textarea';
import { Button } from '../components/shared/Button';
import styles from './SupportPage.module.css';

// What's important for Co-Stacked: Clear, helpful FAQs
const faqs = [
  {
    question: "How do I post a project?",
    answer: "Navigate to your dashboard and click the 'Post a New Project' button. Fill out the form with as much detail as possible to attract the right talent."
  },
  {
    question: "What happens when I 'connect' with a user?",
    answer: "When you express interest in a project, the project founder receives a notification. If they approve your request, a direct message channel is opened for both of you to discuss details."
  },
  {
    question: "How do I report a user or project?",
    answer: "If you encounter a user or project that violates our community guidelines, please use the contact form below with the subject 'User/Project Report'. Include the user's name, project title, and a description of the issue."
  },
  {
    question: "How can I delete my account?",
    answer: "You can request account deletion by navigating to Settings > Account and clicking 'Delete Account'. Please note this action is irreversible."
  }
];

export const SupportPage = () => {
  const [formData, setFormData] = useState({ subject: 'general', message: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting support ticket:", formData);
    alert("Your support request has been sent. We'll get back to you shortly!");
    setFormData({ subject: 'general', message: '' }); // Reset form
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Support Center</h1>
        <p className={styles.subtitle}>How can we help you today?</p>
      </header>

      {/* --- FAQ Section --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          {faqs.map((faq) => (
            <Accordion key={faq.question} title={faq.question}>
              {/* This extra div ensures proper padding inside the animated content */}
              <div>{faq.answer}</div> 
            </Accordion>
          ))}
        </div>
      </section>

      {/* --- Contact Form Section --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Still need help?</h2>
        <p className={styles.sectionSubtitle}>Send us a message and our team will get back to you.</p>
        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <Label htmlFor="subject">What is your question about?</Label>
              <Select id="subject" name="subject" value={formData.subject} onChange={handleChange}
                options={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'technical', label: 'Technical Issue' },
                  { value: 'report', label: 'User/Project Report' },
                  { value: 'account', label: 'Account Help' }
                ]}
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="message">Your Message</Label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} required placeholder="Please describe your issue in detail..."/>
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </Card>
      </section>
    </div>
  );
};