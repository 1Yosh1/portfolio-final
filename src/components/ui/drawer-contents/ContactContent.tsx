'use client';

import { useState, useRef, FormEvent } from 'react';
import gsap from 'gsap';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactContent() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const stampRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    // Simulate send (replace with EmailJS in production):
    // import emailjs from '@emailjs/browser';
    // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', values, 'PUBLIC_KEY');
    await new Promise((r) => setTimeout(r, 1200));

    setFormState('success');

    // Stamp animation
    if (stampRef.current) {
      gsap.fromTo(
        stampRef.current,
        { scale: 2.5, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 0.85, rotate: -8, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  };

  if (formState === 'success') {
    return (
      <div className="form-success">
        <div className="document-stamp stamp-live" ref={stampRef} style={{ display: 'inline-block' }}>
          MESSAGE SENT
        </div>
        <h2 className="doc-title" style={{ marginTop: 'var(--space-xl)' }}>
          Transmission received.
        </h2>
        <p className="doc-body" style={{ marginTop: 'var(--space-md)' }}>
          Thank you for reaching out. I&apos;ll get back to you shortly.
        </p>
        <p className="doc-category" style={{ marginTop: 'var(--space-md)' }}>
          {PROFILE.email}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="document-stamp stamp-contact">DISPATCH</div>
      <h2 className="doc-title">Send a Message</h2>
      <span className="doc-category">
        <Mail size={10} style={{ display: 'inline', marginRight: 4 }} />
        {PROFILE.email}
      </span>

      <hr className="doc-divider" />

      <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="contact-name">
            <User size={10} style={{ display: 'inline', marginRight: 4 }} />
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            className="form-input"
            placeholder="Jack Skellington"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            disabled={formState === 'sending'}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="contact-email">
            <Mail size={10} style={{ display: 'inline', marginRight: 4 }} />
            Email Address
          </label>
          <input
            id="contact-email"
            type="email"
            className="form-input"
            placeholder="jack@halloweentown.com"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            disabled={formState === 'sending'}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="contact-message">
            <MessageSquare size={10} style={{ display: 'inline', marginRight: 4 }} />
            Message
          </label>
          <textarea
            id="contact-message"
            className="form-textarea"
            placeholder="This is Halloween, this is Halloween..."
            required
            rows={4}
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            disabled={formState === 'sending'}
          />
        </div>

        {formState === 'error' && (
          <p style={{ color: '#8a2020', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            ✕ Failed to send. Please try emailing directly.
          </p>
        )}

        <button
          type="submit"
          className="form-submit"
          disabled={formState === 'sending'}
          id="contact-submit-btn"
        >
          {formState === 'sending' ? (
            'Sending...'
          ) : (
            <>
              <Send size={11} style={{ display: 'inline', marginRight: 6 }} />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Note about EmailJS */}
      <p
        style={{
          marginTop: 'var(--space-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: '#9a8a6a',
          letterSpacing: '0.1em',
        }}
      >
        ℹ︎ Add your EmailJS credentials in <code>src/data/portfolioData.ts</code> to enable live sending.
      </p>
    </>
  );
}
