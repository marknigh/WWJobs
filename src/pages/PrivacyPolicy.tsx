import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your information.
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect personal information such as your name, email address,
        and usage data when you use our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">
        We use your information to provide and improve our services, communicate
        with you, and ensure security.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        3. Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not share your personal information with third parties except as
        required by law or to provide our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
      <p className="mb-4">
        We implement appropriate security measures to protect your information
        from unauthorized access or disclosure.
      </p>
      <h2 className="text-2xl font-semibold mb-2">5. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at{' '}
        <a
          href="mailto:support@example.com"
          className="text-blue-500 underline"
        >
          mark@marknigh.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
